# Lambda calculus interpreter

Simple untyped λ-calculus interpreter. Examples:

```
> S := \x.\y.\z.x z (y z)
> K := \x.\y.x
> S K K
\x.x    aliases: I
```

Based on [KyrillL1's web-terminal](https://github.com/KyrillL1/web-terminal).
