+++
title = "Documentation"
weight = 2
+++

# Preface

Tokay programs are expressed and executed differently as in common programmming languages like Rust or Python. Therefore, Tokay is not "yet another programming language". It was designed with the goal to let its programs directly operate on input streams that are either read from files, strings, piped commands or any other device emitting characters.

The most obvious example to show how Tokay executes its programs is this little matcher to greet the inner planets of the solar system.

```tokay
'Hello' _ {
    'Mercury'
    'Venus'
    'Earth'
}
```

In comparison to other programming languages, there's no explicit branching, substring extraction or reading from input required, as this is directly built into the language and its entire structuring.

If you're familiar with the [awk](https://en.wikipedia.org/wiki/AWK) language, you might find a similarity in above example to awk's `PATTERN { action }` syntax. This is exactly where the intention behind Tokay starts, but not by thinking of a line-based execution working on fields, but a token-based approach working on anything matched from the input, including recursive structures that can be expressed by a grammar.

# Syntax

Let's start with some explanations about Tokays syntax and fundamental building blocks first.

## Comments

Tokay currently only supports line-comments, starting with a hash (`#`). The rest of the line will be ignored.

```tokay
# This is a comment
hash = "# this is a string"  # this is also a comment.
```

## Reserved words

In Tokay, the following keywords are reserved words for control structures and special behaviors.

```tokay
accept begin else end expect false for if in loop next not null peek push reject repeat return true void
```
This list is currently incomplete, as Tokay is under heavy development. For example, there might be one `loop`-keyword but also variants of `for` and `while`, which currently is under consideration.

## Identifiers

Naming rules for identifiers in Tokay differ to other programming languages, and this is an essential feature.

1. As known from other languages, identifiers may not start with any digit (`0-9`).
2. Variables need to start with a lower-case letter from (`a-z`)
3. Constants need to start either
   - with an upper-case letter (`A-Z`) or an underscore (`_`) when they refer consumable values,
   - otherwise they can also start with a lower-case letter from (`a-z`).

Some examples for better understanding:
```tokay
# Valid
pi : 3.1415
mul2 : @x { x * 2 }
Planet : @{ 'Venus' ; 'Earth'; 'Mars' }
the_Tribe = "Apache"

# Invalid
Pi : 3.1415  # float value is not consumable
planet : @{ 'Venus' ; 'Earth'; 'Mars' }  # identifier must specify consumable
The_Tribe = "Cherokee"  # Upper-case variable name not allowed

9th = 9  # interpreted as '9 th = 9'
```

More about *consumable* and *non-consumable* values, *variables* and *constants* will be discussed later.

## Sequences

Sequences are a fundamental and powerful feature of Tokay, as you will see later. We will only discuss their syntax and simple examples here for now.

Every single value, call, expression, control-flow statement or even block is considered as an item. We will discuss blocks shortly.
Those items can be chained to a sequence directly in every line of a Tokay program.
```tokay
1 2 3 + 4    # results in a list (1, 2, 7)
```
For better readability, items of a sequence can also be optionally separated by commas (`,`), so
```tokay
1, 2, 3 + 4  # (1, 2, 7)
```
encodes the same.

All items of a sequence with a given severity are used to determine the result of the sequence. Therefore, these sequences return `(1, 2, 7)` in the above examples when entered in a Tokay REPL. Severities and automatic value construction of sequences will be discussed later on.

The items of a sequence are captured, so they can be accessed inside of the sequence using *capture variables*. In the next example, the first capture, which holds the result `7` from the expression `3 + 4` is referenced with `$1` and used in the second item as value of the expression. Referencing a capture which is out of bounds will just return a `void` value.
```tokay
3 + 4, $1 * 2  # (7, 14)
```
Captures can also be re-assigned by following captures. This one assigns a value at the second item to the first item, and uses the first item inside of the calculation. The second item which is the assignment, exists also as item of the sequence and refers to `void`, as all assignments do. This is the reason why Tokay has two values to simply define nothing, which are `void` and `null`.
```tokay
3 + 4, $1 = $1 * 2  # 14
```
As the result of the above sequence, just one value results which is `14`, but the second item's value, `void`, has a lower severity than the calculated and assigned first value. This is the magic with sequences that you will soon figure out in detail, especially when tokens from streams are accessed and processed, or your programs work on extracted information from the input, and the automatic abstract syntax tree construction occurs.

As the last example, we shortly show how sequence items can also be named and accessed by a more meaningful name than just the index.
```tokay
hello => "Hello", $hello = 3 * $hello  # (hello => "HelloHelloHello")
```
Here, the first item, which is referenced by the capture variable `$hello` is repeated 3 times as the second item.
It might be quite annoying, but the result of this sequence is a dict as shown in the comment. A dict is a hash-table where values can be referenced by a key.

## Newlines

In Tokay, newlines (line-breaks, `\n` respectively) are meaningful. They separate sequences from each other, as you will learn in the next section.

```tokay
"1st" "sequence"
"2nd" "sequence"
"3rd" "sequence"
```

Instead of a newline, a semicolon (`;`) can also be used, which has the same meaning. A single-line sequence can be split into multiple lines by preceding a backslash (`\`) in front of the line-break.

```tokay
"1st" \
    "sequence"
"2nd" "sequence" ; "3rd" "sequence"
```
The first and second example are literally the same.

## Blocks

Sequences are organized in blocks. Blocks may contain several sequences, which are executed in order of their definition. Every sequence inside of a block is separated by a newline.

- **Blocks** are defined by curly braces `{...}` and introduce a new alternation of sequences. Sequences in a block are executed in order until an item of a sequence or the sequence itself *accepts* or *rejects* the block.
- **Sequences** are lines in a block, delimited by either the end of the line, a semicolon `;` or the blocks closing brace `}`. They are made of items.
*rejects* the entire block.
- **Items** are
  - expressions like `1 + 2` or `++i * 3`
  - assignments like `x = 42` or `s += "duh"`
  - calls to `'tokens'`, `functions()` or `Parselets`
  - control flow instructions like `if x == 42 "yes" else "no"`
  - and even further `{ blocks }`

```tokay
{  # a block...
    # ... has sequences
    item¹ item² item³ ... # made of items.

    item¹ {  # an item of a sequence can be a block again
        item¹ item² ... # which contains further sequences with items
    }

    {}  # this empty block is the only item of the third sequence of the outer block
}
```

Blocks implicitly return the value of the last sequence being executed. Thus,

```tokay
a = {
    1 + 2
    4
}
```
assigns `4` to `a`, but calculates `3` in between.

## Functions

A function is introduced by an at-character (`@`), where a parameter list might optionally follow. The function's body is obgligatory, but can also exist of just a sequence or an item. Functions are normally assigned to constants, but can also be assigned to variables, with some loose of flexibility, but opening other features.

```tokay
f : @x = 1 {  # f is a function
    print("I am a function, x is " + x)
}
f  # calls f, because it has no required parameters!
f()  # same as just f
f(5)  # calls f with x=5
f(x=10)  # calls f with x=10
```

Tokay functions that consume input are called *parselets*. It depends on the function's body if its either considered to be a function or a parselet. Generally, when talking about parselets in Tokay, both function and real parselets are meant as shorthand.

```tokay
P : @x = 1 {  # P is a parselet as it uses a consuming token
    Word print("I am a parselet, x is " + x)
}

P  # calls P, because it has no required parameters!
P()  # same as just P
P(5)  # calls P with x=5
P(x=10)  # calls P with x=10
```

# Values

Let's discuss the meaning of values in Tokay next. Values are used everywhere, even when its not directly obvious. Generally speaking, everything in Tokay is some kind of value or part of a value.

*Atomic* values are one of the following.

```tokay
void                        # values to representing just nothing
null                        # values representing a defined "set to null"
true false                  # boolean values
42 -23                      # signed 64-bit integers
3.1415 -1.337               # signed 64-bit floats
"Glasflügel Libelle 201b"   # unicode strings
```

Values can also be one of the following *objects*.

```tokay
# list of values
(42, true, "yes")
(42 true "yes")

# dictionary (dict), a map of key-value-pairs
(i => 42, b => true, status => "success")
(i => 42 b => true status => "success")

# tokens are callables consuming input from the stream
'touch'    # silently touch a string in the input
''match''  # verbosely match a string from the input
[A-Z0-9]+  # matching a sequence of valid characters
Integer    # built-in token for parsing and returning Integer values

# functions and parselets are callable, enclosed blocks of code
f : @x{ x * 2 }
f(9)  # 18

@x{ x * 3 }(5)  # 18, returned by anonymous function that is called in-place
```

Objects are discussed in detail in a later chapter below.

## Variables and constants

Symbolic identifiers for named values can either be defined as *variables* or *constants*.
```tokay
variable = 0  # assign 0 to a variable
constant : 0  # assign 0 to a constant
```
Obviously, this looks like the same. `variable` becomes 0 and `constant` also. Let's try to modify these values afterwards.
```tokay
variable += 1  # increment variable by 1
constant += 1  # throws compile error: Cannot assign to constant 'constant'
```
Now `variable` becomes 1, but `constant` can't be assigned and Tokay throws a compile error.
What you can do is to redefine the constant with a new value.
```tokay
variable++    # increment variable by 1
constant : 1  # re-assign constant to 1
```
The reason is, that variables are evaluated at runtime, whereas constants are evaluated at compile-time, before the program is being executed.

The distinction between variables and constants is a tradeoff between flexibility and predictivity to make different concepts behind Tokay possible. The values of variables aren't known at compile-time, therefore predictive construction of code depending on the values used is not possible. On the other hand, constants can be used before their definition, which is very useful when thinking of functions being called by other functions before their definition.

## Callables and consumables

From the object types presented above, tokens and functions have the special properties that they are *callable* and possibly *consumable*.

- Tokens are always callable and considered to consume input
- Functions are always callable and are named
    - *parselets* when they consume input by either using tokens or a consumable constant
    - *functions* when they don't consume any input

For variables and constants, special naming rules apply which allow Tokay to determine a symbol type based on its identifier only.

*todo: This section is a stub. More examples and detailed explanations needed here.*

## Scopes

Variables and constants are organized in scopes.

1. A scope is any block, and the global scope.
2. Constants can be defined in any block. They can be re-defined by other constants in the same or in subsequent blocks. Constants being re-defined in a subsequent block are valid until the block ends, afterwards the previous constant will be valid again.
3. Variables are only distinguished between global and local scope of a parselet. Unknown variables used in a parselet block are considered as local variables.

Here's some commented code for clarification:
```tokay
x = 10  # global scope variable x
y : 2000  # global scope constant y
z = 30  # global scope variable z

# entering new scope of function f
f : @x {  # x is overridden as local variable
    y : 1000  # local constant y overrides global constant y temporarily in this block
    z += y + x # adds local constant y and local value of x to global value of z
}

f(42)

# back in global scope, x is still 10, y is 2000 again, z is 1072 now.
x y z
```

## Captures

Items in sequences are captured during execution. They are temporarily pushed and hold onto a stack, for later access. It is possible to access previously captured items using *capture variables*. Capture variables start with a dollar-sign (`$`) followed either by an index, an aliased name or any Tokay expression which evalutes to an index or an aliased named dynamically.

Tokay also allows to assign values to captures. This makes it possible to directly use captures like any other variable inside of the sequence and any subsequent blocks that belong to the sequence.

```tokay
# planets2.tok
Name {
    if $1 == "Earth" {
        $1 = "Home"
    }
    else if $1 == "Mars" || $1 == "Venus" {
        $1 += " (neighbour)"
    }
}
```

```shell
$ tokay planets2.tok -- "Mercury Venus Earth Mars Jupiter"
("Mercury", "Venus (neighbour)", "Home", "Mars (neighbour)", "Jupiter")
```

*todo: This section is a stub. More examples and detailed explanations needed here.*

# Tokens

## Matching strings

## Character-classes

## Modifiers

## Built-ins

# Parselets

## begin, end

## push, next

## accept, reject

## repeat

# Control structures

## if...else

## for

## loop

# Built-ins
