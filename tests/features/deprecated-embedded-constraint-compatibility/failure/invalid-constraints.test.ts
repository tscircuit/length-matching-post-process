import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("rejects malformed optional embedded constraints", () => {
  const simpleRouteJson = createSimpleRouteJson()
  Object.defineProperty(simpleRouteJson, "differentialPairs", {
    value: [null],
  })

  expect(
    () => new DifferentialPairSolver(simpleRouteJson, differentialPairs),
  ).toThrow("Invalid differential pair at index 0: expected an object.")
})
