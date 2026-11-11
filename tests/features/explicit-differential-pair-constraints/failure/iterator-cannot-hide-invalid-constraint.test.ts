import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("validates explicit array entries even when its iterator is empty", () => {
  const constraints = [...differentialPairs]
  Object.defineProperty(constraints, 0, { value: null })
  Object.defineProperty(constraints, Symbol.iterator, { value: function* () {} })

  expect(
    () => new DifferentialPairSolver(createSimpleRouteJson(), constraints),
  ).toThrow("Invalid differential pair at index 0: expected an object.")
})
