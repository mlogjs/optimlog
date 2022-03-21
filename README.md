# OptiMlog

> This project is still W.I.P. (Looking for help!)

A Mindustry Logic Preprocessor, Linter and Optimizer.

This tool will probably not be very useful, but I think it is great learning experience to try and attempt to build a code optimizer for a fairly simple assembly-like language.

## Lots of issues!

- Location provided by the tokenizer is incorrect (according to Monaco Editor)
- Jump statement operands causes issues
- And more to be discovered

## Optimization Pipeline

**Done, but buggy (code is ugly)**

- Tokenize `toTokenizedLines`
- Transform tokens to simplify it
  - `unlabelJumps` (replace labels by their address)
  - `replaceCounterAddress` (`set here @counter` to `set here <address>`)
  - `spanLineDirectives`
- Parse into instructions `toInstructions`
- Basic infer all values (super set) of all references
- Divide code into non-branching blocks `toBlocks` (also considers jump made by `set @counter x` using above infered values)

**Planned**

- Merge blocks (remove useless `jump x always` or `set @counter x`)
- Detect unreachable code and warn
- Infer the value of all variables at a certain point in time inside each block.
- Constant-folding
- Factorize math expressions to reduce instructions
- Combine redundant variables
- Try inline jumps (functions) (and optimize, rollback if code ends up being bigger)
- Repeat until code cannot get any smaller
- Output optimized code

## Directives

`@om-keep` is a directive to tell the optimizer to not optimize the instruction out of existance. It will internally be handled as a side effect instruction.

```py
set keepMe 123 # @om-keep
set another 123 # @om-keep
```
or
```py
# @om-keep:begin
set keepMe 123
set another 123
# @om-keep:end
```
> The `spanLineDirectives` transform will convert the second example to the the first one.

## Developping

`yarn dev` will give you a web interface to see the `log` messages inside a monaco editor.

Thank you for contributing!