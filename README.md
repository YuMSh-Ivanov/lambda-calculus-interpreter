# Lambda calculus interpreter

## Syntax

Three commands available:
1. `:set <option> <value>` — sets option to value. See [options list](#Options) below.
2. `<Macro> := <lambda-expression>` — sets macro to the specified expression for it to be usable in future commands. Macro is a word starting with uppercase letter. No usual variable can start with an uppercase letter.
3. `<lambda-expression>` — β-reduce expression to normal form and prints it with reduction count.

Lambda-expression syntax:
```
<lambda-expression> = <variable>
                    | λ<variable>.<lambda-expression>
                    | <lambda-expression> <lambda-expression>
                    | ( <lambda-expression> )
```
Lambda symbol can be replaced with backslash.

See [examples](#Examples) below.

## Options

Currently available options:

| Option   | Values              | Default | Meaning                                                              |
|----------|---------------------|---------|----------------------------------------------------------------------|
| trace    | on, off             | off     | Prints every reduction (instead of just the normal form) if enabled. |
| strategy | applicative, normal | normal  | Sets evaluation order.                                               |

## Examples

```
λ> S := \x.\y.\z.x z (y z)
λ> K := λx.λy.x
λ> S K K

λz.z 4 reductions
```

```
λ> I := \x.x
λ> :set trace on
λ> (\x.x x x x)(I I)

(λx.x x x x) ((λx.x) (λx.x))
(λx.x) (λx.x) ((λx.x) (λx.x)) ((λx.x) (λx.x)) ((λx.x) (λx.x))
(λx.x) ((λx.x) (λx.x)) ((λx.x) (λx.x)) ((λx.x) (λx.x))
(λx.x) (λx.x) ((λx.x) (λx.x)) ((λx.x) (λx.x))
(λx.x) ((λx.x) (λx.x)) ((λx.x) (λx.x))
(λx.x) (λx.x) ((λx.x) (λx.x))
(λx.x) ((λx.x) (λx.x))
(λx.x) (λx.x)
λx.x
8 reductions

λ> :set strategy applicative
λ> (\x.x x x x)(I I)

(λx.x x x x) ((λx.x) (λx.x))
(λx.x x x x) (λx.x)
(λx.x) (λx.x) (λx.x) (λx.x)
(λx.x) (λx.x) (λx.x)
(λx.x) (λx.x)
λx.x
5 reductions
```

## Website

Link to github pages: https://yumsh-ivanov.github.io/lambda-calculus-interpreter/

## Thanks

Based on [KyrillL1's web-terminal](https://github.com/KyrillL1/web-terminal).
