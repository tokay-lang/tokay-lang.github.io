+++
title = "Getting started"
weight = 1
+++

# Overview

Tokay is a programming language designed for ad-hoc parsing. It is heavily influenced by [awk](https://en.wikipedia.org/wiki/AWK), but follows its own philosophy and design principles. It might also be useful as a general purpose scripting language, but mainly focuses on processing textual input and work on trees with information extracted from this input.

Tokay is written in [Rust](https://www.rust-lang.org/). Therefore, a Rust compiler and toolchain is required for building.

# Installation

Tokay is in a very early project state. Therefore you have to built it from source, using the Rust programming language and its build-tool `cargo`.

Clone [the repository](https://github.com/phorward/tokay) with `git clone https://github.com/phorward/tokay.git` into a place of your choice. Afterwards, just run `cargo run` to build and run Tokay.

# CLI usage

Tokay is a command-line program, and yet doesn't feature any GUI components or so.

Invoking the `tokay` command without any program argument starts the REPL (read-eval-print-loop). This allows to enter expressions or even full programs interactively with a direct result.

In case you compile and run Tokay from source on your own, just run `cargo run --` with any desired parameters attached as shown below.

```shell
# Start a repl
$ tokay

# Start a repl working on an input stream from file.txt
$ tokay -- file.txt
```

Next runs the Tokay program stored in the file *program.tok*:
```shell
# Run a program from a file
$ tokay program.tok
```

To directly work on files as input stream, do this as shown next. Further files can be specified and are executed on the same program sequentially. Its also possible to read from stdin using the special filename `-`.
```shell
# Run a program from a file with another file as input stream
$ tokay program.tok -- file.txt

# Run a program from with multiple files as input stream
$ tokay program.tok -- file1.txt file2.txt file3.txt

# Pipe input through tokay
$ cat file.txt | tokay program.tok -- -
```

A tokay program can also be specified directly as first parameter. This call just prints the content of the files specified:
```shell
# Directly provide program via command-line parameter
$ tokay 'print(Until<EOF>)' -- file1.txt file2.txt file3.txt
```
