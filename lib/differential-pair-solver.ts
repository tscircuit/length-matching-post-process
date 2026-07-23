import type {
  SimpleRouteDifferentialPair,
  SimpleRouteJson,
} from "./simple-route-json"

const cloneSimpleRouteJson = (
  simpleRouteJson: SimpleRouteJson,
): SimpleRouteJson => structuredClone(simpleRouteJson)

const cloneDifferentialPairs = (
  differentialPairs: readonly SimpleRouteDifferentialPair[],
): SimpleRouteDifferentialPair[] =>
  differentialPairs.map(({ connectionNames, lengthTolerance }) => ({
    connectionNames: [connectionNames[0], connectionNames[1]],
    lengthTolerance,
  }))

const getCanonicalDifferentialPairKeys = (
  differentialPairs: readonly SimpleRouteDifferentialPair[],
): string[] =>
  differentialPairs
    .map(({ connectionNames, lengthTolerance }) =>
      JSON.stringify({ connectionNames, lengthTolerance }),
    )
    .sort()

const embeddedDifferentialPairsMatchExplicitPairs = (
  embeddedDifferentialPairs: readonly SimpleRouteDifferentialPair[],
  explicitDifferentialPairs: readonly SimpleRouteDifferentialPair[],
): boolean => {
  const embeddedKeys = getCanonicalDifferentialPairKeys(
    embeddedDifferentialPairs,
  )
  const explicitKeys = getCanonicalDifferentialPairKeys(
    explicitDifferentialPairs,
  )

  return (
    embeddedKeys.length === explicitKeys.length &&
    embeddedKeys.every((key, index) => key === explicitKeys[index])
  )
}

const validateSimpleRouteJson = (simpleRouteJson: SimpleRouteJson): void => {
  if (!Array.isArray(simpleRouteJson.connections)) {
    throw new Error(
      "DifferentialPairSolver requires a complete routed SimpleRouteJson with a connections array.",
    )
  }

  if (!Array.isArray(simpleRouteJson.traces)) {
    throw new Error(
      "DifferentialPairSolver requires a complete routed SimpleRouteJson with a traces array.",
    )
  }
}

const validateDifferentialPairs = (
  simpleRouteJson: SimpleRouteJson,
  differentialPairs: readonly SimpleRouteDifferentialPair[],
): void => {
  const connectionCountsByName = new Map<string, number>()
  for (const connection of simpleRouteJson.connections) {
    connectionCountsByName.set(
      connection.name,
      (connectionCountsByName.get(connection.name) ?? 0) + 1,
    )
  }

  for (const [pairIndex, differentialPair] of differentialPairs.entries()) {
    const { connectionNames, lengthTolerance } = differentialPair
    if (
      !Array.isArray(connectionNames) ||
      connectionNames.length !== 2 ||
      connectionNames.some(
        (connectionName) =>
          typeof connectionName !== "string" || connectionName.length === 0,
      ) ||
      connectionNames[0] === connectionNames[1]
    ) {
      throw new Error(
        `Invalid differential pair at index ${pairIndex}: connectionNames must contain two distinct, non-empty connection names.`,
      )
    }

    if (
      typeof lengthTolerance !== "number" ||
      !Number.isFinite(lengthTolerance) ||
      lengthTolerance < 0
    ) {
      throw new Error(
        `Invalid differential pair at index ${pairIndex}: lengthTolerance must be a finite, non-negative millimeter value.`,
      )
    }

    for (const connectionName of connectionNames) {
      const connectionCount = connectionCountsByName.get(connectionName) ?? 0
      if (connectionCount === 0) {
        throw new Error(
          `Differential pair at index ${pairIndex} references unknown connection "${connectionName}".`,
        )
      }
      if (connectionCount > 1) {
        throw new Error(
          `Differential pair at index ${pairIndex} references ambiguous connection "${connectionName}", which appears ${connectionCount} times.`,
        )
      }
    }
  }

  const embeddedDifferentialPairs = simpleRouteJson.differentialPairs
  if (
    embeddedDifferentialPairs &&
    !embeddedDifferentialPairsMatchExplicitPairs(
      embeddedDifferentialPairs,
      differentialPairs,
    )
  ) {
    throw new Error(
      "simpleRouteJson.differentialPairs conflicts with the explicit differentialPairs constructor argument. Pass the same constraints in both locations or omit the deprecated embedded field.",
    )
  }
}

export class DifferentialPairSolver {
  private readonly inputSimpleRouteJson: SimpleRouteJson
  private readonly inputDifferentialPairs: readonly SimpleRouteDifferentialPair[]
  private outputSimpleRouteJson: SimpleRouteJson | null = null

  constructor(
    simpleRouteJson: SimpleRouteJson,
    differentialPairs: readonly SimpleRouteDifferentialPair[],
  ) {
    validateSimpleRouteJson(simpleRouteJson)
    validateDifferentialPairs(simpleRouteJson, differentialPairs)

    this.inputSimpleRouteJson = cloneSimpleRouteJson(simpleRouteJson)
    this.inputDifferentialPairs = cloneDifferentialPairs(differentialPairs)
  }

  getConstructorParams(): readonly [
    SimpleRouteJson,
    readonly SimpleRouteDifferentialPair[],
  ] {
    return [
      cloneSimpleRouteJson(this.inputSimpleRouteJson),
      cloneDifferentialPairs(this.inputDifferentialPairs),
    ]
  }

  solve(): void {
    // TODO: Coordinate all differential pairs and generate matched routes.
    this.outputSimpleRouteJson = cloneSimpleRouteJson(this.inputSimpleRouteJson)
  }

  getOutput(): SimpleRouteJson {
    if (!this.outputSimpleRouteJson) {
      throw new Error(
        "DifferentialPairSolver.getOutput() cannot be called before solve().",
      )
    }

    // Return an independent complete SRJ at the package boundary.
    return cloneSimpleRouteJson(this.outputSimpleRouteJson)
  }
}
