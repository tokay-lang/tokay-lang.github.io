+++
title = "Documentation"
weight = 2
+++

# Values

First of all, let's shortly discuss *values*. Values are used everywhere in a Tokay program, even where its not directly obvious. Generally speaking, in Tokay, everything is some kind of value.

*Atomic* values are one of the following.

```tokay
void                        # is a value representing just nothing
null                        # is a value representing a defined "set to nothing"
true false                  # boolean values
42 -23                      # signed 64-bit integers
3.1415 -1.337               # signed 64-bit floats
"Glasflügel Libelle 201b"   # is a unicode string
```

Values can also be one of the following *objects*.

```tokay
# list of values
(42, true, "yes")
(42 true yes)

# dictionary (dict), a map of key-value-pairs
(i => 42, b => true, status => "success")
(i => 42 b => true status => "success")

# tokens are callables consuming input from the stream
'string'  # match single string from input
[A-Z0-9]+  # character-class matching a string

# functions and parselets are callable blocks of code
f : @x{ x * 2 }
f(9)  # 18
@x{ x * 3 }(5)  # 18, by anonymous function that is directly called
```

# Variables and constants

Values can either be stored as *variables* or *constants* as symbolic identifiers.
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

The distinction between variables and constants is a tradeoff between flexibility and predictivity to make different concepts behind Tokay possible. The values of variables aren't known at compile-time, therefore predictive construction of code depending on the values used is not possible. On the other hand, constants can be used before their definition, which is very useful when thinking of functions and parselets being called by other functions and parselets before their definition.

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

Cident : [A-Za-z_] [A-Za-z0-9_]*
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
}  # Ok, because the function is a parselet because it calls Cident
```


# Concepts

## Sequences and blocks

Everything in Tokay is a *sequence* that belongs to a *block*.

You already saw both of them in the first steps above. For example, `'Hello World' count += 1` is a sequence with two items. First item is a match-token, second item is an add-assignment-operation, a shortcut for `a = a + 1`.

As the name implies, sequences are executed *sequentially*, item by item, and every item can accept or reject the entire sequence. In case the match-token `'Hello World'` from above is NOT matched in the input, the sequence is rejected. Otherwise, the add-assignment follows.

Every sequence finishes at the end of the line, therefore no special syntax is used. A semicolon `;` can optionally be used to define multiple sequences in one line.

When a sequence rejects, the next sequence in the same *block* will be executed. A block can be seen as a sequence of sequences, and is syntactically defined by curly braces `{...}`.

Essentially, a block has the following structure:
```tokay
{
    Sequence¹
    Sequence²
    Sequence³
    ...
}
```
Tokay's main scope is also an implicit block. Therefore, you don't have to put curly braces at first, because you directly start your program inside of a block, and all lines of code you add there are sequences in the main block.

Blocks can become items of other sequences. Here's an example how:
```tokay
'Hello ' {
    'Mercury'
    'Venus'
    'Earth'
}
```
Above code can also be shortened as a one-liner this way `'Hello ' { 'Mercury' ; 'Venus' ; 'Earth' }`.

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
