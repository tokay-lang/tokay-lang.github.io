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

# Structure

Tokay code is structured of *items* inside of *sequences* that are ordered in *blocks*.

- **Items** are
  - expressions like `1 + 2` or `++i * 3`
  - assignments like `x = 42` or `s += "duh"`
  - calls to `'tokens'`, `functions()` or `Parselets`
  - control flow instructions like `if x == 42 "yes" else "no"`
  - and even further `{ blocks }`
- **Sequences** are lines in a block, delimited by either the end of the line, a semicolon `;` or the blocks closing brace `}`. They are made of items.
- **Blocks** are defined by curly braces `{...}` and introduce a new scope of sequences. Sequences in a block are executed in order until an item *accepts* or *rejects* the entire block.

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

Items can either *accept* or *reject* their sequences and surrounding blocks during execution. This accepting or rejecting can occur with different priorities that depend on the type of item being executed.


# Expressions

Expressions are resulting in *values*. Let's discuss the meaning of values in Tokay first. Values are used everywhere, even when its not directly obvious. Generally speaking, everything in Tokay is some kind of value or part of a value.

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
'touch'    # non-verbose touch string in the input
''match''  # verbose match a string from the input
[A-Z0-9]+  # character-class matching a sequence of valid characters
Integer    # built-in token parsing and returning Integer values

# functions and parselets are callable, enclosed blocks of code
f : @x{ x * 2 }
f(9)  # 18

@x{ x * 3 }(5)  # 18, returned by anonymous function that is called in-place
```

Objects are discussed in detail in a later chapter below.

## Variables and constants

Symbolic identifiers for replaceable values can either be *variables* or *constants*.
```tokay
variable = 0  # assign 0 to a variable
constant : 0  # assign 0 to a constant
```
Obviously, this looks like the same. `variable` becomes 0 and `constant` also. Let's try to modify these values afterwards.
```tokay
variable += 1  # increment variable by 1
constant += 1  # throws compile error: Cannot assign to constant 'constant'
```
Now `variable` becomes 1, but `constant` can't be assigned and Tokay throws an error during compile-time.
What you can do is to redefine the constant with a new value.
```tokay
variable++    # increment variable by 1
constant : 1  # re-assign constant to 1
```
The reason is, that variables are evaluated at runtime, whereas constants are evaluated at compile-time, before the program is being executed.

The distinction between variables and constants is a tradeoff between flexibility and predictivity to make different concepts behind Tokay possible. The values of variables aren't known at compile-time, therefore predictive construction of code depending on the values used is not possible. On the other hand, constants can be used before their definition, which is very useful when thinking of functions being called by other functions before their definition.

# Callables and consumables

From the object types presented above, tokens and functions have two special properties:

- Tokens are always callable and considered to consume input
- Functions are always callable and are named
    - *parselets* when they consume input by either using tokens or a consumable constant
    - *functions* when they don't consume any input

For variables and constants, special naming rules apply which allow Tokay to determine a symbol type based on its identifier.

1. Consumable constants must start with an upper-case letter or an underscore
2. Non-consumable constants and variables must start with a lower-case letter

Some examples for clarification:
```tokay
Pi : 3.1415  # Error: Cannot assign non-consumable to consumable constant.
pi : 3.1415  # Ok

Cident : [A-Za-z_] [A-Za-z0-9_]* $0
cident : Cident  # Error: Cannot assign consumable to non-consumable constant.
NewCident : Cident  # Ok

faculty : @n {
    if n <= 0 return 1
    return n * faculty(n - 1)
}
Faculty : faculty  # Error: Cannot assign non-consumable to consumable constant.

Faculty : @{
    if Cident == "Faculty" accept
    reject
}  # Ok, because the function is a parselet as it calls Cident
```

# Scopes

Variables and constants are organized in scopes.

1. A scope is any `{block}` level, and the global scope.
2. Constants can be defined in any scope. Overridden constants become invalid and are replaced by their previous definition.
3. Variables are only distinguished between a global and a local scope of a parselet block. Unknown variables used in a parselet block are considered as local variables.

Here's some commented code for clarification:
```tokay
x = 10  # global scope variable
y : 2000  # global scope constant
z = 30  # global scope variable

# entering new scope of function f
f : @x {  # x is overridden as local variable
    y : 1000  # local constant y
    z + y + x # adds global value of z, local constant y and local value of x
}

# back in global scope
```


# Concepts

## Sequences and blocks



## Captures

Sequence items are captured during sequence execution. This means that they are temporarily pushed and hold onto a stack, for further access. It is possible to access previously captured items using *capture variables*. Capture variables start with a dollar-sign `$` followed either by an index, an aliased name or any Tokay expression which evalutes to an index or an aliased named dynamically.

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

## Parselets

todo


## Variables

Variables are values referenced by names which are evaluted at runtime. They can be set to any of the above value types, and constructed, assigned and modified in any order.

To assign variables, either use the assignment operators `=`, `+=`, `-=`, `*=`, `/=`, or by inplace pre- or postfix incrementation and decrementation operators `++` and `--`.

Examples:
```tokay
a = 42
b = true
c += 4  # equal to `c = void + 4`

# construction of a list (commas are optional)
l = (a  b  c + 2)  # `(42, true, 6)`

# construction of a dictionary (commas are optional)
d = (x => a  y => b  z => c + 3) # `(x => 42, y => true, z = 7)`

# assign a callable function
counter = @{
    # count from 0 to 9...
    for i = 0; i < 10; i++
        print(i)
}

# implicit call of the function
counter
# explicit call of the function
counter()
```

Variable identifiers are restricted to start with a lower-case character. Any other character is not permitted. So `x`, `y2`, `alpha` are valid, same as `bravoCharlie2` and `delta_echo`, but not `FoxtrotGolf`.

Variables can be defined globally or locally inside of a parselet. More about this follows later in the specific chapter.

Rules for variables:

1. Must start with a lower-case character.
2. Are distinguished between global and local scope.

## Constants

Constants are values evaluated at compile-time, before any program code is executed. Their values can't be changed or constructed, therefore constant may only be set to immutable values.

To define and assign a constant, use the `:` operator. Constants can be redefined several times.

Examples:
```tokay
# Pi as a constant
pi : 3.1415

# Debug flag
print(debug)  # `true`  (constant is backpatched)
debug : true
print(debug)  # `true`
debug : false
print(debug)  # `false`

debug = true  # forbidden, cannot assign to constant

# Constant function
faculty : @x {
    if !x return 1
    x * faculty(x - 1)
}

# C-style identifier
Identifier : [A-Za-z_] [A-Za-z0-9_]*

# Constant parselet
HelloWorlds : @{
    'Hello' 'World'+  # matches one or more "World"...
}
```

# Built-ins

todo
