import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import {
  createSimpleRouteJson,
  differentialPairs,
} from "../../../fixtures/differential-pair-solver"

test("rejects sparse explicit constraints with an indexed validation error", () => {
  const sparseDifferentialPairs = new Array<(typeof differentialPairs)[number]>(
    differentialPairs.length,
  )

  expect(
    () =>
      new DifferentialPairSolver(createSimpleRouteJson(), sparseDifferentialPairs),
  ).toThrow("Invalid differential pair at index 0: expected an object.")
})
