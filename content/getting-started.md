+++
title = "Getting started"
weight = 2
+++

This is a first steps guide with information how to install and use Tokay. For further reading and all details, consult the [documentation](/tokay-docs/).

# Installation

Currently, Tokay is in a very early project state. Therefore you have to built it from source, using the [Rust](https://www.rust-lang.org/) programming language and its build-tool `cargo`.

Once you got Rust installed, install [Tokay](https://crates.io/crates/tokay) by

```shell
$ cargo install tokay
```

Once done, you should run the Tokay REPL with
```shell
$ tokay
Tokay 0.4.0
>>> print("Hello Tokay")
Hello Tokay
>>>
```

You can exit the Tokay REPL with `Ctrl+C`.

# CLI usage

Invoking the `tokay` command without any arguments starts the REPL (read-eval-print-loop). This allows to enter expressions or even full programs interactively with a direct result.

```shell
# Start a repl
$ tokay

# Start a repl working on an input stream from file.txt
$ tokay -- file.txt

# Start a repl working on the input string "gliding is fun!"
$ tokay -- "gliding is fun!"
Tokay 0.4.0
>>> Word
("gliding", "is", "fun")
>>>
```

In case you compile and run Tokay from source on your own, just run `cargo run --` with any desired parameters attached.

Next runs the Tokay program from the file *program.tok*:
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

# Run a program from with files or strings as input stream
$ tokay program.tok -- file1.txt "save the whales" file2.txt

# Pipe input through tokay
$ cat file.txt | tokay program.tok -- -
```

A Tokay program can also be specified directly as first parameter. This call just prints the content of the files specified:
```shell
# Directly provide program via command-line parameter
$ tokay '.+' -- file1.txt file2.txt file3.txt
```

# Hello $world

As a first, well-known example, this is how the "Hello World"-program looks in Tokay:
```tokay
print("Hello World")
```
Indeed, this is very familiar compared to other languages. But what about this version?
```tokay
"Hello World" print($1)
```
This will also print "Hello World", but here, the string "Hello World" is first pushed as part of a sequence, and then referenced by the print-function call. Values in a sequence, so called *captures*, are temporary variables that can be accessed and modified inside of a sequence. You'll learn more about them later.

The above two programs can directly be run with an immediatelly presented result.
With the next example, this is not the case. Note the single-quotes, rather than the double quotes used before.
```tokay
'Hello World' print($1)
```
This version of the "Hello World" program doesn't output anything when run without further input. The reason for this is, that it requires for a token `'Hello World'` that must be matched in the input first, in exact character order. Input like "HelloWorld", "hello World" or "Hello Worl" won't be matched, but when "Hello World" is matched, it immediatelly prints "Hello World" every time a "Hello World" appears.

When above program is modified as below, and fed with a text-file as input (probably containing some "Hello World"s), it becomes much more obvious how Tokay programs are being executed.

```tokay
'Hello World' print($1)
. print
```
Given the input `I say: Hello World!`, this program outputs
```
I

s
a
y
:

Hello World
!
```
Two sequences in separate lines are being executed as two alternatives in order. If the input stream matches "Hello World", "Hello World" will be printed. Otherwise, any character (the `.`-token) is consumed and just printed.

If the last sequence reading any input is not provided, it is virtually inserted by Tokay inside the main scope and just skipped, so the program behaves equally without the `. print` sequence at the bottom.

Let's count the appearance of "Hello World" in an input stream:
```tokay
begin count = 0
'Hello World' count += 1
end print(count + " in total")
```
Quite obvious: Every time "Hello World" appears on the input stream, a variable count is increased by 1. In the beginning, the variable is intialized to 0 inside the special `begin`-sequence. The `end`-sequence is finally executed when the input stream was entirely read, and outputs the result.

Let's improve this program to inform the user when "Hello World" is matched for a 100 times. This can easily be done using an if-expression, and the pre-increment operator like so:
```tokay
begin count = 0
'Hello World' if ++count == 100 {
    print("Wow, '" + $1 + "' appeared for about a hundred times")
}
end print(count + " in total")
```

Well, you just learned how to write your first programs with Tokay.

Are you still interested in learning more? Then feel free to continue reading by browsing the [official documentation](/tokay-docs/).
