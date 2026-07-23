import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../lib"
import { createSimpleRouteJson } from "./fixtures"

test("rejects unknown connection references", () => {
  const simpleRouteJson = createSimpleRouteJson()

  expect(
    () =>
      new DifferentialPairSolver(simpleRouteJson, [
        {
          connectionNames: ["positive_trace", "missing_trace"],
          lengthTolerance: 0.1,
        },
      ]),
  ).toThrow(
    'Differential pair at index 0 references unknown connection "missing_trace".',
  )
})
