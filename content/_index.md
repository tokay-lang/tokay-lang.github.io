+++
title = "Tokay Programming Language"
sort_by = "weight"
+++

# About

Tokay is an imperative, procedural programming language dedicated to parsing and other text-processing tasks.

It is heavily inspired by [awk](https://en.wikipedia.org/wiki/AWK), but follows its own philosophy and design principles. It might also be useful as a general purpose scripting language, but mainly focuses on processing textual input and work on trees with information extracted from this input.

The language was designed to quickly create solutions in text processing problems, which can be just simple pattern matching but also huge parsers. Tokay therefore provides both a language for simple one-liners but also facilites to create programs like code-analysis and refactoring tools, interpreters or compilers.

The language is still very young and has much potential. Volunteers are welcome!

# Features

Tokay's design goals are

- Stream-based input processing
- Automatic parse tree synthesis
- Left-recursive parsing structures ("parselets") supported
- Internally implements a memoizing packrat parsing algorithm
- Memory safe due its implementation in [Rust](https://rust-lang.org) without any unsafe calls
- Dynamic lists and dicts
- Enabling awk-style one-liners in combination with other scripts and programs
- *) Generic functions and parselets
- *) Interoperability with other shell commands

*) Planned in future.

# Audience

Tokay is not intended to be a general purpose programming language. Its intended audience are at least developers, dev-ops, data-analysts and administrators, who desire to build ad-hoc parsing solutions, mostly on the command-line, and save a lot of time. The language is heavily inspired by *awk*, so if you like and know *awk*, you might take a closer look into Tokay as well.
