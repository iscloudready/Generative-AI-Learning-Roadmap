#!/usr/bin/env python3
"""Aegis Rule D - repository topology guard.

Why: the Aegis repo drifted into two UNRELATED histories (`main` v0.4->v2.3b and `master`, the live trunk) plus a pile of
stale feature branches; CI only watched the stale one and a live Telegram token sat in a tracked `.env`. Nothing in the
existing rules (A: out-of-band commits, B: deviation registry, C: governance baseline) looked at the *shape* of the
repository, so nothing noticed. This guard does, using nothing but git (no network, no third-party packages).

Checks (id - severity when violated):
  G1  trunk-exists          FAIL  the configured trunk ref cannot be resolved
  G2  default-vs-trunk      FAIL  default branch and trunk have DIVERGED (each has commits the other lacks)
                            WARN  default branch is simply behind trunk (fast-forwardable)
  G3  unrelated-history     FAIL  a branch shares NO common ancestor with the trunk (the original defect)
  G4  stale-branch          WARN  an unmerged branch has no commit for > max_branch_age_days
  G5  too-many-open         FAIL  more unmerged branches than max_open_branches
  G6  drifted-branch        WARN  a branch is > max_behind_trunk commits behind the trunk
  G7  ci-triggers           FAIL  a workflow filters `branches:` but omits the trunk (pushes would go untested)
  G8  tracked-forbidden     FAIL  a tracked file matches forbid_tracked (e.g. **/.env, cookie files)
  G9  case-collision        FAIL  two tracked paths differ only by case (README.md vs readme.md broke a checkout once)
  P1-P4 push policy        FAIL  (pre-push hook, `--pre-push`): delete / force-push of a protected branch, push to a forbidden
                            branch name (master), direct push to a protected branch when trunk_push_policy = pr-only.
                            Bypass: GUARDRAILS_BYPASS=1 (allowed, logged to .git/guardrails-bypass.log, reported as WARN)
  G11 tracked-cache         FAIL  a regenerable cache (__pycache__, node_modules, venv, .pytest_cache, *.pyc ...) is tracked
  G10 hooks-installed       WARN  core.hooksPath is not .githooks (EN-1 commit gate is per-clone opt-in); skipped with --ci

Exceptions are explicit, owned and EXPIRING (`.aegis/guardrails.json` -> "exceptions"); an expired exception counts as a
violation again, so a deviation can be tolerated but never forgotten.

Usage:
    python scripts/guardrails/repo_topology_guard.py                 # full report, exit code = number of FAILs (max 99)
    python scripts/guardrails/repo_topology_guard.py --scope push    # cheap pre-push subset (G3 for HEAD, G8, G9)
    python scripts/guardrails/repo_topology_guard.py --ci --strict   # CI: skip G10, WARN also fails
    python scripts/guardrails/repo_topology_guard.py --json out.json
    python scripts/guardrails/repo_topology_guard.py --register-url http://aegis-api:5000 --api-key $AEGIS_API_KEY
        # files each finding as a `repo-topology` deviation (Rule B ledger; dedupe_key makes re-runs updates)
"""
from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import json
import os
import re
import subprocess
import sys
from collections import Counter

DEFAULT_CONFIG = {
    "trunk": "master",
    "default_branch": "main",
    "remote": "origin",
    "max_branch_age_days": 30,
    "max_open_branches": 8,
    "max_behind_trunk": 50,
    "ignore_branches": ["HEAD"],
    "forbid_tracked": ["**/.env", ".env", "**/cookie*.txt", "**/.coverage", ".coverage"],
    "exceptions": [],
    # G11: regenerable caches must never be tracked (a venv once put 10,779 files into a repo); matched as path components / suffixes
    "forbid_tracked_dirs": ["__pycache__", "node_modules", ".venv", "venv", ".pytest_cache", ".mypy_cache", ".ruff_cache"],
    "forbid_tracked_suffixes": [".pyc"],
    # --- push policy (our-side branch protection: enforced by the pre-push hook, independent of GitHub settings) ---
    "protected_branches": [],              # default: [trunk]
    "forbid_force_push": True,             # non-fast-forward update of a protected branch
    "forbid_branch_delete": True,          # deleting a protected branch
    "retained_suffixes": ["-merged", "-archived"],   # branches renamed by the estate naming convention: reviewed + retained, exempt from G4/G5/G6
    "forbidden_branch_names": ["master"],  # the estate standard is `main`; creating/updating these is refused (deleting is allowed)
    "trunk_push_policy": "ff-only",        # ff-only | pr-only (refuse direct pushes to protected branches) | open
}


def git(repo: str, *args: str, check: bool = False) -> subprocess.CompletedProcess:
    r = subprocess.run(["git", "-C", repo, *args], capture_output=True, text=True, errors="replace")
    if check and r.returncode != 0:
        raise RuntimeError("git " + " ".join(args) + " failed: " + r.stderr.strip())
    return r


class Finding:
    def __init__(self, check: str, severity: str, subject: str, detail: str):
        self.check, self.severity, self.subject, self.detail = check, severity, subject, detail

    def as_dict(self) -> dict:
        return {"check": self.check, "severity": self.severity, "subject": self.subject, "detail": self.detail}


def load_config(repo: str, path: str | None) -> dict:
    cfg = json.loads(json.dumps(DEFAULT_CONFIG))
    p = path or os.path.join(repo, ".aegis", "guardrails.json")
    if os.path.isfile(p):
        with open(p, encoding="utf-8") as fh:
            cfg.update(json.load(fh))
    return cfg


def resolve(repo: str, name: str, remote: str) -> str | None:
    """Resolve a branch name to a ref, preferring the remote-tracking ref (the shared truth) over a local one."""
    for cand in (f"refs/remotes/{remote}/{name}", f"refs/heads/{name}"):
        if git(repo, "rev-parse", "--verify", "-q", cand).returncode == 0:
            return cand
    return None


def list_branches(repo: str, cfg: dict) -> dict[str, str]:
    """name -> ref. Remote-tracking refs when the repo has them, otherwise local heads (fresh clone vs scratch repo)."""
    remote = cfg["remote"]
    out = git(repo, "for-each-ref", "--format=%(refname)", f"refs/remotes/{remote}/").stdout.split()
    prefix = f"refs/remotes/{remote}/"
    if not out:
        out = git(repo, "for-each-ref", "--format=%(refname)", "refs/heads/").stdout.split()
        prefix = "refs/heads/"
    return {r[len(prefix):]: r for r in out if r[len(prefix):] not in cfg["ignore_branches"]}


def active_exception(cfg: dict, branch: str, today: dt.date):
    """(exception, expired) for the branch, or (None, False)."""
    for ex in cfg.get("exceptions", []):
        if fnmatch.fnmatch(branch, ex.get("branch", "")):
            exp = ex.get("expires")
            expired = bool(exp) and dt.date.fromisoformat(exp) < today
            return ex, expired
    return None, False


def count(repo: str, rng: str) -> int:
    r = git(repo, "rev-list", "--count", rng)
    return int(r.stdout.strip() or 0) if r.returncode == 0 else -1


def check_topology(repo: str, cfg: dict, today: dt.date, scope: str) -> list[Finding]:
    f: list[Finding] = []
    remote = cfg["remote"]
    trunk_name = cfg["trunk"]
    trunk = resolve(repo, trunk_name, remote)
    if trunk is None:
        f.append(Finding("G1", "FAIL", trunk_name, f"trunk '{trunk_name}' cannot be resolved (no {remote}/{trunk_name} and no local branch)"))
        return f

    # ---- G2 default vs trunk ---------------------------------------------------------------------------------
    dname = cfg.get("default_branch")
    default = resolve(repo, dname, remote) if dname else None
    if default and default != trunk:
        ahead, behind = count(repo, f"{trunk}..{default}"), count(repo, f"{default}..{trunk}")
        has_base = git(repo, "merge-base", default, trunk).returncode == 0
        if not has_base:
            f.append(Finding("G2", "FAIL", dname, f"default branch '{dname}' and trunk '{trunk_name}' are UNRELATED histories "
                             f"({ahead} vs {behind} commits, no common ancestor)"))
        elif ahead > 0 and behind > 0:
            f.append(Finding("G2", "FAIL", dname, f"default branch '{dname}' and trunk '{trunk_name}' have DIVERGED "
                             f"(+{ahead} / -{behind}); merge one into the other"))
        elif behind > 0:
            f.append(Finding("G2", "WARN", dname, f"default branch '{dname}' is {behind} commits behind trunk '{trunk_name}' "
                             f"(fast-forwardable): git push {remote} {trunk_name}:{dname}"))
        elif ahead > 0:
            f.append(Finding("G2", "WARN", dname, f"default branch '{dname}' is {ahead} commits AHEAD of trunk '{trunk_name}': "
                             f"work is landing on the wrong branch"))

    branches = list_branches(repo, cfg)
    if scope == "push":
        head = git(repo, "rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
        branches = {head: "HEAD"} if head and head != trunk_name else {}

    # ---- G3-G6 per branch --------------------------------------------------------------------------------------
    open_branches = []
    for name, ref in sorted(branches.items()):
        if ref == trunk or name == trunk_name or ref == default:
            continue
        if name.endswith(tuple(cfg.get("retained_suffixes") or ())):
            continue                                        # naming convention: already reviewed and retained on purpose
        ex, expired = active_exception(cfg, name, today)
        if ex and not expired:
            continue                                        # explicit, owned, unexpired exception (any check)
        if git(repo, "merge-base", ref, trunk).returncode != 0:
            f.append(Finding("G3", "FAIL", name, f"'{name}' shares NO common ancestor with trunk '{trunk_name}' (unrelated history)"
                             + (f" - exception '{ex.get('reason','')}' expired {ex.get('expires')}" if ex and expired else "")))
            continue
        if scope == "push":
            continue
        if git(repo, "merge-base", "--is-ancestor", ref, trunk).returncode == 0:
            continue                                        # fully merged: nothing to report
        ahead, behind = count(repo, f"{trunk}..{ref}"), count(repo, f"{ref}..{trunk}")
        last = git(repo, "log", "-1", "--format=%cs", ref).stdout.strip()
        age = (today - dt.date.fromisoformat(last)).days if last else 0
        open_branches.append(name)
        if expired:
            f.append(Finding("G4", "FAIL", name, f"exception for '{name}' EXPIRED {ex.get('expires')} ({ex.get('reason','')}): merge it, archive-tag it, or renew with an owner"))
        elif age > cfg["max_branch_age_days"]:
            f.append(Finding("G4", "WARN", name, f"'{name}' is unmerged and idle for {age} days (+{ahead}/-{behind} vs trunk)"))
        if behind > cfg["max_behind_trunk"]:
            f.append(Finding("G6", "WARN", name, f"'{name}' is {behind} commits behind trunk '{trunk_name}': integrate before it drifts further"))
    if scope != "push" and len(open_branches) > cfg["max_open_branches"]:
        f.append(Finding("G5", "FAIL", "branches", f"{len(open_branches)} unmerged branches exceed the limit of {cfg['max_open_branches']}: "
                         + ", ".join(open_branches[:12]) + (" ..." if len(open_branches) > 12 else "")))
    return f


ZERO = "0" * 40


def check_push_refs(repo: str, cfg: dict, lines: list[str], bypass: bool = False) -> list[Finding]:
    """Our-side branch protection. `lines` are git's pre-push stdin records: '<local ref> <local sha> <remote ref> <remote sha>'."""
    f: list[Finding] = []
    protected = set(cfg.get("protected_branches") or [cfg["trunk"]])
    forbidden = set(cfg.get("forbidden_branch_names") or [])
    policy = cfg.get("trunk_push_policy", "ff-only")
    sev = "WARN" if bypass else "FAIL"
    tag = " (bypassed via GUARDRAILS_BYPASS)" if bypass else ""
    for ln in lines:
        parts = ln.split()
        if len(parts) != 4 or not parts[2].startswith("refs/heads/"):
            continue                                        # tags and other refs are not branch-protected
        _lref, lsha, rref, rsha = parts
        name = rref[len("refs/heads/"):]
        deleting = lsha == ZERO
        if name in forbidden and not deleting:
            f.append(Finding("P3", sev, name, f"push to '{name}' refused: the estate standard trunk name is '{cfg['trunk']}'{tag}"))
            continue
        if name not in protected:
            continue
        if deleting:
            if cfg.get("forbid_branch_delete", True):
                f.append(Finding("P1", sev, name, f"deleting protected branch '{name}' refused{tag}"))
            continue
        if rsha != ZERO and cfg.get("forbid_force_push", True):
            if git(repo, "merge-base", "--is-ancestor", rsha, lsha).returncode != 0:
                f.append(Finding("P2", sev, name, f"non-fast-forward (force) push to protected branch '{name}' refused: the remote has commits your push would discard{tag}"))
                continue
        if policy == "pr-only":
            f.append(Finding("P4", sev, name, f"direct push to protected branch '{name}' refused (trunk_push_policy=pr-only): open a PR from a feature branch{tag}"))
    return f


def check_files(repo: str, cfg: dict) -> list[Finding]:
    f: list[Finding] = []
    files = [p for p in git(repo, "ls-files", "-z").stdout.split("\0") if p]
    safe = (".example", ".sample", ".template")
    hits = sorted({p for p in files for pat in cfg["forbid_tracked"]
                   if not p.endswith(safe)
                   and (fnmatch.fnmatch(p, pat) or fnmatch.fnmatch(p.rsplit("/", 1)[-1], pat.rsplit("/", 1)[-1]))})
    if hits:
        f.append(Finding("G8", "FAIL", hits[0], f"{len(hits)} tracked file(s) match forbid_tracked (secrets/artifacts must never be committed): "
                         + ", ".join(hits[:6]) + (" ..." if len(hits) > 6 else "")))
    cache_hits = sorted({p for p in files if any(part in cfg["forbid_tracked_dirs"] for part in p.split("/")[:-1]) or p.endswith(tuple(cfg["forbid_tracked_suffixes"]))})
    if cache_hits:
        f.append(Finding("G11", "FAIL", cache_hits[0], f"{len(cache_hits)} tracked cache file(s) (untrack with: git rm -r --cached <dir>, then ignore it): " + ", ".join(cache_hits[:4]) + (" ..." if len(cache_hits) > 4 else "")))
    seen: dict[str, list[str]] = {}
    for p in files:
        seen.setdefault(p.lower(), []).append(p)
    clashes = [v for v in seen.values() if len(v) > 1]
    if clashes:
        f.append(Finding("G9", "FAIL", clashes[0][0], f"{len(clashes)} case-colliding path set(s) (break checkouts on Windows/macOS): "
                         + "; ".join(" vs ".join(c) for c in clashes[:4])))
    return f


_BRANCH_LINE = re.compile(r"^\s*branches\s*:\s*\[(.*?)\]", re.M)


def check_ci(repo: str, cfg: dict) -> list[Finding]:
    f: list[Finding] = []
    wf_dir = os.path.join(repo, ".github", "workflows")
    if not os.path.isdir(wf_dir):
        return f
    trunk = cfg["trunk"]
    for name in sorted(os.listdir(wf_dir)):
        if not name.endswith((".yml", ".yaml")):
            continue
        text = open(os.path.join(wf_dir, name), encoding="utf-8", errors="replace").read()
        for m in _BRANCH_LINE.finditer(text):
            allowed = [b.strip().strip("'\"") for b in m.group(1).split(",") if b.strip()]
            if not any(fnmatch.fnmatch(trunk, a) for a in allowed):
                f.append(Finding("G7", "FAIL", name, f"workflow filters branches to {allowed} but trunk '{trunk}' is not covered: pushes/PRs to the trunk are untested"))
                break
    return f


def check_hooks(repo: str) -> list[Finding]:
    path = git(repo, "config", "--get", "core.hooksPath").stdout.strip()
    if path != ".githooks":
        return [Finding("G10", "WARN", "core.hooksPath", f"core.hooksPath is '{path or 'unset'}', expected '.githooks': the EN-1 commit gate "
                        "is NOT active in this clone (run: sh .githooks/install-hooks.sh)")]
    return []


def run_checks(repo: str, cfg: dict, scope: str = "full", ci: bool = False, today: dt.date | None = None) -> list[Finding]:
    today = today or dt.date.today()
    out = check_topology(repo, cfg, today, scope) + check_files(repo, cfg)
    if scope != "push":
        out += check_ci(repo, cfg)
        if not ci:
            out += check_hooks(repo)
    return out


def register(findings: list[Finding], url: str, api_key: str, repo_name: str) -> int:
    import urllib.request
    sent = 0
    for x in findings:
        if x.severity == "OK":
            continue
        body = json.dumps({"type": "repo-topology", "severity": "high" if x.severity == "FAIL" else "medium",
                           "source": "repo_topology_guard", "repo": repo_name, "subject": f"{x.check}:{x.subject}",
                           "detail": x.detail, "action": "notify", "dedupe_key": f"repo-topology:{repo_name}:{x.check}:{x.subject}"}).encode()
        req = urllib.request.Request(url.rstrip("/") + "/deviations", data=body, method="POST",
                                     headers={"Content-Type": "application/json", "X-API-Key": api_key})
        try:
            urllib.request.urlopen(req, timeout=10).read()
            sent += 1
        except Exception as e:  # registry is best effort; the exit code is the real gate
            print(f"  (could not register {x.check}:{x.subject}: {e})", file=sys.stderr)
    return sent


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--repo", default=".")
    ap.add_argument("--config")
    ap.add_argument("--scope", choices=["full", "push"], default="full")
    ap.add_argument("--ci", action="store_true", help="CI mode: skip the local-only hook check")
    ap.add_argument("--strict", action="store_true", help="WARN counts as FAIL")
    ap.add_argument("--pre-push", action="store_true", help="read git's pre-push stdin and apply the push policy (P1-P4)")
    ap.add_argument("--json", help="write findings as JSON")
    ap.add_argument("--register-url", help="Aegis API base URL; files findings in the deviation registry")
    ap.add_argument("--api-key", default=os.getenv("AEGIS_API_KEY", ""))
    a = ap.parse_args(argv)

    repo = os.path.abspath(a.repo)
    cfg = load_config(repo, a.config)
    findings = run_checks(repo, cfg, a.scope, a.ci)
    if a.pre_push:
        bypass = os.getenv("GUARDRAILS_BYPASS") == "1"
        refs = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
        pushed = check_push_refs(repo, cfg, refs, bypass)
        findings += pushed
        if bypass and pushed:
            log = git(repo, "rev-parse", "--git-dir").stdout.strip()
            with open(os.path.join(repo, log, "guardrails-bypass.log"), "a", encoding="utf-8") as fh:
                fh.write(dt.datetime.now().isoformat(timespec="seconds") + " " + "; ".join(x.detail for x in pushed) + chr(10))
    fails = [x for x in findings if x.severity == "FAIL"]
    warns = [x for x in findings if x.severity == "WARN"]

    for x in findings:
        print(f"  {x.severity:4}  {x.check:3}  {x.subject}: {x.detail}")
    tally = Counter(x.severity for x in findings)
    print(f"repo-topology guard: {tally.get('FAIL', 0)} FAIL, {tally.get('WARN', 0)} WARN "
          f"(trunk={cfg['trunk']}, scope={a.scope})" + ("  - OK" if not findings else ""))
    if a.json:
        with open(a.json, "w", encoding="utf-8") as fh:
            json.dump({"trunk": cfg["trunk"], "findings": [x.as_dict() for x in findings]}, fh, indent=1)
    if a.register_url and findings:
        n = register(findings, a.register_url, a.api_key, os.path.basename(repo))
        print(f"registered {n} deviation(s) at {a.register_url}")
    bad = len(fails) + (len(warns) if a.strict else 0)
    return min(bad, 99)


if __name__ == "__main__":
    sys.exit(main())
