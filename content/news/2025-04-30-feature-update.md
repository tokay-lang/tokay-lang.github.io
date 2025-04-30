+++
title = "v0.6.7 and Tokay Syntax Highligting for VSCode"
date = "2025-04-30"
+++

We're happy to announce a tiny feature update **v0.6.7**.

It has some smaller fixes and neat changes included, and brings Tokay more towards the next milestone, which is a heavier duty and still needs some time.

<!-- more -->

# Changelog Tokay v0.6.7

Highlights of this feature release are

- feat: `list_index()`-function
- feat: `min()`, `max()`, `sum()` and `avg()` (#145)
- feat: Add builtin `str_find`
- feat: Adding `list_clone()` function
- feat: Implement explicit `list_extend()`
- feat: Improved `for...in` syntax
- feat: Improved `Token` prelude to match `AsciiPunctuation` first
- feat: Improving `dict` iteration & access
- fix: `InlineList` doesn't accept multi-line list definitions
- fix: `Keyword<P>` doesn't recognize '_'
- fix: `list_iadd` with void (#146)
- fix: `loop`-syntax should allow for "loop\n{..."
- fix: `Op::MakeDict()` creates reversed key order
- fix: Complex chained comparison compile into broken code
- fix: Disallow variable shadowing by constants
- fix: Enforce use of `*`-deref for assignments
- fix: Generic `Self`/`self` (#142)
- fix: Improve `float` repr & str representation
- fix: Improve `inplace/(post|pre)` syntax
- fix: object `iadd` call with standalone imutable
- fix+doc: docs for `dict()`, removed `dict_push()`
- perf: Improving VM `Op::MakeDict` and `Op::MakeList`
- refactor: `ImlProgram` compilation and finalization (#147)
- test: Adding test case for dict_clone()
- test: Split `dict.tok` testcases into separate files

# Visual Studio Code Plugin (vscode-tokay)

For **Visual Studio Code** and **OSS-Code**, we're happy to announce a first release v0.0.2 of an official plugin which provides syntax highlighting for Tokay v0.6.7 programs.

[![Screenshot showing Code-OSS with an actively edited Tokay program](/news/2025-04-30-vscode.jpg)](/news/2025-04-30-vscode.jpg)

- The plugin can be directly found and installed from the Visual Studio marketplace at [https://marketplace.visualstudio.com/items?itemName=phorward.vscode-tokay](https://marketplace.visualstudio.com/items?itemName=phorward.vscode-tokay)
- To install the plugin in Code-OSS, simply download the .VSX-file from [https://github.com/tokay-lang/vscode-tokay](https://github.com/tokay-lang/vscode-tokay)

Support of any kind on this new tooling is highly appreciated!
