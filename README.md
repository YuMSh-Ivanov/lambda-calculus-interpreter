# Lambda calculus interpreter

Simple untyped λ-calculus interpreter. Examples:

```
λ> S := \x.\y.\z.x z (y z)
λ> K := \x.\y.x
λ> S K K
\z.z
```

Based on [KyrillL1's web-terminal](https://github.com/KyrillL1/web-terminal).
