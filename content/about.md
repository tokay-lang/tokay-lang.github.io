+++
title = "About"
+++

Tokay is a programming language to quickly implement solutions for text processing problems. This can either be just simple data extractions, but also parsing entire structures or parts of it, and turning information into structured parse trees or abstract syntax trees for further processing.

Therefore, Tokay is both a tool and language for simple one-liners, but can also be used to implement code-analyzers, refactoring tools, interpreters, compilers or transpilers. Actually [Tokay's own language parser](https://github.com/tokay-lang/tokay/blob/main/src/compiler/tokay.tok) is implemented in Tokay itself.

Tokay is inspired by [awk](https://en.wikipedia.org/wiki/AWK), has syntactic and semantic flavours of [Python](https://www.python.org/) and [Rust](https://www.rust-lang.org/), but also follows its own philosophy, ideas and design principles. Thus, it isn't compareable to other languages or projects, and is a language on its own.

# Features

Tokay's design highlights are

- Interpreted, procedural and imperative scripting language
- Concise and easy to learn syntax and object system
- Stream-based input processing
- Automatic parse tree construction and synthesis
- Left-recursive parsing structures ("parselets") supported
- Implements a memoizing packrat parsing algorithm internally
- Robust and fast, as it is written entirely in safe [Rust](https://rust-lang.org)
- Enabling awk-style one-liners in combination with other tools
- Generic functions and parselets (*coming soon)
- Import system to create modularized programs (*coming soon)
- Embedded interoperability with other programs (*coming soon)

# Audience

Tokay is not intended to be a general purpose programming language, nor a replacement for awk.

Its intended audience are developers, dev-ops, data-analysts, administrators and any computer enthusiasts who are looking for a time-saving, quick-to-use and easy to learn language and toolchain for ad-hoc parsing and data extraction, which can just be fired up on the command-line, in shell scripts or embedded into other processes.

If you like awk and sed, you should take a look into Tokay as well.
