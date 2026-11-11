# Features

No length-matching features are supported yet. Version `0.0.1` is an integration
scaffold: it validates and snapshots routed Simple Route JSON but intentionally
does not alter route geometry.

## Planned features

### Single-meander length matching

Add a meander to the shorter member of a differential pair when the existing
route has enough usable space to satisfy the configured length tolerance.

Status: not implemented.

### Rerouting with meanders

Reroute either or both members of a differential pair to create room for
meanders while treating unrelated traces and fixed PCB geometry as immutable
obstacles.

Status: not implemented.

## Scaffold contract tests

The initial release is covered by contract tests rather than feature tests:

- [returns an independent no-op output](tests/features/routed-srj-pass-through/success/output-cloning.test.ts)
- [rejects invalid pair constraints](tests/features/explicit-differential-pair-constraints/failure/unknown-connection.test.ts)

## Constraint-array validation

Explicit and deprecated embedded constraint arrays reject sparse slots with an
indexed validation error. Input validation always applies and has no feature flag.

- [rejects sparse explicit constraints](tests/features/explicit-differential-pair-constraints/failure/sparse-constraints.test.ts)
- [rejects sparse embedded constraints](tests/features/deprecated-embedded-constraint-compatibility/failure/sparse-constraints.test.ts)

## Indexed constraint preservation

Constraint validation reads numeric array entries, regardless of a custom
iterator. This input-boundary behavior always applies and has no feature flag.

- [retains indexed constraints with an empty iterator](tests/features/explicit-differential-pair-constraints/success/iterator-preserves-indexed-constraints.test.ts)
- [rejects an indexed invalid entry hidden by an iterator](tests/features/deprecated-embedded-constraint-compatibility/failure/iterator-cannot-hide-invalid-constraint.test.ts)
