import { expect, test } from "bun:test"
import { DifferentialPairSolver } from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

test("returns a complete independent SRJ without mutating its inputs", () => {
  const simpleRouteJson = createSimpleRouteJson()
  const originalSimpleRouteJson = structuredClone(simpleRouteJson)
  const originalDifferentialPairs = structuredClone(differentialPairs)
  const solver = new DifferentialPairSolver(simpleRouteJson, differentialPairs)

  solver.solve()
  const output = solver.getOutput()

  expect(simpleRouteJson).toEqual(originalSimpleRouteJson)
  expect(differentialPairs).toEqual(originalDifferentialPairs)
  expect(output).toEqual(simpleRouteJson)
  expect(output).not.toBe(simpleRouteJson)
  expect(output.connections).not.toBe(simpleRouteJson.connections)
  expect(output.traces).not.toBe(simpleRouteJson.traces)
  expect(output.traces?.[0]?.route).not.toBe(simpleRouteJson.traces[0]?.route)

  const firstOutputWire = output.traces?.[0]?.route[0]
  if (!firstOutputWire || firstOutputWire.route_type !== "wire") {
    throw new Error("Expected the first output route point to be a wire.")
  }
  const firstOutputConnectionPoint = output.connections[0]?.pointsToConnect[0]
  if (!firstOutputConnectionPoint) {
    throw new Error("Expected the first output connection point to exist.")
  }

  firstOutputWire.x = 99
  firstOutputConnectionPoint.x = 99

  expect(simpleRouteJson).toEqual(originalSimpleRouteJson)
  expect(solver.getOutput()).toEqual(originalSimpleRouteJson)
})
