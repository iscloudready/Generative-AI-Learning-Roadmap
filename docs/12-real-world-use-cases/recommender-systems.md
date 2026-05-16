# AI for Recommender Systems

## Why It Matters

Recommender systems drive engagement across e-commerce, social media, streaming, and advertising. Modern ML-powered recommenders — two-tower models, graph-based systems, multi-armed bandits — are essential infrastructure for any platform with personalized content.

## Prerequisites

- Understanding of embeddings and vector similarity (see [Embeddings](../04-llm-engineering/embeddings.md))
- Familiarity with supervised learning and feature engineering (see [Machine Learning Foundations](../02-machine-learning-foundations/machine-learning.md))
- Basic probability and statistics

## Core Concepts

### Recommendation System Architecture

Modern production recommenders follow a funnel architecture:

1. **Candidate generation** — retrieve hundreds of relevant items from millions (fast, lightweight models)
2. **Ranking** — score hundreds of candidates with a deep neural network (accurate, heavier model)
3. **Re-ranking** — apply business rules, diversity constraints, and personalization (heuristic + ML)
4. **Blending** — mix recommendations from multiple sources (e.g., sponsored + organic + editorial)

### Candidate Generation: Two-Tower Models

The two-tower model (also called dual-encoder or DSSM) is the most popular candidate generation architecture:

- **Query tower**: Encodes user context (history, demographics, session features) into an embedding
- **Item tower**: Encodes item features (title, category, popularity) into an embedding
- **Training**: Contrastive loss — maximize dot product for positive pairs, minimize for random negatives
- **Serving**: Item embeddings are pre-computed and indexed in ANN (Approximate Nearest Neighbor) libraries

ANN libraries: FAISS (Meta), Annoy (Spotify), HNSWlib, ScaNN (Google)

### Approximate Nearest Neighbor (ANN) Search

Since exhaustive search over millions of items is too slow at serving time, ANN methods trade a small accuracy loss for dramatic speedups:

- **HNSW** (Hierarchical Navigable Small World): Graph-based, best recall-speed tradeoff. Used by Pinecone, Weaviate.
- **IVF** (Inverted File Index): Clusters items, searches only nearest clusters. Good for high-dimensional data.
- **Product Quantization**: Compresses embeddings into short codes. Reduces memory 8-16x.
- **DiskANN**: Graph-based index that works from SSD, enabling billion-scale ANN on a single machine.

### Ranking: Deep Learning Models

The ranking stage uses rich user/item features with deep neural networks:

- **Wide & Deep**: Linear model (wide) captures memorization, DNN (deep) captures generalization
- **DCN (Deep & Cross Network)**: Explicit feature crossings via cross layers
- **DLRM** (Meta): Combines categorical features via dot-product interactions
- **Two-stage ranking**: First lightweight model prunes candidates, second heavy model scores final set

Key techniques: Feature crosses, embedding tables for categorical features, position bias correction, time-based feature engineering.

### Multi-Armed Bandits

Bandit algorithms balance exploration (trying new items) with exploitation (serving known-good items):

- **Epsilon-Greedy**: With probability ε, serve random item; otherwise serve best-known item
- **Upper Confidence Bound (UCB)**: Serve item with highest optimistic estimate (mean + uncertainty)
- **Thompson Sampling**: Sample from posterior distribution of each item's reward; serve highest sample
- **Contextual Bandits**: Use user/context features to personalize exploration (LinUCB, neural bandits)

Bandits are particularly useful for cold-start problems and A/B testing at scale.

### Bias, Fairness and Evaluation

Recommendation systems are prone to systematic biases:

- **Position bias**: Users more likely to click items shown higher on page. Mitigate with inverse propensity weighting (IPW) or position-based models.
- **Popularity bias**: Popular items get more exposure, creating a feedback loop. Mitigate with personalization and diversity constraints.
- **Selection bias**: User feedback is missing for items not shown. Mitigate with propensity scoring.
- **Filter bubble**: Users only see content confirming their preferences. Mitigate by periodically injecting diverse recommendations.

Offline metrics: Recall@K, NDCG@K, Hit Rate, MAP. Online metrics: CTR, engagement time, retention, revenue.

### Real-World Applications

- **Netflix**: Personalized movie/TV recommendations with calibrated recommendations (ensures genre diversity)
- **YouTube**: Two-tower candidate generation + deep ranking with watch-time prediction
- **Spotify**: Music recommendation with collaborative filtering + audio content analysis
- **Instagram**: Explore page recommendation with graph-based and interest-based models
- **Amazon**: Product recommendation with item-to-item collaborative filtering + LLM-powered search
- **LinkedIn**: Feed ranking with CTR prediction and budget pacing for ads
- **TikTok**: For You feed with implicit feedback signals (watch time, completion rate, re-watches)

### Fraud Detection in Recommendations

ML systems are also critical for detecting abuse in e-commerce and ad systems:

- **Returns fraud detection**: Models identify suspicious return patterns using purchase history, device fingerprinting, and network analysis
- **Counterfeit detection**: Image and text models flag counterfeit product listings
- **Click fraud detection**: Identify bot traffic and invalid clicks in ad systems
- **Review fraud**: Detect fake reviews using language models and behavioral signals

## Best Resources

- [Evolution of Recommender Systems](https://youtu.be/lgoyJn7MsH8) — YouTube overview of recsys architectures
- [Multi-Armed Bandit Strategies](https://youtu.be/2A5f3GrX0dA) — Bandit algorithms for exploration-exploitation
- [Training Embeddings for Recommendation Systems](https://youtu.be/DN4S96oHRhE) — Contrastive learning for recommender embeddings
- [Twitter's Recommendation Algorithm](https://youtu.be/IhGq9jgcxFM) — Inside Twitter's ML-based recommendation
- [Netflix's Calibrated Recommendations](https://youtu.be/DOWXNrBpO4w) — Ensuring genre diversity in recommendations
- [FAISS: Facebook AI Similarity Search](https://github.com/facebookresearch/faiss) — Industry-standard ANN library
- [DCN V2: Improved Deep & Cross Network](https://arxiv.org/abs/2008.13535) — Practical deep learning ranking model
- [ANN in Recsys (Product Quantizer)](https://youtu.be/50PNumB7s3U) — Efficient similarity search for embeddings
- [Overcoming Biases in Recsys](https://youtu.be/oGb_mIdO0tA) — Bias mitigation techniques
- [LinkedIn's Budget Pacing for Targeted Ads](https://youtu.be/R4EZ92VJvSI) — Real-time budget allocation in ad systems

## Practice Milestones

1. **Build a two-tower model**: Implement a simple two-tower recommender using MovieLens data. Train with contrastive loss. Evaluate recall@K.
2. **Deploy ANN search**: Use FAISS to index 1M random embeddings. Benchmark HNSW, IVF, and brute-force search for speed vs. recall.
3. **Implement epsilon-greedy**: Build a contextual bandit for a toy recommendation problem. Measure reward over time with ε=0.1 vs. ε=0.01.
4. **Bias analysis**: Log position and item features for a week of recommendations. Measure position bias and apply inverse propensity weighting.
5. **Fraud detection model**: Build an ML model (XGBoost or neural) to flag fraudulent returns using synthetic e-commerce data.
6. **Full pipeline simulation**: Build an end-to-end recommendation pipeline: candidate generation → ranking → re-ranking with diversity. Measure offline and online metrics.

## Related Topics

- [Track 04: LLM Engineering - Embeddings](../04-llm-engineering/embeddings.md) — Embedding models and similarity search
- [Track 05: RAG Systems](../05-rag-systems/rag-overview.md) — Vector databases for similarity search
- [Track 07: LLMOps and Infrastructure](../07-ai-infrastructure/llmops.md) — Serving infrastructure for real-time recommendations
- [Track 07: Observability](../07-ai-infrastructure/observability.md) — Monitoring recommenders in production
