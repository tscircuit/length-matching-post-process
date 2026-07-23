import { describe, expect, test } from "bun:test"
import {
  DifferentialPairSolver,
  type SimpleRouteDifferentialPair,
  type SimpleRouteJson,
} from "../lib"
import { createSimpleRouteJson, differentialPairs } from "./fixtures"

describe("DifferentialPairSolver no-op scaffold", () => {
  test("returns a complete independent SRJ without mutating its inputs", () => {
    const simpleRouteJson = createSimpleRouteJson()
    const originalSimpleRouteJson = structuredClone(simpleRouteJson)
    const originalDifferentialPairs = structuredClone(differentialPairs)
    const solver = new DifferentialPairSolver(
      simpleRouteJson,
      differentialPairs,
    )

    solver.solve()
    const output = solver.getOutput()

    expect(simpleRouteJson).toEqual(originalSimpleRouteJson)
    expect(differentialPairs).toEqual(originalDifferentialPairs)
    expect(output).toEqual(simpleRouteJson)
    expect(output).not.toBe(simpleRouteJson)
    expect(output.connections).not.toBe(simpleRouteJson.connections)
    expect(output.traces).not.toBe(simpleRouteJson.traces)
    expect(output.traces?.[0]?.route).not.toBe(
      simpleRouteJson.traces?.[0]?.route,
    )

    const firstOutputWire = output.traces?.[0]?.route[0]
    if (firstOutputWire?.route_type === "wire") firstOutputWire.x = 99
    output.connections[0]!.pointsToConnect[0]!.x = 99

    expect(simpleRouteJson).toEqual(originalSimpleRouteJson)
    expect(solver.getOutput()).toEqual(originalSimpleRouteJson)
  })

  test("retains every supplied pair as solver context", () => {
    const simpleRouteJson = createSimpleRouteJson()
    const multiplePairs = [
      ...differentialPairs,
      {
        connectionNames: [
          "positive_trace",
          "unrelated_trace",
        ] as const,
        lengthTolerance: 0.25,
      },
    ] satisfies readonly SimpleRouteDifferentialPair[]
    const solver = new DifferentialPairSolver(simpleRouteJson, multiplePairs)

    const [constructorSimpleRouteJson, constructorDifferentialPairs] =
      solver.getConstructorParams()

    expect(constructorSimpleRouteJson).toEqual(simpleRouteJson)
    expect(constructorDifferentialPairs).toEqual(multiplePairs)
    expect(constructorDifferentialPairs).not.toBe(multiplePairs)
  })

  test("rejects unknown connection references", () => {
    const simpleRouteJson = createSimpleRouteJson()

    expect(
      () =>
        new DifferentialPairSolver(simpleRouteJson, [
          {
            connectionNames: ["positive_trace", "missing_trace"],
            lengthTolerance: 0.1,
          },
        ]),
    ).toThrow(
      'Differential pair at index 0 references unknown connection "missing_trace".',
    )
  })

  test("rejects conflicting deprecated embedded constraints", () => {
    const simpleRouteJson = createSimpleRouteJson()
    simpleRouteJson.differentialPairs = [
      {
        connectionNames: ["positive_trace", "negative_trace"],
        lengthTolerance: 0.2,
      },
    ]

    expect(
      () => new DifferentialPairSolver(simpleRouteJson, differentialPairs),
    ).toThrow(
      "simpleRouteJson.differentialPairs conflicts with the explicit differentialPairs constructor argument.",
    )
  })

  test("accepts equivalent embedded constraints in a different pair order", () => {
    const simpleRouteJson = createSimpleRouteJson()
    const explicitPairs = [
      ...differentialPairs,
      {
        connectionNames: [
          "positive_trace",
          "unrelated_trace",
        ] as [string, string],
        lengthTolerance: 0.25,
      },
    ]
    simpleRouteJson.differentialPairs = explicitPairs.toReversed()

    expect(
      () => new DifferentialPairSolver(simpleRouteJson, explicitPairs),
    ).not.toThrow()
  })

  test("requires solve before output", () => {
    const solver = new DifferentialPairSolver(
      createSimpleRouteJson(),
      differentialPairs,
    )

    expect(() => solver.getOutput()).toThrow(
      "DifferentialPairSolver.getOutput() cannot be called before solve().",
    )
  })

  test("accepts readonly pairs and returns the canonical complete SRJ type", () => {
    const readonlyPairs = differentialPairs
    const solver = new DifferentialPairSolver(
      createSimpleRouteJson(),
      readonlyPairs,
    )

    solver.solve()
    const output: SimpleRouteJson = solver.getOutput()

    expect(output.traces).toHaveLength(3)
  })
})
