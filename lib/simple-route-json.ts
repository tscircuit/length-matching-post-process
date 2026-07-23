export type {
  SimpleRouteJson,
  SimplifiedPcbTrace,
} from "@tscircuit/capacity-autorouter"

/** Constraints for matching the routed lengths of two SRJ connections. */
export type DifferentialPairConstraints = {
  connectionNames: [string, string]
  /** Maximum routed centerline-length skew in millimeters. */
  lengthTolerance: number
}
