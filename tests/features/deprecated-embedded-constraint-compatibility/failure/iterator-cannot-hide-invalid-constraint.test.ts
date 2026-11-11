import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import { createSimpleRouteJson } from "../../../fixtures/differential-pair-solver"

test("validates embedded array entries even when its iterator is empty", () => {
  const simpleRouteJson = createSimpleRouteJson()
  const constraints = [null]
  Object.defineProperty(constraints, Symbol.iterator, { value: function* () {} })
  Object.defineProperty(simpleRouteJson, "differentialPairs", {
    value: constraints,
  })

  expect(() => new DifferentialPairSolver(simpleRouteJson, [])).toThrow(
    "Invalid differential pair at index 0: expected an object.",
  )
})
