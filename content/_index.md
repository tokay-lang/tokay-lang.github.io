+++
title = "Tokay Programming Language"
sort_by = "weight"
+++

# About

Tokay is a programming language designed for ad-hoc parsing. It is inspired by [awk](https://en.wikipedia.org/wiki/AWK), but follows its own philosophy and design principles. It might also be useful as a general purpose scripting language, but mainly focuses on processing textual input and work on trees with information extracted from this input.

The language was designed to quickly create solutions in text processing problems, which can be just simple pattern matching but even bigger things. Therefore Tokay provides both a language for simple one-liners but also facilites to create programs like code-analysis and refactoring tools, including interpreters or compilers. For example, Tokay's own language parser is implemented in Tokay itself.

Tokay is a very young project and gains much potential. Volunteers are welcome!

# Features

Tokay's design goals are

- Concise and easy to learn syntax
- Stream-based input processing
- Automatic parse tree construction and synthesis
- Left-recursive parsing structures ("parselets") supported
- Implements a memoizing packrat parsing algorithm internally
- Robust due to its implementation in only safe [Rust](https://rust-lang.org)
- Enabling awk-style one-liners in combination with other tools
- *) Generic functions and parselets
- *) Import system to create modularized programs
- *) Embedded interoperability with other programs

*) Coming soon.

# Audience

Tokay is not intended to be a general purpose programming language, nor a replacement for awk. Its audience are developers, dev-ops, data-analysts, administrators and computer enthusiasts who are just looking for a time-saving, quick to use and easy to learn language and toolchain for ad-hoc parsing and data extraction, which can just be fired up on the command-line, in shell scripts or embedded into other processes. If you like awk, you should take a look into Tokay as well.
