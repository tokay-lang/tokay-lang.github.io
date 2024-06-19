+++
title = "Quick start"
+++

This is a quick start guide with information how to install and use Tokay.<br>
For further reading and all details, consult the [documentation](/tokay-docs/).

# Installation

Currently, Tokay is in a very early project state. Therefore you have to built it from source, using the [Rust](https://www.rust-lang.org/) programming language and its build-tool `cargo`.

Once you got Rust installed, compile and install [Tokay](https://crates.io/crates/tokay) by

```shell
$ cargo install tokay
```

Once done, you can run the Tokay REPL with

```shell
$ tokay
Tokay 0.6.6
>>> print("Hello Tokay")
Hello Tokay
>>>
```

You can exit the Tokay REPL with `Ctrl+C` or by calling the `exit` keyword.

> The next examples are showing the REPL-prompt `>>>` with a given input and output. The output may differ when other input is provided.

# Usage

Invoking the `tokay` command without any arguments starts the REPL (read-eval-print-loop). This allows to enter expressions or even full programs interactively with a direct result.

```shell
# Start a repl
$ tokay

# Start a repl working on an input stream from file.txt
$ tokay -- file.txt

# Start a repl working on the input string "gliding is flying with the clouds"
$ tokay -- "gliding is flying with the clouds"
Tokay 0.6.6
>>> Word(5)
("gliding", "flying", "clouds")
>>>
```

> In case you compile and run Tokay from source, use `cargo run --` with any desired parameters here, instead of the `tokay` command.

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
$ tokay program.tok -- file1.txt "gliding is fun" file2.txt

# Pipe input through tokay
$ cat file.txt | tokay program.tok -- -
```

A Tokay program can also be specified directly as first parameter. This call just prints the content of the files specified:
```shell
# Directly provide program via command-line parameter
$ tokay 'print(Char+)' -- file.txt
```

> `tokay --help` will give you an overview about further parameters and invocation.

# Syntax

Tokay source code is made of *items*, *sequences* and *blocks*.

## Items

Items are results of expressions, function calls or statements.

Below, every REPL input is one item:

```tokay
# Expression
>>> 2 + 3 * 5
17

# Assignment of an expression to a variable
>>> i = 2 + 3 * 5

# Using a variable within an expression
>>> i + 3
20

# Conditional if-statement
>>> if i == 17 "yes" else "no"
"yes"

# Function call
>>> print("hello" + i)
hello17

# Method call
>>> "hello".upper * 3
"HELLOHELLOHELLO"

# Token call ("hello" is read by Word(3) from the input stream)
>>> Word(3)
"hello"

# Token call in an expression (42 is read by Int from the input stream)
>>> Int * 3
126

# A list of items is also an item
>>> 1,2,3
(1, 2, 3)
```

## Sequences

Sequences are multiple items in a sequence. Sequences are either delimited by line-break, or a semicolon (`;`). They can be grouped to sub-sequences using parantheses `(` and `)`. A sequence either yields in an object of type `list`, or in a `dict`, depending on the elements used inside the

```tokay
# A sequence of items with the same weighting result in a list
>>> 1 2 3
(1, 2, 3)

# Sequence with a list
>>> 4, 5  6
((4, 5), 6)

# Item with a sub-sequence
>>> 7, (8 9)
(7, (8, 9))

# Two sequences in one row; only last result is printed in REPL.
>>> 10 20 30; 40 50 60
(40, 50, 60)

# This is a simple parsing sequence, accepting  assignments like
# "i=1" or "number = 123"
>>> Ident _ '=' _ Int
("number", 123)

# This is a version of the same sequence constructing a dict rather than a list
>>> name => Ident _ '=' _ value => Int
(name => "n" value => 42)
```

## Blocks

Finally, sequences are organized in blocks. The execution of a sequence is influenced by failing token matches or special keywords like `push`, `next`, `accept`, `reject` and more, which either enforce to execute the next sequence, or accept or reject a parselet, which can be referred to as a function. The main-parselet is also a parselet executing the main block, where the REPL runs in.

A block itself is also an item inside of a sequence of another block (or the main block). A new block is defined by `{` and `}`.

The next piece of code is already a demonstration of Tokays parsing features together with a parselet and two blocks, implementing an assignment grammar for either float or integer values, and some error reporting.

```tokay
# Parselet definition of Assignment (identified by the @{...}-block)
# Match an identifier, followed by either a float or an integer;
# Throws an error on mismatch.
>>> Assignment : @{
    Ident _ '=' _ {
        Float
        Int
        error("Expecting a number here")
    }
}

# Given input "i = 23.5"
>>> Assignment
("i", 23.5)

# Given input "i = 42"
>>> Assignment
("i", 42)

# Given input "i = j"
>>> Assignment
Line 1, column 5: Expecting a number here
```

# Parselets

By design, Tokay constructs syntax trees from consumed information automatically. It is a programming language to write parsers. Functions that consume input are called *parselets*. If a function consumes input can be obtained by its name: When it starts with a capital letter or an underscore, it may consume input.

The next program directly implements a parser and interpreter for simple mathematical expressions, like `1 + 2 + 3` or `7 * (8 + 2) / 5`. The result of each expression is printed afterwards. Processing direct and indirect left-recursions without ending in infinite loops is one of Tokay's core features.

```tokay
_ : Char< \t>+          # redefine whitespace to just tab and space

Factor : @{
    Int _               # built-in signed integer token
    '(' _ Expr ')' _
}

Term : @{
    Term '*' _ Factor   $1 * $4
    Term '/' _ Factor   $1 / $4
    Factor
}

Expr : @{
    Expr '+' _ Term     $1 + $4
    Expr '-' _ Term     $1 - $4
    Term
}

Expr _ print("= " + $1)
```

An example run of this program as provided is this:

```shell
$ tokay calc.tok
7 * (8 + 2) / 5
= 14
```

A parse tree like visualized in the following graphic is, what's internally constructed during parsing and interpretation of `7 * (8 + 2) / 5`. As you can see, the structure of the expression and the precendeces of operators and parantheses becomes clear and well-defined.

<img src="/expr-ast.png" title="Parse tree of the example input `7 * (8 + 2) / 5`" style="max-width: 500px; padding: 15px; margin: 0 auto;">

> For more parsing examples, take a look into the [`examples/`-folder](https://github.com/tokay-lang/tokay/tree/main/examples).

# Control structrues

Tokay provides just 3 control structures:

- `if...else` for conditional branching,
- `for...in` for running over iterators,
- `loop` for structured loops.

Inside of loops, the keyswords `break` and `continue` can be used.

Control structures are part of expressions, and vice versa. Therefore, an `if`-statement, for example, can either serve as an inline-if or an if-construct.

```tokay
>>> x = 42
>>> print(if x == 42 "sense of life" else "nothing")
sense of life
>>> if x == 42 print("sense of life") else print("nothing")
sense of life
>>> for i in range(3) print(i)
0
1
2
>>> i = 0
>>> loop i < 3 { print(i++) }
0
1
2
>>> i = 0  loop i < 5 { print(i++) if i == 2 break "stopped" }
0
1
"stopped"
```

Well, you just learned how to write your first programs with Tokay. Are you still interested in learning more? Then feel free to continue reading by browsing the [official documentation](/tokay-docs/).
