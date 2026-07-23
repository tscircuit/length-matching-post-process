# React Cosmos Infrastructure Guide

## Commands

- Start Cosmos: `bun run start`
- Build Vite: `bun run build`
- Export Cosmos: `bun run cosmos:export`

Do not format or lint unless explicitly requested.

## Code Style

- Use `@tscircuit/length-matching-post-process` as this package's name.
- Import canonical domain types directly from their owning package instead of
  recreating them with `Omit`, aliases, or duplicate interfaces.
- Name the public differential-pair input type
  `DifferentialPairConstraints`; do not prefix it with a transport format name.
- Inline helpers shorter than 10 lines when the helper does not clarify a
  distinct domain operation.
- Add concise one- or two-line JSDoc comments to every public class and method.
- Throwing an error is allowed for invalid states and failure cases.
