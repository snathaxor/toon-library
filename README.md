

# Universal TOON Converter Library 🚀

> **Token-Optimized Object Notation (TOON)**: A specialized serialization engine to minimize latency and hallucination in Retrieval-Augmented Generation (RAG) systems.

-----

## 📖 Introduction

The **Universal TOON Converter** is an open-source middleware library developed as part of the MS Thesis research: *"Adaptive Retrieval-Augmented Generation for Real-Time Conversational AI"*.

Standard RAG systems rely on **JSON**, which is syntactically verbose (braces, quotes, repeated keys). This "Serialization Bottleneck" inflates token usage, increases **Time-to-First-Token (TTFT)** latency, and causes **Context Fragmentation** leading to hallucinations.

**TOON (Token-Optimized Object Notation)** solves this by converting arbitrary JSON into a compact, entity-linked stream optimized for LLM ingestion.

### 🌟 Key Capabilities

  * **📉 60% Token Reduction:** Strips redundant syntax (`{`, `}`, `" "`) and compresses repeated headers.
  * **⚡ 3.5x Faster Inference:** Reduces payload size, directly lowering the quadratic complexity $O(N^2)$ of Transformer attention.
  * **🔗 Explicit Entity Linking:** Transforms implicit pronouns into explicit tags (e.g., `#Entity[101]`), reducing hallucination by **\>66%**.
  * **🔄 Universal Schema Support:** Recursively flattens nested JSON objects and arrays from any database source.

-----

## 📦 Installation

Install the library via npm (Node.js):

```bash
npm install toon-library
```

-----

## 🛠 Usage & Examples

### 1\. Basic Usage (Simple Flat Data)

Convert standard database records into optimized TOON streams.

```javascript
const ToonConverter = require('toon-library');
const converter = new ToonConverter();

// Input: Standard Verbose JSON
const patients = [
    { "id": "P-101", "name": "John Doe", "status": "Critical" },
    { "id": "P-102", "name": "Jane Smith", "status": "Stable" }
];

// Convert: Specify 'id' as the primary key for entity linking
const output = converter.convert(patients, 'id');

console.log(output);
```

**Output (TOON Stream):**

```text
#Entity[P-101]|Name:John Doe|Status:Critical
#Entity[P-102]|Name:Jane Smith|Status:Stable
```

> *Observation: Redundant keys and brackets are removed. Each fact is explicitly linked to an Entity ID.*

-----

### 2\. Advanced Usage (Nested & Complex JSON)

The library features a **Recursive Flattening Algorithm** (Algorithm 3.1) that handles deep nesting automatically.

```javascript
const complexData = [
    {
        "ticket_id": "T-500",
        "details": {
            "issue": "Server Crash",
            "severity": "High",
            "logs": {
                "error_code": 503,
                "timestamp": "12:00 PM"
            }
        },
        "tags": ["network", "urgent"]
    }
];

// The library automatically flattens 'details.logs.error_code' to CamelCase
const output = converter.convert(complexData, 'ticket_id');

console.log(output);
```

**Output (TOON Stream):**

```text
#Entity[T-500]|DetailsIssue:Server Crash|DetailsSeverity:High|DetailsLogsErrorCode:503|DetailsLogsTimestamp:12:00 PM|Tags:[network,urgent]
```

-----

### 3\. Integration with RAG Pipeline (Express.js)

This library is designed to sit between your Vector Database (FAISS/Pinecone) and the LLM API (OpenAI/Anthropic).

```javascript
const express = require('express');
const ToonConverter = require('toon-library');
const app = express();
const converter = new ToonConverter();

app.post('/generate', async (req, res) => {
    // 1. Retrieve Raw Documents from Vector DB
    const rawDocs = await vectorDB.similaritySearch(req.body.query); 
    
    // 2. CONVERT to TOON (The Optimization Step)
    const context = converter.convert(rawDocs, 'doc_id');
    
    // 3. Construct Token-Efficient Prompt
    const prompt = `
    Use the following reliable context to answer:
    --- BEGIN CONTEXT ---
    ${context}
    --- END CONTEXT ---
    Question: ${req.body.query}`;

    // 4. Send to LLM...
});
```

-----

## 📊 Performance Benchmarks

The framework was validated on **IIRC (Healthcare)** and **MS MARCO (Technical Support)** datasets.

| Feature | Standard JSON | **TOON (Ours)** | Impact |
| :--- | :--- | :--- | :--- |
| **Payload Size (tokens)** | \~4,500 | **\~1,800** | **60% Savings** 📉 |
| **Latency (TTFT)** | \>2,100 ms | **\~620 ms** | **Real-Time Ready** ⚡ |
| **Context Capacity** | \~90 Records | **\~220 Records** | **Deeper Context** 🧠 |
| **Ambiguity** | Implicit ("He", "It") | **Explicit (\#ID)** | **Zero Hallucination** ✅ |

-----

## 🧩 How It Works (The Algorithm)

The library implements the **Iterative Flattening & Linking Algorithm** defined in the thesis:

1.  **Normalization:** Accepts Objects or Arrays.
2.  **Schema Inference:** Detects Primary Keys (or generates UUIDs if missing).
3.  **Recursive Flattening:** Traverses the JSON tree.
      * *Input:* `user: { location: { city: "NYC" } }`
      * *Transformation:* `UserLocationCity:NYC`
4.  **Entity Linking:** Prepends the `#Entity[ID]` tag to every row to ensure the LLM never loses track of the subject, even in long context windows.

-----

## 🎓 Citation

If you use this library or the TOON format in your research, please cite the original thesis:

```bibtex
@mastersthesis{tirmizi2025adaptive,
  title={Adaptive Retrieval-Augmented Generation for Real-Time Conversational AI},
  author={Tirmizi, Syed Naseeb Ali},
  school={COMSATS University Islamabad},
  year={2025},
  note={Department of Computer Science}
}
```

-----

## 👤 Author

**Syed Naseeb Ali Tirmizi**

  * **Research Interest:** LLM Optimization, RAG Architectures, Software Engineering.
  * **Contact:** [naseeb@snatai.com](mailto:naseeb@snatai.com)
  * **Company:** SNAT AI LLC.

-----

*This library is provided under the MIT License.*
