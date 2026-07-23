import type {
  DifferentialPairConstraints,
  SimpleRouteJson,
} from "./simple-route-json"

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
  differentialPairs: readonly DifferentialPairConstraints[],
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

  const embeddedDifferentialPairs = simpleRouteJson.differentialPairs as
    | DifferentialPairConstraints[]
    | undefined
  if (embeddedDifferentialPairs) {
    const embeddedPairKeys = embeddedDifferentialPairs
      .map(({ connectionNames, lengthTolerance }) =>
        JSON.stringify({ connectionNames, lengthTolerance }),
      )
      .sort()
    const explicitPairKeys = differentialPairs
      .map(({ connectionNames, lengthTolerance }) =>
        JSON.stringify({ connectionNames, lengthTolerance }),
      )
      .sort()
    if (
      embeddedPairKeys.length !== explicitPairKeys.length ||
      embeddedPairKeys.some(
        (embeddedPairKey, pairIndex) =>
          embeddedPairKey !== explicitPairKeys[pairIndex],
      )
    ) {
      throw new Error(
        "simpleRouteJson.differentialPairs conflicts with the explicit differentialPairs constructor argument. Pass the same constraints in both locations or omit the deprecated embedded field.",
      )
    }
  }
}

/** Validates and post-processes routed differential-pair connections. */
export class DifferentialPairSolver {
  private readonly inputSimpleRouteJson: SimpleRouteJson
  private readonly inputDifferentialPairs: readonly DifferentialPairConstraints[]
  private outputSimpleRouteJson: SimpleRouteJson | null = null

  /** Validates and snapshots the complete routed SRJ and pair constraints. */
  constructor(
    simpleRouteJson: SimpleRouteJson,
    differentialPairs: readonly DifferentialPairConstraints[],
  ) {
    validateSimpleRouteJson(simpleRouteJson)
    validateDifferentialPairs(simpleRouteJson, differentialPairs)

    this.inputSimpleRouteJson = structuredClone(simpleRouteJson)
    this.inputDifferentialPairs = structuredClone(differentialPairs)
  }

  /** Returns independent snapshots of the solver's constructor inputs. */
  getConstructorParams(): readonly [
    SimpleRouteJson,
    readonly DifferentialPairConstraints[],
  ] {
    return [
      structuredClone(this.inputSimpleRouteJson),
      structuredClone(this.inputDifferentialPairs),
    ]
  }

  /** Produces a complete routed SRJ without changing route geometry yet. */
  solve(): void {
    // TODO: Coordinate all differential pairs and generate matched routes.
    this.outputSimpleRouteJson = structuredClone(this.inputSimpleRouteJson)
  }

  /** Returns an independent complete SRJ after the solver has run. */
  getOutput(): SimpleRouteJson {
    if (!this.outputSimpleRouteJson) {
      throw new Error(
        "DifferentialPairSolver.getOutput() cannot be called before solve().",
      )
    }

    // Return an independent complete SRJ at the package boundary.
    return structuredClone(this.outputSimpleRouteJson)
  }
}
