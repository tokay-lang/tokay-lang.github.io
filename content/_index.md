+++
title = "Tokay Programming Language"
sort_by = "weight"
+++

# About

Tokay is a programming language designed for ad-hoc parsing.

Tokay is a language made to quickly create solutions in text processing problems. This can either be just simple extractions from any data, but also parsing the entire data, and turning it into a structured parse tree or abstract syntax tree for further tasks.

Therefore, Tokay provides both a language for simple one-liners, but also features to create tools for code-analysis, refactoring, interpreters, compilers, transpilers or even entire domain specific languages. Even Tokay's own language parser is implemented with Tokay itself.

Tokay is inspired by [awk](https://en.wikipedia.org/wiki/AWK), but follows its own philosophy and design principles. It might also serve as a general purpose scripting language, but it mainly focuses on processing textual input and work on trees with information extracted from this input.

# Features

Tokay's design goals are

- Concise and easy to learn syntax
- Stream-based input processing
- Automatic parse tree construction and synthesis
- Left-recursive parsing structures ("parselets") supported
- Implements a memoizing packrat parsing algorithm internally
- Robust due to its implementation in only safe [Rust](https://rust-lang.org)
- Enabling awk-style one-liners in combination with other tools
- Generic functions and parselets (*coming soon)
- Import system to create modularized programs (*coming soon)
- Embedded interoperability with other programs (*coming soon)

# Audience

Tokay is not intended to be a general purpose programming language, nor a replacement for awk.

Its intended audience are developers, dev-ops, data-analysts, administrators and any computer enthusiasts who are looking for a time-saving, quick-to-use and easy to learn language and toolchain for ad-hoc parsing and data extraction, which can just be fired up on the command-line, in shell scripts or embedded into other processes.

If you like awk and sed, you should take a look into Tokay as well.
