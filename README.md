Universal TOON Converter Library 🚀
Token-Optimized Object Notation (TOON) Serialization for High-Performance RAG Systems

📖 Overview
The Universal TOON Converter Library is a specialized middleware engine designed for Retrieval-Augmented Generation (RAG) pipelines. It solves the "Serialization Bottleneck" in Large Language Models (LLMs) by transforming verbose, redundant JSON data into a compact, structure-aware format called TOON.

This library is the core software artifact of the research thesis: "Adaptive Retrieval-Augmented Generation for Real-Time Conversational AI" by Syed Naseeb Ali Tirmizi.

Key Features (Based on Thesis Research)
⚡ 60% Token Reduction: Compresses JSON payloads by removing syntactic overhead (braces, quotes, repeated keys).

🚀 3.5x Faster Latency: Significantly reduces Time-to-First-Token (TTFT) by feeding smaller payloads to the LLM.

🔗 Explicit Entity Linking: Automatically maps pronouns and nested attributes to explicit Entity IDs (e.g., #Patient[101]), reducing contextual hallucination by >66%.

🔄 Universal Schema Support: Can ingest arbitrary nested JSON from any database (SQL/NoSQL) and flatten it into a linear stream.
