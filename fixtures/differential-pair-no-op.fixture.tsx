import { DifferentialPairSolver } from "../lib"
import { createSimpleRouteJson, differentialPairs } from "../tests/fixtures"

const inputSimpleRouteJson = createSimpleRouteJson()
const solver = new DifferentialPairSolver(
  inputSimpleRouteJson,
  differentialPairs,
)
solver.solve()
const outputSimpleRouteJson = solver.getOutput()

const RoutedPair = ({
  simpleRouteJson,
  xOffset,
  title,
}: {
  simpleRouteJson: ReturnType<typeof createSimpleRouteJson>
  xOffset: number
  title: string
}) => (
  <g transform={`translate(${xOffset} 0)`}>
    <text x="100" y="24" textAnchor="middle" fontSize="16" fontWeight="bold">
      {title}
    </text>
    <rect
      x="20"
      y="45"
      width="160"
      height="90"
      rx="8"
      fill="#f8fafc"
      stroke="#94a3b8"
    />
    {simpleRouteJson.traces.slice(0, 2).map((trace, traceIndex) => {
      const wirePoints = trace.route
      return (
        <g key={trace.pcb_trace_id}>
          <polyline
            points={wirePoints
              .map(({ x, y }) => `${35 + x * 13},${90 - y * 20}`)
              .join(" ")}
            fill="none"
            stroke={traceIndex === 0 ? "#dc2626" : "#2563eb"}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="100"
            y={traceIndex === 0 ? 62 : 127}
            textAnchor="middle"
            fontSize="12"
            fill={traceIndex === 0 ? "#991b1b" : "#1e40af"}
          >
            {trace.connection_name}
          </text>
        </g>
      )
    })}
  </g>
)

const DifferentialPairNoOpFixture = () => (
  <main
    style={{
      width: 480,
      padding: 24,
      color: "#0f172a",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>
      Differential-pair post-processing
    </h1>
    <p style={{ margin: "0 0 12px" }}>
      positive_trace + negative_trace · maximum skew 0.1 mm
    </p>
    <svg
      viewBox="0 0 440 160"
      role="img"
      aria-label="Identical routed input and no-op solver output"
    >
      <RoutedPair
        simpleRouteJson={inputSimpleRouteJson}
        xOffset={0}
        title="Routed input"
      />
      <RoutedPair
        simpleRouteJson={outputSimpleRouteJson}
        xOffset={220}
        title="No-op output"
      />
    </svg>
    <p style={{ margin: "8px 0 0", fontWeight: 600 }}>
      Expected: complete SRJ preserved; no route coordinates changed.
    </p>
  </main>
)

export default <DifferentialPairNoOpFixture />
