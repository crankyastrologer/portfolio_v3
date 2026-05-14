---
title: why i write cuda kernels by hand
date: 2026-04
tag: systems
excerpt: On the value of understanding hardware at the instruction level — and why the compiler can't always do it for you.
---

Today with languages like triton, APIs like cuBLAS, and frameworks like pytorch and tensorflow, it is a good question why someone mainly focusing towards agentic AI and transformers would delve into CUDA — a complex C library and all the things that come with that like manual memory allocation and deallocation, overflow errors, and complicated syntax.

One of the main reasons for this was my own curiosity and love for parallel computing and low level programming. The first language I learnt was C++ which I started around 10th grade wanting to understand computers on a deeper level, but since then I have been only able to use that skill in competitive programming as python is just plain easier to work with. But with python I felt a little disconnected from the program and with the push of LLM written code this insecurity deepened.

Another thing was I was fascinated by LLMs but the problem was I felt I didn't understand them well. I tried many things to fix that like doing some projects where I built LLMs using frameworks and even using numpy. But still something was missing. Hence, when I finally bought a new laptop with an nvidia GPU I thought it would be a perfect chance to satisfy my curiosity. I started looking for courses on CUDA but opensource material was relatively thin, luckily I found this one — a collab between nvidia and Oak Ridge, a little old but the basics were explained pretty well.

After that I went deeper into a rabbit hole trying to build my own implementation of GPT-2 using CUDA and it turned out to be a lot tougher than I expected — somewhat complex maths with all the optimizations required by the GPU turns into really complex code and it took me a lot of time to finish even the forward pass. Along with this I tried to maintain a readme to make sure I was actually understanding what I was applying.

Basically on a GPU you aim to keep the state manager busy and coalesce as many memory calls as possible as they usually take magnitudes more time compared to mathematical operations. So to accomplish this you basically have to break your problems into as many small parts as possible but also make sure all the things required by those problems can be accessed from one continuous block of memory.

But in the end I am really grateful to have gone into this rabbit hole. I learned a lot of things about how a GPU works (and it is a lot different than I expected). It is funny that the considerations for code running on the GPU are very different from ones running on the CPU. It really made me feel like my old days when I first tried to learn programming languages. I also came to appreciate the effort that is needed to create all these abstractions that help all these great researchers easily implement their algorithms without actually making a career out of it.
