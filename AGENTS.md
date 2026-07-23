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

## Test Organization

- Put every executable test at
  `tests/features/<kebab-case-feature>/{success,failure}/<descriptive-name>.test.ts`.
  Do not create root-level, `misc`, or `random` test catchalls.
- `success` tests exercise supported behavior. `failure` tests verify an
  expected rejection or error for invalid input or state; they are not broken
  tests.
- Each test file must contain exactly one `test()` or `it()` call. Name files
  after the observable scenario rather than numeric ordering.
- Put shared fixtures and helpers under `tests/fixtures/` or `tests/utils/`
  without a `.test.*` suffix.
- Place regressions and reproductions under the feature whose public contract
  they exercise. Split tests that cover independent feature contracts.
- Keep `FEATURES.md` synchronized with implemented behavior. Every listed
  feature must link to one or two representative tests.
- New features should normally have meaningful success and failure coverage. If
  no failure mode exists, document that in `FEATURES.md` instead of inventing a
  meaningless test.

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
- Avoid `as` and non-null assertions when contextual typing, `satisfies`,
  control-flow narrowing, or explicit domain annotations can establish the
  type.
- Parse optional or untrusted boundary data once into validated, non-optional
  domain values before using it. Reconstruct typed values instead of allowing
  `Array.isArray` to leak `any[]`.
- Treat exported TypeScript APIs as runtime boundaries because JavaScript
  callers can bypass static types; throw actionable errors for invalid shapes.
