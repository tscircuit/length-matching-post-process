import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

test("accepts readonly pairs and returns the canonical complete SRJ type", () => {
  const readonlyPairs = differentialPairs
  const solver = new DifferentialPairSolver(
    createSimpleRouteJson(),
    readonlyPairs,
  )

  solver.solve()
  const output = solver.getOutput()

  expect(output.traces).toHaveLength(3)
})
