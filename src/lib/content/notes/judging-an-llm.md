---
title: judging an llm is a search problem
date: 2026-03
tag: eval
excerpt: Why evaluation is fundamentally a retrieval problem, and what that means for how we should build eval frameworks.
---

While doing evals for our legal agent at Litt, I came to realize that you can't only rely on the final output to judge the quality of an agent. Just as a student can reach the correct solution to a maths problem using a wrong method, this can lead to an unstable system.

Some of the cases that demonstrated it well: in one instance, due to a guardrail and how it interacted with the subagents, one of the subagents would refuse to do certain tasks citing it — but this was not visible in the final output as the orchestrator always picked up the slack. This led to a system that was functioning properly but was very token-inefficient, as all of the research was leaking into the orchestrator's context and ballooned over a hundred-step task. Another I found was while testing a new search tool provided for searching over cases from different courts — due to a guideline not being there, the agent used that tool everywhere, even for simple drafting, increasing the token cost for no reason.

All this is difficult to ascertain from just the output, as a good system is designed with many contingencies which usually take care of many problems that would otherwise appear. But to make a perfect system it is imperative that such imperfections are also ironed out, as the space in which a user might use your product is very large — you never know when slight imperfections could cause catastrophic damage, especially in a field like legal tech where each piece of research can be the difference between an advantageous and a disadvantageous position.

So this raises a question: how can we effectively evaluate an agentic system? Just as an exam is graded by the steps a student takes to reach the solution — not just the solution itself — we can do something similar with agentic systems. We do have the roadmap the agent took to get to the answer: its trace. The problem is that a trace is usually very long and not that intuitive to look at. But combined with other metrics like tool usage, token cost, latency, and the actual output itself, it can provide a pretty complete picture of what the agent is doing and what its nature is — given you do enough iterations.

The trace gives you the path through the decision space. Finding the bad paths before your users do — that is the search problem.
