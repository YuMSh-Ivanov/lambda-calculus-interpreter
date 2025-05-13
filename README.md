# Lambda calculus interpreter

Simple untyped λ-calculus interpreter. Examples:

```
λ> S := \x.\y.\z.x z (y z)
λ> K := λx.λy.x
λ> S K K
λz.z
```

Link to github pages: https://yumsh-ivanov.github.io/lambda-calculus-interpreter/

Based on [KyrillL1's web-terminal](https://github.com/KyrillL1/web-terminal).
