# @tscircuit/length-matching-solver

Post-process routed [Simple Route JSON](https://github.com/tscircuit/simple-route-json)
to satisfy differential-pair length-skew constraints.

## Initial no-op release

Version `0.0.1` establishes the package and core integration contract. It
validates the input, preserves it without changing route geometry, and returns a
structurally independent complete Simple Route JSON object. Coordinated
length-matching and meander generation will replace the marked implementation
boundary in a later release.

## Usage

```ts
import {
  DifferentialPairSolver,
  type SimpleRouteDifferentialPair,
  type SimpleRouteJson,
} from "@tscircuit/length-matching-solver"

const simpleRouteJson: SimpleRouteJson = getCompleteRoutedSimpleRouteJson()
const differentialPairs: readonly SimpleRouteDifferentialPair[] = [
  {
    connectionNames: ["source_trace_positive", "source_trace_negative"],
    lengthTolerance: 0.1,
  },
]

const solver = new DifferentialPairSolver(
  simpleRouteJson,
  differentialPairs,
)
solver.solve()

const outputSimpleRouteJson = solver.getOutput()
```

All lengths, including `lengthTolerance`, are in millimeters.

The constructor receives the complete routed SRJ and the complete constraint
array for one routed subcircuit. All pairs are intentionally passed to one
solver invocation so future implementations can coordinate their geometry and
validate the final result as a whole. Either member of a supplied pair may be
rerouted, including a manually routed member. Non-pair traces remain immutable
obstacles.

Constructor inputs are never mutated. The solver snapshots both inputs, and
each `getOutput()` call returns a new complete SRJ without sharing mutable
arrays or route objects with the input or previous output.

`SimpleRouteJson.differentialPairs` remains available only for compatibility
and is deprecated. Pass constraints as the second constructor argument. If the
deprecated field is present and disagrees with the explicit array, construction
fails instead of silently choosing one representation.

## Validation errors

Construction reports actionable errors when:

- a pair does not contain two distinct non-empty connection names;
- `lengthTolerance` is not a finite, non-negative millimeter value;
- a referenced connection is absent or ambiguous in `connections`;
- the deprecated embedded constraints conflict with the explicit array; or
- the input is not a complete routed SRJ containing `connections` and `traces`.

## Development

```sh
bun install
bun run build
bun run typecheck
bun test
bun run start
```

`bun run start` opens the Cosmos fixture at `http://localhost:5000`. The fixture
shows the routed input and no-op output for a labeled differential pair.
