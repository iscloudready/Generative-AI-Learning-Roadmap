(function () {
  'use strict';

  /* ─── Data ─── */
  const tracks = window.roadmapData.tracks;
  const trackMap = {};
  tracks.forEach(function (t) { trackMap[t.id] = t; });

  const phases = [
    { id: 'foundations', label: 'Foundations',               subtitle: 'Build the mathematical and conceptual base for generative AI.',         trackIds: ['introduction', 'foundations', 'machine-learning', 'deep-learning'] },
    { id: 'llm-core',    label: 'Core LLM Engineering',      subtitle: 'Master the core techniques for building with large language models.',    trackIds: ['llm-engineering', 'rag', 'agents', 'reasoning-models'] },
    { id: 'production',  label: 'Production & Infrastructure',subtitle: 'Deploy, operate, and govern AI systems in production.',                 trackIds: ['infrastructure', 'open-source-ai', 'enterprise'] },
    { id: 'applied',     label: 'Applied AI',                 subtitle: 'Apply AI across domains, modalities, and product experiences.',          trackIds: ['multimodal', 'product-engineering', 'real-world-use-cases', 'tools', 'coding-ai'] },
  ];

  var docLinks = {
    'introduction':          [{ t: 'How to Use This Roadmap', u: 'docs/00-introduction/how-to-use-this-roadmap.md' }, { t: 'Roadmap V2 Overview', u: 'ROADMAP_V2.md' }],
    'foundations':           [{ t: 'Mathematics', u: 'docs/01-scientific-foundations/mathematics.md' }, { t: 'Statistics', u: 'docs/01-scientific-foundations/statistics.md' }],
    'machine-learning':      [{ t: 'Machine Learning', u: 'docs/02-machine-learning-foundations/machine-learning.md' }],
    'deep-learning':         [{ t: 'Transformers', u: 'docs/03-deep-learning-transformers/transformers.md' }],
    'llm-engineering':       [{ t: 'Embeddings', u: 'docs/04-llm-engineering/embeddings.md' }, { t: 'Tokenization', u: 'docs/04-llm-engineering/tokenization.md' }, { t: 'Fine-Tuning', u: 'docs/04-llm-engineering/fine-tuning.md' }, { t: 'Prompt Engineering', u: 'docs/04-llm-engineering/prompt-engineering.md' }, { t: 'Evaluation', u: 'docs/04-llm-engineering/evaluation.md' }, { t: 'Efficient Inference', u: 'docs/04-llm-engineering/efficient-inference.md' }],
    'rag':                   [{ t: 'RAG Overview', u: 'docs/05-rag-systems/rag-overview.md' }, { t: 'Advanced RAG', u: 'docs/05-rag-systems/advanced-rag.md' }],
    'agents':                [{ t: 'Agents Overview', u: 'docs/06-ai-agents/agents.md' }, { t: 'Agent Patterns', u: 'docs/06-ai-agents/agent-patterns.md' }],
    'infrastructure':        [{ t: 'LLMOps', u: 'docs/07-ai-infrastructure/llmops.md' }, { t: 'Observability', u: 'docs/07-ai-infrastructure/observability.md' }],
    'open-source-ai':        [{ t: 'Open Source AI', u: 'docs/08-open-source-ai/open-source-ai.md' }],
    'enterprise':            [{ t: 'Governance', u: 'docs/09-enterprise-ai/governance.md' }],
    'multimodal':            [{ t: 'Multimodal', u: 'docs/10-multimodal-ai/multimodal.md' }],
    'product-engineering':   [{ t: 'Copilots', u: 'docs/11-ai-product-engineering/copilots.md' }],
    'real-world-use-cases':  [{ t: 'DevOps & SRE', u: 'docs/12-real-world-use-cases/devops-sre.md' }, { t: 'Recommender Systems', u: 'docs/12-real-world-use-cases/recommender-systems.md' }],
    'tools':                 [{ t: 'Tools & Frameworks', u: 'docs/13-tools-and-frameworks/tools-and-frameworks.md' }],
    'reasoning-models':      [],
    'coding-ai':             [],
  };

  /* ─── State ─── */
  var progress   = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
  var lastTrack  = localStorage.getItem('roadmap-last-track') || null;
  var currentFilter = 'all';
  var openPhases = JSON.parse(localStorage.getItem('roadmap-open-phases') || '["foundations"]');
  var searchText = '';
  var typeFilter = 'all';

  /* ─── DOM refs ─── */
  var phaseContainer   = document.getElementById('phaseContainer');
  var totalStartedEl   = document.getElementById('totalStarted');
  var completedPctEl   = document.getElementById('completedPct');
  var resourcesDoneEl  = document.getElementById('resourcesDone');
  var resourcesTotalEl = document.getElementById('resourcesTotal');
  var tracksInProgressEl = document.getElementById('tracksInProgress');
  var resumeTrackEl    = document.getElementById('resumeTrack');
  var clearBtn         = document.getElementById('clearProgress');
  var exportBtn        = document.getElementById('exportProgress');
  var themeToggle      = document.getElementById('themeToggle');
  var searchInput      = document.getElementById('searchInput');

  /* ─── Helpers ─── */
  function saveProgress()  { localStorage.setItem('roadmap-progress', JSON.stringify(progress)); }
  function saveOpenPhases(){ localStorage.setItem('roadmap-open-phases', JSON.stringify(openPhases)); }
  function saveLastTrack(id) { lastTrack = id; localStorage.setItem('roadmap-last-track', id); }

  function completedInTrack(id) { var a = progress[id]; return a ? a.length : 0; }
  function totalInTrack(id)     { return trackMap[id] ? trackMap[id].resources.length : 0; }
  function trackPct(id) {
    var total = totalInTrack(id);
    return total === 0 ? 0 : Math.round((completedInTrack(id) / total) * 100);
  }

  function levelMatches(level, filter) {
    if (filter === 'all') return true;
    if (level.toLowerCase() === 'all levels') return true;
    return level.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  /* ─── Type / search filter ─── */
  function typeMatches(resourceType, filter) {
    if (filter === 'all') return true;
    var t = (resourceType || '').toLowerCase();
    if (filter === 'course')      return t === 'course' || t === 'courses';
    if (filter === 'video')       return t === 'video';
    if (filter === 'paper')       return t === 'paper' || t === 'article' || t === 'report';
    if (filter === 'open-source') return t === 'open source';
    if (filter === 'guide')       return t === 'docs' || t === 'guide' || t === 'blog' || t === 'framework' || t === 'security guide' || t === 'benchmark' || t === 'platform' || t === 'book';
    return false;
  }

  function resourceMatchesFilters(r) {
    var st = searchText.toLowerCase();
    var matchesSearch = !st ||
      r.title.toLowerCase().indexOf(st) !== -1 ||
      (r.provider || '').toLowerCase().indexOf(st) !== -1 ||
      (r.type    || '').toLowerCase().indexOf(st) !== -1 ||
      (r.quality || '').toLowerCase().indexOf(st) !== -1;
    return matchesSearch && typeMatches(r.type, typeFilter);
  }

  function isFiltering() { return !!searchText || typeFilter !== 'all'; }

  function typeBadgeClass(type) {
    var t = (type || '').toLowerCase();
    if (t === 'course' || t === 'courses') return 'type-course';
    if (t === 'video')                     return 'type-video';
    if (t === 'paper' || t === 'article' || t === 'report') return 'type-paper';
    if (t === 'open source')               return 'type-opensource';
    if (t === 'docs' || t === 'guide' || t === 'blog' || t === 'framework') return 'type-guide';
    if (t === 'book')                      return 'type-book';
    if (t === 'platform')                  return 'type-platform';
    if (t === 'benchmark' || t === 'security guide') return 'type-benchmark';
    return 'type-other';
  }

  /* ─── Dashboard ─── */
  function updateDashboard() {
    var totalRes = 0, doneRes = 0, startedTracks = 0, inProgressTracks = 0;
    tracks.forEach(function (t) {
      var res  = t.resources.length;
      var done = completedInTrack(t.id);
      totalRes += res;
      doneRes  += done;
      if (done > 0) startedTracks++;
      if (done > 0 && done < res) inProgressTracks++;
    });

    if (totalStartedEl)    totalStartedEl.textContent   = startedTracks;
    if (resourcesDoneEl)   resourcesDoneEl.textContent  = doneRes;
    if (resourcesTotalEl)  resourcesTotalEl.textContent = totalRes;
    if (completedPctEl)    completedPctEl.textContent   = totalRes === 0 ? '0%' : Math.round((doneRes / totalRes) * 100) + '%';
    if (tracksInProgressEl) tracksInProgressEl.textContent = inProgressTracks;

    /* Keep hero stats current */
    var heroTracksEl = document.getElementById('totalTracks');
    var heroResEl    = document.getElementById('totalResources');
    if (heroTracksEl) heroTracksEl.textContent = tracks.length;
    if (heroResEl)    heroResEl.textContent    = totalRes;

    if (resumeTrackEl) {
      resumeTrackEl.textContent = (lastTrack && trackMap[lastTrack])
        ? trackMap[lastTrack].title : 'Not started yet';
    }
  }

  /* ─── Export ─── */
  function exportProgress() {
    var totalRes = tracks.reduce(function (n, t) { return n + t.resources.length; }, 0);
    var doneRes  = tracks.reduce(function (n, t) { return n + completedInTrack(t.id); }, 0);
    var data = {
      exported:  new Date().toISOString(),
      tracks:    tracks.length,
      resources: totalRes,
      completed: doneRes,
      pct:       totalRes === 0 ? 0 : Math.round((doneRes / totalRes) * 100),
      lastTrack: lastTrack,
      progress:  progress,
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = 'genai-roadmap-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ─── Theme ─── */
  function initTheme() {
    var stored = localStorage.getItem('roadmap-theme');
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('roadmap-theme', 'dark');
    }
  }
  function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('roadmap-theme', 'light'); }
    else        { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('roadmap-theme', 'dark'); }
  }
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  initTheme();

  /* ─── Resource toggle ─── */
  function toggleResource(trackId, idx) {
    if (!progress[trackId]) progress[trackId] = [];
    var i = progress[trackId].indexOf(idx);
    if (i === -1) progress[trackId].push(idx);
    else          progress[trackId].splice(i, 1);
    saveProgress();
    saveLastTrack(trackId);

    var item = document.querySelector('.resource-item[data-track="' + trackId + '"][data-idx="' + idx + '"]');
    if (item) {
      var wasDone = progress[trackId].indexOf(idx) !== -1;
      item.classList.toggle('completed', wasDone);
      var check = item.querySelector('.resource-check');
      if (check) check.textContent = wasDone ? '✓' : '';
    }
    updateTrackBadge(trackId);
    updateDashboard();
  }

  function updateTrackBadge(trackId) {
    var card = document.querySelector('.track-card[data-track="' + trackId + '"]');
    if (!card) return;
    var done  = completedInTrack(trackId);
    var total = totalInTrack(trackId);
    var pct   = trackPct(trackId);

    var pill = card.querySelector('.resource-count-pill');
    if (pill) pill.textContent = total + (done > 0 ? ' \xB7 ' + done + '/' + total : '');

    var progressWrap = card.querySelector('.track-progress-wrap');
    if (done > 0) {
      if (progressWrap) {
        var fill  = progressWrap.querySelector('.track-progress-fill');
        var label = progressWrap.querySelector('.track-progress-label');
        if (fill)  fill.style.width    = pct + '%';
        if (label) label.textContent   = pct + '% complete';
      } else {
        var wrap = document.createElement('div');
        wrap.className = 'track-progress-wrap';
        wrap.innerHTML = '<div class="track-progress-bar"><div class="track-progress-fill" style="width:' + pct + '%"></div></div><div class="track-progress-label">' + pct + '% complete</div>';
        card.insertBefore(wrap, card.querySelector('.track-resources'));
      }
    } else {
      if (progressWrap) progressWrap.remove();
    }
  }

  function toggleResourcesVisibility(trackId, btn) {
    var list = btn.parentNode.querySelector('.resource-list');
    var hidden  = list.querySelectorAll('.resource-hidden');
    var showAll = btn.getAttribute('data-show-all') === 'true';
    hidden.forEach(function (el) { el.style.display = showAll ? 'none' : ''; });
    btn.textContent = showAll ? 'Show all' : 'Show less';
    btn.setAttribute('data-show-all', showAll ? 'false' : 'true');
  }

  /* ─── Render resources ─── */
  function renderResources(track, isOpen) {
    var res  = track.resources;
    var done = progress[track.id] || [];
    var filtering   = isFiltering();
    var initialShow = 3;

    /* Build filtered list preserving original indices for progress tracking */
    var visibleRes = [];
    for (var i = 0; i < res.length; i++) {
      if (!filtering || resourceMatchesFilters(res[i])) {
        visibleRes.push({ r: res[i], idx: i });
      }
    }
    if (filtering && visibleRes.length === 0) return '';

    var html = '<div class="track-resources" style="display:' + (isOpen || filtering ? '' : 'none') + '">';
    html += '<ul class="resource-list">';
    for (var j = 0; j < visibleRes.length; j++) {
      var entry  = visibleRes[j];
      var r      = entry.r;
      var origIdx = entry.idx;
      var isDone  = done.indexOf(origIdx) !== -1;
      var hidden  = !filtering && j >= initialShow;
      html += '<li' + (hidden ? ' class="resource-hidden" style="display:none"' : '') + '>';
      html += '<div class="resource-item' + (isDone ? ' completed' : '') + '" data-track="' + track.id + '" data-idx="' + origIdx + '">';
      html += '<span class="resource-check">' + (isDone ? '✓' : '') + '</span>';
      html += '<span class="resource-info">';
      html += '<span class="resource-title">' + r.title + '</span>';
      html += '<span class="resource-meta"><span class="type-badge ' + typeBadgeClass(r.type) + '">' + (r.type || '') + '</span> ' + (r.provider || '') + '</span>';
      html += '</span>';
      /* Route the action button: sidebar for internal .md, external tab for URLs, disabled for missing */
      if (!r.url) {
        html += '<span class="resource-link resource-link--none">No link</span>';
      } else if (!r.url.startsWith('http') && r.url.endsWith('.md')) {
        html += '<a class="resource-link resource-link--doc" href="' + r.url + '" data-sidebar-doc>Read</a>';
      } else {
        html += '<a class="resource-link" href="' + r.url + '" target="_blank" rel="noopener noreferrer">Open ↗</a>';
      }
      html += '</div></li>';
    }
    html += '</ul>';
    if (!filtering && visibleRes.length > initialShow) {
      html += '<button class="resource-toggle" data-show-all="false">Show all ' + visibleRes.length + '</button>';
    }
    html += '</div>';
    return html;
  }

  /* ─── Render track card ─── */
  function renderTrack(track) {
    var docs      = docLinks[track.id] || [];
    var resCount  = track.resources.length;
    var done      = completedInTrack(track.id);
    var pct       = trackPct(track.id);
    var filtering = isFiltering();

    var resHtml = renderResources(track, false);
    if (filtering && !resHtml) return '';

    var matchCount = 0;
    if (filtering) track.resources.forEach(function (r) { if (resourceMatchesFilters(r)) matchCount++; });

    var html = '<div class="track-card" data-track="' + track.id + '" data-level="' + track.level + '">';
    html += '<div class="track-card-header">';
    html += '<div class="track-info">';
    html += '<p class="track-title">' + track.title + '</p>';
    html += '<p class="track-summary">' + track.summary + '</p>';
    html += '</div>';
    html += '<div class="track-badges">';
    html += '<span class="level-pill ' + track.level.replace(/\s/g, '') + '">' + track.level + '</span>';
    if (filtering) {
      html += '<span class="resource-count-pill">' + matchCount + ' match' + (matchCount !== 1 ? 'es' : '') + '</span>';
    } else {
      html += '<span class="resource-count-pill">' + resCount + (done > 0 ? ' \xB7 ' + done + '/' + resCount : '') + '</span>';
    }
    html += '</div></div>';
    html += '<p class="track-outcome"><strong>Outcome:</strong> ' + track.outcome + '</p>';

    if (done > 0 && !filtering) {
      html += '<div class="track-progress-wrap">';
      html += '<div class="track-progress-bar"><div class="track-progress-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="track-progress-label">' + pct + '% complete</div>';
      html += '</div>';
    }

    if (docs.length > 0 && !filtering) {
      html += '<div class="track-docs">';
      docs.forEach(function (d, di) {
        html += '<a class="doc-link" href="' + d.u + '" data-sidebar-doc data-track="' + track.id + '" data-doc-idx="' + di + '">' + d.t + '</a>';
      });
      html += '</div>';
    }

    html += resHtml + '</div>';
    return html;
  }

  /* ─── Track interaction handlers ─── */
  function attachTrackHandlers(phaseIdx) {
    var cards = phaseContainer.querySelectorAll('.phase[data-phase="' + phaseIdx + '"] .track-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.resource-item') || e.target.closest('.doc-link') || e.target.closest('.resource-toggle')) return;
        if (isFiltering()) return;
        var resArea = card.querySelector('.track-resources');
        if (resArea) {
          resArea.style.display = resArea.style.display !== 'none' ? 'none' : '';
          saveLastTrack(card.dataset.track);
        }
      });

      card.querySelectorAll('.resource-item').forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (e.target.closest('.resource-link')) return;
          toggleResource(el.dataset.track, parseInt(el.dataset.idx, 10));
        });
      });

      var toggleBtn = card.querySelector('.resource-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleResourcesVisibility(card.dataset.track, toggleBtn);
        });
      }
    });
  }

  /* ─── Render all phases ─── */
  function renderAll() {
    var html      = '';
    var filtering = isFiltering();

    phases.forEach(function (phase, pi) {
      var isOpen = filtering ? true : openPhases.indexOf(phase.id) !== -1;

      var levelTracks = phase.trackIds
        .map(function (tid) { return trackMap[tid]; })
        .filter(function (t)  { return t && levelMatches(t.level, currentFilter); });

      if (levelTracks.length === 0) return;

      var phaseBody = '';
      var visibleCount = 0;
      levelTracks.forEach(function (t) {
        var th = renderTrack(t);
        if (th) { phaseBody += th; visibleCount++; }
      });

      if (filtering && visibleCount === 0) return;

      html += '<div class="phase' + (isOpen ? ' open' : '') + '" data-phase="' + pi + '">';
      html += '<button class="phase-header">';
      html += '<span class="phase-toggle">&#9658;</span>';
      html += '<span class="phase-marker"></span>';
      html += '<span class="phase-info">';
      html += '<p class="phase-title">Phase ' + (pi + 1) + ': ' + phase.label + '</p>';
      html += '<p class="phase-meta">' + phase.subtitle + '</p>';
      html += '</span>';
      html += '<span class="phase-badge">' + visibleCount + ' track' + (visibleCount !== 1 ? 's' : '') + (filtering ? ' with results' : '') + '</span>';
      html += '</button>';
      html += '<div class="phase-body"><div class="track-grid">' + phaseBody + '</div></div>';
      html += '</div>';
    });

    if (!html) {
      html = '<div class="search-no-results"><p>No resources matched your search. Try different keywords or clear the filters.</p></div>';
    }

    phaseContainer.innerHTML = html;

    /* Update roadmap heading */
    var heading = document.querySelector('#roadmap h2');
    if (heading) {
      heading.textContent = filtering
        ? 'Showing filtered results.'
        : 'Four phases to production-ready AI.';
    }

    /* Phase toggle (disabled when filtering) */
    phaseContainer.querySelectorAll('.phase-header').forEach(function (header) {
      header.addEventListener('click', function () {
        if (isFiltering()) return;
        var phase   = header.parentNode;
        var phaseId = phases[parseInt(phase.dataset.phase, 10)].id;
        if (phase.classList.toggle('open')) {
          if (openPhases.indexOf(phaseId) === -1) openPhases.push(phaseId);
        } else {
          var pos = openPhases.indexOf(phaseId);
          if (pos !== -1) openPhases.splice(pos, 1);
        }
        saveOpenPhases();
      });
    });

    phases.forEach(function (_, pi) { attachTrackHandlers(pi); });
    updateDashboard();
  }

  /* ─── Level filter pills ─── */
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      currentFilter = pill.dataset.level;
      renderAll();
    });
  });

  /* ─── Type filter pills ─── */
  document.querySelectorAll('.type-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.type-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      typeFilter = pill.dataset.type;
      renderAll();
    });
  });

  /* ─── Search ─── */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchText = searchInput.value.trim();
      renderAll();
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchText = '';
        renderAll();
        searchInput.blur();
      }
    });
  }

  /* ─── Clear progress ─── */
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (confirm('Reset all progress tracking?')) {
        progress  = {};
        lastTrack = null;
        saveProgress();
        localStorage.removeItem('roadmap-last-track');
        renderAll();
      }
    });
  }

  /* ─── Export progress ─── */
  if (exportBtn) exportBtn.addEventListener('click', exportProgress);

  /* ─── Doc Sidebar ─── */
  var docOverlay   = document.getElementById('docOverlay');
  var docSidebar   = document.getElementById('docSidebar');
  var docBody      = document.getElementById('docBody');
  var docTitle     = document.getElementById('docTitle');
  var docBreadcrumb= document.getElementById('docBreadcrumb');
  var docPrev      = document.getElementById('docPrev');
  var docNext      = document.getElementById('docNext');
  var docCounter   = document.getElementById('docCounter');
  var docClose     = document.getElementById('docSidebarClose');

  var viewerState = { trackId: null, docIdx: null, docs: [] };

  function openDoc(url, trackId, docIdx) {
    docBody.innerHTML = '<div class="doc-loading">Loading...</div>';
    docSidebar.classList.add('open');
    docOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    var docs = (trackId && docLinks[trackId]) ? docLinks[trackId] : [];
    viewerState.trackId = trackId;
    viewerState.docIdx  = (docIdx !== null && docIdx !== undefined) ? docIdx : null;
    viewerState.docs    = docs;

    docBreadcrumb.textContent = (trackId && trackMap[trackId]) ? trackMap[trackId].title : '';
    updateNavButtons();

    fetch(url)
      .then(function (res) { if (!res.ok) throw new Error('Failed'); return res.text(); })
      .then(function (text) {
        var html  = marked.parse(text);
        var match = text.match(/^#\s+(.+)/m);
        docTitle.textContent = match ? match[1] : 'Documentation';
        docBody.innerHTML = '<div class="doc-content">' + html + '</div>';
        docBody.scrollTop = 0;
      })
      .catch(function () {
        var fileProto = window.location.protocol === 'file:';
        docTitle.textContent = 'Document unavailable';
        docBody.innerHTML = '<div class="doc-error">' +
          (fileProto
            ? 'Opened via <code>file://</code> — the viewer cannot fetch local files. Open the document in a new tab instead.'
            : 'Could not load this document.') +
          '</div><a href="' + url + '" target="_blank" rel="noopener noreferrer" class="button primary" style="margin-top:16px;display:inline-flex">Open in new tab</a>';
      });
  }

  function closeDoc() {
    docSidebar.classList.remove('open');
    docOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateNavButtons() {
    var idx   = viewerState.docIdx;
    var docs  = viewerState.docs;
    docPrev.disabled = !(idx !== null && idx > 0);
    docNext.disabled = !(idx !== null && idx < docs.length - 1);
    docCounter.textContent = (idx !== null && docs.length > 0) ? (idx + 1) + ' / ' + docs.length : '';
  }

  function navigateDoc(dir) {
    var idx  = viewerState.docIdx;
    var docs = viewerState.docs;
    if (idx === null || docs.length === 0) return;
    var newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= docs.length) return;
    viewerState.docIdx = newIdx;
    updateNavButtons();
    openDoc(docs[newIdx].u, viewerState.trackId, newIdx);
  }

  document.body.addEventListener('click', function (e) {
    var link = e.target.closest('[data-sidebar-doc]');
    if (!link) return;
    e.preventDefault();
    var docIdx = link.getAttribute('data-doc-idx');
    openDoc(link.getAttribute('href'), link.getAttribute('data-track') || null, docIdx !== null ? parseInt(docIdx, 10) : null);
  });

  if (docOverlay) docOverlay.addEventListener('click', closeDoc);
  if (docClose)   docClose.addEventListener('click', closeDoc);
  if (docPrev)    docPrev.addEventListener('click', function () { navigateDoc(-1); });
  if (docNext)    docNext.addEventListener('click', function () { navigateDoc(1); });

  /* ─── Keyboard shortcuts ─── */
  document.addEventListener('keydown', function (e) {
    var inInput = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
    var sidebarOpen = docSidebar && docSidebar.classList.contains('open');

    if (e.key === 'Escape') {
      if (sidebarOpen) { closeDoc(); return; }
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchText = '';
        renderAll();
        searchInput.blur();
      }
    }
    if (sidebarOpen) {
      if (e.key === 'ArrowLeft' && !docPrev.disabled) navigateDoc(-1);
      if (e.key === 'ArrowRight' && !docNext.disabled) navigateDoc(1);
    }
    if (e.key === '/' && !inInput && !sidebarOpen) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  /* ─── Init ─── */
  renderAll();

})();
