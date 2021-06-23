+++
title = "Documentation"
weight = 2
+++

# Preface

Tokay programs are expressed and executed differently as in common programmming languages like Python or Rust. Therefore, Tokay is not "yet another programming language".
It was designed with the goal to let its programs directly operate on input streams read from files, strings, piped commands or any other device emitting characters.

The most obvious example to show how Tokay executes its programs is this little matcher to greet the inner planets of our solar system:

```tokay
'Hello' _ {
    'Mercury'
    'Venus'
    'Earth'
}
```

In comparison to other programming languages, there's no explicit branching, substring extraction or reading from input required, as this is directly built into the language and its entire structuring.

If you're familiar with the [awk](https://en.wikipedia.org/wiki/AWK) language, you might find a similarity in above example to awk's `PATTERN { action }` syntax. This is exactly where the intention behind Tokay starts, but not by thinking of a line-based execution working on fields, but a token-based approach working on anything matched from the input.

# Syntax

First of all, some explantions about Tokays syntax.

## Comments

Tokay currently supports line-comments, starting with a `#`. The rest of the line will be ignored.

```tokay
# This is a comment
a = 10  # this is also a comment.
```

## Reserved words

In Tokay, the following are reserved words for control structures and special behaviors.

```tokay
accept begin else end expect false if not null peek reject repeat return true void
```
This list is currently incomplete, as Tokay is under heavy development. For example, there might be one `loop`-keyword but also variants of `for` and `while`, which currently is under consideration.

## Identifiers

Naming rules for identifiers in Tokay differ to other programming languages, and this is an essential feature.

1. As known from other languages, identifiers might **not** start with a digit (`0-9`).
2. Variables have to start with a lower-case letter from (`a-z`)
3. Constants have to start either
   - with an upper-case letter (`A-Z`) or an underscore (`_`) when they refer consumable values,
   - otherwise they can also start with a lower-case letter from (`a-z`).

More about *consumable* and *non-consumable* values, *variables* and *constants* will be discussed later.

## Sequences

Sequences are a fundamental and powerful feature of Tokay, as you will see later. We will only discuss their syntax and simple examples here for now.

Every single value, call, expression, control-flow statement or even block is considered as an item. We will discuss blocks shortly.
Those items can be chained to a sequences directly in every line of a Tokay program.
```tokay
1 2 3 + 4    # results in a list (1, 2, 7)
```
For better readability, items of a sequence can also be optionally separated by commas (`,`), so
```tokay
1, 2, 3 + 4  # (1, 2, 7)
```
is the same.

All items of a sequence with a given severity are used to determine the result of the sequence. Therefore, these sequences return `(1, 2, 7)` in the above example, when entered in a Tokay REPL. Severities and automatic value construction of sequences will be handled later on.

The items of a sequence are captured, so they can be accessed inside of the sequence using *capture variables*. In the next example, the first capture, which holds the result `7` from the expression `3 + 4` is referenced with `$1` and used in the second item as value of the expression. Referencing a capture which is out of bounds will just return a `void` value.
```tokay
3 + 4, $1 * 2  # (7, 14)
```
Captures can also be re-assigned by following captures. This one assigns a value at the second item to the first item, and uses the first item inside of the calculation. The second item anyway exists and refers to `void`. This is the reason why Tokay has two values to simply define nothing, which are `void` and `null`.
```tokay
3 + 4, $3 = $3 * 2  # 14
```
As the result of the above sequence, just one value results which is `14`, but the second item's value, `void`, has a lower severity than the calculated and assigned first value. This is the magic with sequences that you will soon figure out in detail, especially when tokens from streams are accessed and processed, or your programs work on extracted information from the input.

As the last example, we shortly show how sequence items can also be named and can be accessed by their name.
```tokay
hello => "Hello", $hello = 3 * $hello  # (hello => "HelloHelloHello")
```
Here, the first item, which is referenced by the capture variable `$hello` is repeated 3 times as the second item.
This might be quite annoying, but the result of this sequence is a dict. A dict is a hash-table where values can be referenced by a key.


## Newlines

In Tokay, newlines and line-breaks respectively (`\n`) are meaningful. They separate sequences from each other, as you will learn in the next section.

```tokay
"1st" "sequence"
"2nd" "sequence"
"3rd" "sequence"
```

Instead of a newline, a semicolon (`;`) can also be used, which has the same meaning. A single-line sequence can be split into multiple lines by preceding a backslash in front of the line-break.

```tokay
"1st" \
    "sequence"
"2nd" "sequence" ; "3rd" "sequence"
```
The first and second example are literally the same.

## Blocks



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

1. Consumable, callable constants must start with an upper-case letter **A-Z** or an underscore **_**.
2. Non-consumable or not callable constants and any variable must start with a lower-case letter **a-z**.

Some examples for clarification:
```tokay
Pi : 3.1415  # Error: Cannot assign non-consumable to consumable constant.
pi : 3.1415  # Ok

Cident : [A-Za-z_] [A-Za-z0-9_]* $0
cident : Cident  # Error: Cannot assign consumable to non-consumable constant.
NewCident : Cident  # Ok

faculty : @n {
    if n <= 0 return 1
    n * faculty(n - 1)
}
Faculty : faculty  # Error: Cannot assign non-consumable to consumable constant.

IsOkay : @{
    Integer if $1 > 100 && $1 < 1000 accept
}  # Ok, because the function is a parselet as it calls Cident
```

## Scopes

Variables and constants are organized in scopes.

1. A scope is any `{block}` level, and the global scope.
2. Constants can be defined in any scope. They can be re-defined by other constants in the same or in subsequent blocks. Constants being re-defined in a subsequent block are valid until the block ends, afterwards the previous constant will be valid again.
3. Variables are only distinguished between a global and a local scope of a parselet block. Unknown variables used in a parselet block are considered as local variables.

Here's some commented code for clarification:
```tokay
x = 10  # global scope variable
y : 2000  # global scope constant
z = 30  # global scope variable

# entering new scope of function f
f : @x {  # x is overridden as local variable
    y : 1000  # local constant y overrides global constant y temporarily
    z += y + x # adds local constant y and local value of x to global value of z
}

f(42)

# back in global scope, y is 2000 again, z is 1072 now.
```


## Blocks, sequences and items

Tokay code is structured by *items* inside of *sequences* that are ordered in *blocks*.

- **Blocks** are defined by curly braces `{...}` and introduce a new alternation of sequences. Sequences in a block are executed in order until an item of a sequence or the sequence itself *accepts* or *rejects* the block.
- **Sequences** are lines in a block, delimited by either the end of the line, a semicolon `;` or the blocks closing brace `}`. They are made of items.
*rejects* the entire block.
- **Items** are
  - expressions like `1 + 2` or `++i * 3`
  - assignments like `x = 42` or `s += "duh"`
  - calls to `'tokens'`, `functions()` or `Parselets`
  - control flow instructions like `if x == 42 "yes" else "no"`
  - and even further `{ blocks }`

These are the three basic elements in Tokay which complement among each other. The code structuring is shown in the pseudo-code example below.

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

Every item can either accept or reject its sequence. This is essential for the stream-directed approach Tokay follows. When a token, say `'Hello'`, from the example in the preface, doesn't match the current input, any following items are not being executed. The token is being accepted when the input is exactly `Hello`, otherwise it is rejected, and a possible next alternative can be tried.

This does apply to any item in tokay, but there are different priorities for either accept or reject, which will be discussed in detail for related items later.


## Captures

Items in sequences are captured during execution. They are temporarily pushed and hold onto a stack, for later access. It is possible to access previously captured items using *capture variables*. Capture variables start with a dollar-sign `$` followed either by an index, an aliased name or any Tokay expression which evalutes to an index or an aliased named dynamically.

Here are some examples:
```tokay
Name print($1)
the_name => Name print($the_name)
```

First line matches a `Name` (which is any word consisting of alphanumeric letters) and the following `print`-call accesses this name by its index, starting at `$1` for the first item. `$0` does also exists, but in sequences with multiple tokens, it holds the entire text matched from beginning of the sequences to the end. `$0` and `$1` would return exactly the same result in this case.

The second line uses an alias `the_name` for the result of `Name`. Afterwards, the capture can be accessed either via `$1` by index, or by `$the_name` as alias.

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
