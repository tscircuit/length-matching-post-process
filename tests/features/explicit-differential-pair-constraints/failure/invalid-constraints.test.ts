import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../../../../lib"
import { createSimpleRouteJson } from "../../../fixtures/differential-pair-solver"

test("rejects malformed explicit constraints from JavaScript callers", () => {
  expect(() => {
    Reflect.construct(DifferentialPairSolver, [
      createSimpleRouteJson(),
      [null],
    ])
  }).toThrow("Invalid differential pair at index 0: expected an object.")
})
