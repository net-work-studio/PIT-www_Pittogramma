# Domain Docs

How the engineering skills should consume this repository's domain
documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repository root.
- Relevant ADRs under `docs/adr/`.

If a file or directory does not exist, proceed silently. Domain-modeling skills
create them lazily when terminology or durable architectural decisions are
resolved.

## File structure

This is a single-context repository:

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
```

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, proposal, hypothesis, or
test—use the term defined in `CONTEXT.md`. Do not drift to synonyms the glossary
explicitly avoids.

If a required concept is missing, reconsider whether the new term is necessary
or note the gap for domain modeling.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly
instead of silently overriding it.
