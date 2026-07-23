# Features

This release validates and snapshots routed Simple Route JSON. It does not alter
route geometry or perform length matching.

## Routed SRJ pass-through

`solve()` preserves the complete routed SRJ without changing trace geometry.
Constructor inputs remain unchanged, each output is structurally independent,
and requesting output before solving fails.

Representative tests:

- [returns an independent output](tests/features/routed-srj-pass-through/success/output-cloning.test.ts)
- [rejects output before solve](tests/features/routed-srj-pass-through/failure/output-before-solve.test.ts)

## Explicit differential-pair constraints

The solver accepts a readonly array containing every differential pair for one
invocation, snapshots every pair, validates pair shapes and tolerances, and
rejects missing, malformed, or ambiguous connection references.

Representative tests:

- [retains every supplied pair](tests/features/explicit-differential-pair-constraints/success/constructor-params.test.ts)
- [rejects unknown connections](tests/features/explicit-differential-pair-constraints/failure/unknown-connection.test.ts)

## Deprecated embedded-constraint compatibility

The optional `SimpleRouteJson.differentialPairs` field is accepted when it is
equivalent to the explicit constraints, regardless of pair or member order.
Malformed or conflicting embedded constraints are rejected.

Representative tests:

- [accepts equivalent constraints](tests/features/deprecated-embedded-constraint-compatibility/success/equivalent-constraints.test.ts)
- [rejects conflicting constraints](tests/features/deprecated-embedded-constraint-compatibility/failure/conflicting-constraints.test.ts)
