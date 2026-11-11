import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("preserves explicit indexed constraints even when its iterator is empty", () => {
  const constraints = [...differentialPairs]
  Object.defineProperty(constraints, Symbol.iterator, { value: function* () {} })
  const solver = new DifferentialPairSolver(createSimpleRouteJson(), constraints)

  expect(solver.getConstructorParams()[1]).toEqual(differentialPairs)
})
