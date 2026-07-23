import { expect, test } from "bun:test"
import {
  DifferentialPairSolver,
  type SimpleRouteJson,
} from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("rejects conflicting deprecated embedded constraints", () => {
  const simpleRouteJson: SimpleRouteJson = createSimpleRouteJson()
  simpleRouteJson.differentialPairs = [
    {
      connectionNames: ["positive_trace", "unrelated_trace"],
      lengthTolerance: 0.1,
    },
  ]

  expect(
    () => new DifferentialPairSolver(simpleRouteJson, differentialPairs),
  ).toThrow(
    "simpleRouteJson.differentialPairs conflicts with the explicit differentialPairs constructor argument.",
  )
})
