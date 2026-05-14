---
title: how we built the eval system at litt
date: 2026-05
tag: eval
excerpt: The legal AI eval space is immature. Building a seamless, trace-aware evaluation harness meant rethinking what a trace even is — and where it lives.
---

The eval space for legal AI is not very mature, at least on the open-source side. Harvey says they spend 30% of their token budget on evaluation itself. They have open-sourced some of their evals, but those cover comparatively simple tasks and are not aligned to the Indian legal system at all. That gap created a need for us to build our own evals and benchmarks — something we could use to calibrate agent behaviour and compare it against other offerings in the market.

But the central goal was to make these evals seamless enough to run on every change: every feature addition, tool swap, prompt update, database migration, and architectural shift. It had to be plug-and-play while still accounting for all the real complexity of evaluating an agent.

---

## what's easy, and what isn't

The first step was identifying everything that directly affects the user — latency, token usage, and output quality. These are not hard to track; Langsmith and Arize Phoenix handle most of it out of the box.

The harder part, as I wrote about [here](/notes/judging-an-llm), is the class of problems that never surface in the final output. An orchestrator that silently compensates for a failing subagent. A search tool being called where it has no business being called. A task that produces the right answer through the wrong method — expensive, brittle, and invisible until it isn't.

For those, you need the trace: the full path the agent took to get to the answer.

---

## the trace problem

The problem with traces is that they are very hard to read and interpret — even for the AI engineers who stare at them all day, a 100–200 step trace is a headache. For the domain experts who could actually spot a methodological error, they are essentially unreadable.

So we needed an intermediary: something that could understand the intent of the expert and score the trace against it. The obvious answer was LLMs themselves — critic models have been used this way since before GRPO, when PPO still needed a separate value head.

But how do you feed a trace that can be millions of tokens long into an LLM? All the subagent outputs, all the intermediate tool calls — it adds up fast. You need to store it somewhere the evaluator can query selectively. SQL, NoSQL, and vector stores all have the same problem: they are not structured around how an agent actually moves through a problem. A trace is not a table and it is not a semantic similarity search.

---

## the insight: traces as a filesystem

LLMs are already fluent with command-line interfaces and file trees. They can traverse directories, inspect specific files, read selectively. A trace maps naturally onto this: the orchestrator is the root, each subagent is a folder, each tool call is a file. The evaluator agent can navigate the trace the same way an engineer would browse a repository.

So we built a new agentic harness that treats a trace as a filesystem and gives the evaluator additional tools to understand its structure and relationships.

---

## the harness

The eval agents were divided by responsibility: grounding check, source check, synthesis check, handoff check, and so on. Each agent evaluates the trace against a set of parameters defined by a domain expert — the equivalent of a rubric. The evaluator knows the original question, the rubric, and has full access to the trace filesystem.

The cost is not small. The evaluation pass runs at roughly 3–4× the token cost of the original task. Two things make this acceptable: first, you can use a less capable model for most eval agents since the parameters are explicit and the task is structured comparison rather than open-ended reasoning. Second, you only pay this cost during development and regression testing, not in production.

---

## the toolchain

The last piece was making the whole system easy to use without a manual setup phase.

An auto-ingestion pipeline was built that pulls traces directly from Arize Phoenix, converts them into the filesystem representation, and stores them ready for evaluation. A CLI tool handles the eval runs — point it at a question set and a trace path and it does the rest. The results flow into a dashboard where they can be shared with domain experts and the broader team.

The goal from the start was that adding an eval for a new feature should take minutes, not days. Running a full regression before a model swap should be a single command. That part, at least, we got right.
