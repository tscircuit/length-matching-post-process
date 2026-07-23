import type { DifferentialPairConstraints, SimpleRouteJson } from "../../lib"

export const differentialPairs: readonly DifferentialPairConstraints[] = [
  {
    connectionNames: ["positive_trace", "negative_trace"],
    lengthTolerance: 0.1,
  },
]

export const createSimpleRouteJson = () => {
  const pcbTraceType = "pcb_trace"
  const wireRouteType = "wire"
  const connections = [
    {
      name: "positive_trace",
      source_trace_id: "source_trace_positive",
      nominalTraceWidth: 0.2,
      pointsToConnect: [
        { x: 0, y: 1, layer: "top" },
        { x: 10, y: 1, layer: "top" },
      ],
    },
    {
      name: "negative_trace",
      source_trace_id: "source_trace_negative",
      nominalTraceWidth: 0.2,
      pointsToConnect: [
        { x: 0, y: -1, layer: "top" },
        { x: 10, y: -1, layer: "top" },
      ],
    },
    {
      name: "unrelated_trace",
      source_trace_id: "source_trace_unrelated",
      nominalTraceWidth: 0.15,
      pointsToConnect: [
        { x: 0, y: 4, layer: "top" },
        { x: 10, y: 4, layer: "top" },
      ],
    },
  ]

  const simpleRouteJson = {
    layerCount: 2,
    minTraceWidth: 0.15,
    obstacles: [],
    connections,
    bounds: { minX: -1, maxX: 11, minY: -2, maxY: 5 },
    traces: [
      {
        type: pcbTraceType,
        pcb_trace_id: "pcb_trace_positive",
        connection_name: "positive_trace",
        route: [
          { route_type: wireRouteType, x: 0, y: 1, width: 0.2, layer: "top" },
          { route_type: wireRouteType, x: 10, y: 1, width: 0.2, layer: "top" },
        ],
      },
      {
        type: pcbTraceType,
        pcb_trace_id: "pcb_trace_negative",
        connection_name: "negative_trace",
        route: [
          { route_type: wireRouteType, x: 0, y: -1, width: 0.2, layer: "top" },
          { route_type: wireRouteType, x: 10, y: -1, width: 0.2, layer: "top" },
        ],
      },
      {
        type: pcbTraceType,
        pcb_trace_id: "pcb_trace_unrelated",
        connection_name: "unrelated_trace",
        route: [
          { route_type: wireRouteType, x: 0, y: 4, width: 0.15, layer: "top" },
          { route_type: wireRouteType, x: 10, y: 4, width: 0.15, layer: "top" },
        ],
      },
    ],
  }

  // Check canonical compatibility without widening the fixture's inferred type.
  simpleRouteJson satisfies SimpleRouteJson
  return simpleRouteJson
}
