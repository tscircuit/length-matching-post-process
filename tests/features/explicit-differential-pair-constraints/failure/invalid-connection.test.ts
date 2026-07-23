import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("rejects malformed connections from JavaScript callers", () => {
  const simpleRouteJson = createSimpleRouteJson()
  Object.defineProperty(simpleRouteJson, "connections", {
    value: [null],
  })

  expect(
    () => new DifferentialPairSolver(simpleRouteJson, differentialPairs),
  ).toThrow(
    "Invalid SimpleRouteJson connection at index 0: name must be a non-empty string.",
  )
})
