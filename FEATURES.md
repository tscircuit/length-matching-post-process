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
