# Multi-Surface Calculator Lab

> A compact engineering exercise spanning a tested Python calculation core, browser interaction design, animation, persistence, accessibility, and a reusable typed React component.

The repository intentionally explores the same small domain through several interfaces. That makes it useful for comparing domain logic, UI state, error handling, and accessibility without the noise of a large backend.

## Included surfaces

- A Python 3.11+ CLI with left-to-right folding across multiple operands.
- Explicit error handling for unsupported operations, insufficient operands, and division by zero.
- A client-only calculator with expression validation and local history/favorites.
- An animated browser variant under `web/` with parallax particles and mode transitions.
- A typed `CalculatorPanel.tsx` component with keyboard/accessibility affordances.
- Eight Python unit tests covering the domain core and error paths.

## Verify

```bash
python -m unittest discover -v
python calculator.py add 1 2 3
python calculator.py pow 2 8
```

Serve either browser surface with Python:

```bash
python -m http.server 8000
python -m http.server 8001 --directory web
```

## Engineering guide

See [ENGINEERING_OVERVIEW.md](ENGINEERING_OVERVIEW.md) for the architecture and current boundaries.

## Status

This is a focused learning/prototyping repository rather than a packaged calculator product. The Python core is tested; the standalone React component is source-level portfolio evidence and is not wired into a complete React application in this repository.
