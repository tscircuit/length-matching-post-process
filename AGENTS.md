# React Cosmos Infrastructure Guide

## Commands

- Start Cosmos: `bun run start`
- Build the package: `bun run build`
- Build the Vite playground: `bun run build:playground`
- Typecheck: `bun run typecheck`
- Test: `bun test`
- Export Cosmos: `bun run cosmos:export`

Do not format or lint unless explicitly requested.

## Review Workflow

- After implementing and verifying a pull-request review comment, resolve its
  GitHub review thread. Do not resolve comments that remain partially
  addressed, ambiguous, or unverified.

## Code Style

- Use `@tscircuit/length-matching-post-process` as this package's name.
- Import canonical domain types directly from their owning package instead of
  recreating them with `Omit`, aliases, or duplicate interfaces.
- Name the public differential-pair input type
  `DifferentialPairConstraints`; do not prefix it with a transport format name.
- Inline helpers shorter than 10 lines when the helper does not clarify a
  distinct domain operation.
- Add concise one- or two-line JSDoc comments to exported types and properties
  and to every public class and method.
- Throwing an error is allowed for invalid states and failure cases.
- Each test file must contain exactly one `test()` or `it()` call. Split
  additional cases into separate, descriptively named test files.
- Avoid `as` and non-null assertions when contextual typing, `satisfies`,
  control-flow narrowing, or explicit domain annotations can establish the
  type.
- Parse optional or untrusted boundary data once into validated, non-optional
  domain values before using it. Reconstruct typed values instead of allowing
  `Array.isArray` to leak `any[]`.
- Treat exported TypeScript APIs as runtime boundaries because JavaScript
  callers can bypass static types; throw actionable errors for invalid shapes.
