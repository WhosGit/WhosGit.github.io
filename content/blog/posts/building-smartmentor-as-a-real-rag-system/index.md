---
title: Building SmartMentor as a real RAG system
date: 2026-07-24
summary: Notes on turning semantic matching from a demo into a useful student–mentor discovery workflow.
lede: A good retrieval system is not just an embedding model and a vector database. It is a product decision about what users mean, what evidence the system can use, and how uncertainty should appear in the interface.
category: Engineering
tags:
  - RAG
  - LLM systems
  - Product
visualLabel: query → evidence → match
readTime: 6 min
draft: false
---

## The problem behind the feature

Students often describe interests in loose language while mentor profiles use specialized vocabulary. Keyword search misses useful connections, but a purely generative answer can invent them.

SmartMentor treats matching as an evidence problem: retrieve relevant profile fragments, rank a constrained set of mentors, and keep the source text visible.

## A two-stage path

The first version uses a direct long-context comparison to establish a product baseline. The next version creates embeddings for cleaned mentor descriptions and retrieves a smaller candidate set before asking a language model to explain the match.

- Normalize profiles without deleting domain-specific language.
- Retrieve candidates with stable identifiers and metadata.
- Constrain generation to the retrieved candidate set.
- Evaluate both ranking quality and explanation faithfulness.

## What I am watching next

The interesting work is evaluation. I want to compare system rankings with choices made by real students and understand when a concise explanation changes trust—for better or worse.
