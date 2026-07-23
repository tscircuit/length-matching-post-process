import type {
  DifferentialPairConstraints,
  SimpleRouteJson,
} from "./simple-route-json"

const parseDifferentialPairConstraints = (
  differentialPairsData: unknown,
): DifferentialPairConstraints[] => {
  if (!Array.isArray(differentialPairsData)) {
    throw new Error("Differential pair constraints must be an array.")
  }

  const differentialPairEntries: readonly unknown[] = differentialPairsData
  return differentialPairEntries.map((differentialPairData, pairIndex) => {
    if (
      typeof differentialPairData !== "object" ||
      differentialPairData === null
    ) {
      throw new Error(
        `Invalid differential pair at index ${pairIndex}: expected an object.`,
      )
    }

    const connectionNamesData =
      "connectionNames" in differentialPairData
        ? differentialPairData.connectionNames
        : undefined
    const connectionNames: readonly unknown[] = Array.isArray(
      connectionNamesData,
    )
      ? connectionNamesData
      : []
    const firstConnectionName = connectionNames[0]
    const secondConnectionName = connectionNames[1]
    if (
      connectionNames.length !== 2 ||
      typeof firstConnectionName !== "string" ||
      firstConnectionName.length === 0 ||
      typeof secondConnectionName !== "string" ||
      secondConnectionName.length === 0 ||
      firstConnectionName === secondConnectionName
    ) {
      throw new Error(
        `Invalid differential pair at index ${pairIndex}: connectionNames must contain two distinct, non-empty connection names.`,
      )
    }

    const lengthTolerance =
      "lengthTolerance" in differentialPairData
        ? differentialPairData.lengthTolerance
        : undefined
    if (
      typeof lengthTolerance !== "number" ||
      !Number.isFinite(lengthTolerance) ||
      lengthTolerance < 0
    ) {
      throw new Error(
        `Invalid differential pair at index ${pairIndex}: lengthTolerance must be a finite, non-negative millimeter value.`,
      )
    }

    return {
      connectionNames: [firstConnectionName, secondConnectionName],
      lengthTolerance,
    }
  })
}

const validateSimpleRouteJson = (simpleRouteJson: SimpleRouteJson): void => {
  if (typeof simpleRouteJson !== "object" || simpleRouteJson === null) {
    throw new Error(
      "DifferentialPairSolver requires a complete routed SimpleRouteJson object.",
    )
  }

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
  const connectionEntries: readonly unknown[] = simpleRouteJson.connections
  for (const [connectionIndex, connectionData] of connectionEntries.entries()) {
    if (
      typeof connectionData !== "object" ||
      connectionData === null ||
      !("name" in connectionData) ||
      typeof connectionData.name !== "string" ||
      connectionData.name.length === 0
    ) {
      throw new Error(
        `Invalid SimpleRouteJson connection at index ${connectionIndex}: name must be a non-empty string.`,
      )
    }

    connectionCountsByName.set(
      connectionData.name,
      (connectionCountsByName.get(connectionData.name) ?? 0) + 1,
    )
  }

  for (const [pairIndex, differentialPair] of differentialPairs.entries()) {
    for (const connectionName of differentialPair.connectionNames) {
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

  const embeddedDifferentialPairsData: unknown =
    simpleRouteJson.differentialPairs
  if (embeddedDifferentialPairsData !== undefined) {
    const embeddedDifferentialPairs = parseDifferentialPairConstraints(
      embeddedDifferentialPairsData,
    )
    const embeddedPairKeys = embeddedDifferentialPairs
      .map(({ connectionNames, lengthTolerance }) =>
        JSON.stringify({
          connectionNames: connectionNames.toSorted(),
          lengthTolerance,
        }),
      )
      .sort()
    const explicitPairKeys = differentialPairs
      .map(({ connectionNames, lengthTolerance }) =>
        JSON.stringify({
          connectionNames: connectionNames.toSorted(),
          lengthTolerance,
        }),
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
    const parsedDifferentialPairs =
      parseDifferentialPairConstraints(differentialPairs)
    validateDifferentialPairs(simpleRouteJson, parsedDifferentialPairs)

    this.inputSimpleRouteJson = structuredClone(simpleRouteJson)
    this.inputDifferentialPairs = parsedDifferentialPairs
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
