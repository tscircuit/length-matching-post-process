import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("rejects sparse embedded constraints instead of accepting them as equivalent", () => {
  const simpleRouteJson = createSimpleRouteJson()
  Object.defineProperty(simpleRouteJson, "differentialPairs", {
    value: new Array<(typeof differentialPairs)[number]>(differentialPairs.length),
  })

  expect(
    () => new DifferentialPairSolver(simpleRouteJson, differentialPairs),
  ).toThrow("Invalid differential pair at index 0: expected an object.")
})
