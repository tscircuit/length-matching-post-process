import { expect, test } from "bun:test"
import {
  type DifferentialPairConstraints,
  DifferentialPairSolver,
  type SimpleRouteJson,
} from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

test("accepts equivalent embedded constraints in any pair or member order", () => {
  const simpleRouteJson: SimpleRouteJson = createSimpleRouteJson()
  const explicitPairs: DifferentialPairConstraints[] = [
    ...differentialPairs,
    {
      connectionNames: ["positive_trace", "unrelated_trace"],
      lengthTolerance: 0.1,
    },
  ]
  simpleRouteJson.differentialPairs = [
    {
      connectionNames: ["unrelated_trace", "positive_trace"],
      lengthTolerance: 0.1,
    },
    {
      connectionNames: ["negative_trace", "positive_trace"],
      lengthTolerance: 0.1,
    },
  ]

  expect(
    () => new DifferentialPairSolver(simpleRouteJson, explicitPairs),
  ).not.toThrow()
})
