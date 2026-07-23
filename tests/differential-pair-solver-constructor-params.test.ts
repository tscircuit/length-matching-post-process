import { expect, test } from "bun:test"
import {
  type DifferentialPairConstraints,
  DifferentialPairSolver,
} from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

test("retains every supplied pair as solver context", () => {
  const simpleRouteJson = createSimpleRouteJson()
  const multiplePairs: readonly DifferentialPairConstraints[] = [
    ...differentialPairs,
    {
      connectionNames: ["positive_trace", "unrelated_trace"],
      lengthTolerance: 0.25,
    },
  ]
  const solver = new DifferentialPairSolver(simpleRouteJson, multiplePairs)

  const [constructorSimpleRouteJson, constructorDifferentialPairs] =
    solver.getConstructorParams()

  expect(constructorSimpleRouteJson).toEqual(simpleRouteJson)
  expect(constructorDifferentialPairs).toEqual(multiplePairs)
  expect(constructorDifferentialPairs).not.toBe(multiplePairs)
})
