import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

test("requires solve before output", () => {
  const solver = new DifferentialPairSolver(
    createSimpleRouteJson(),
    differentialPairs,
  )

  expect(() => solver.getOutput()).toThrow(
    "DifferentialPairSolver.getOutput() cannot be called before solve().",
  )
})
