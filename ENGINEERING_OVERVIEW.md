# Engineering Overview

## Architecture

| Surface | Responsibility |
| --- | --- |
| `calculator.py` | Deterministic operation registry, validation, fold semantics, CLI parsing |
| `tests/test_calculator.py` | Eight unit tests for operations and failure modes |
| `index.html`, `app.js`, `styles.css` | Stateful local browser calculator and persisted history |
| `web/` | Animated visual experiment with parallax and transitions |
| `components/CalculatorPanel.tsx` | Reusable typed presentation/state-control boundary |

## Interesting decisions

- The Python evaluator accepts an iterable and folds operations left-to-right, making multi-operand semantics explicit.
- Division safety lives in the domain operation, so CLI presentation does not own correctness.
- The browser surface validates locally and persists only non-sensitive calculation history.
- The React component uses callbacks for behavior, keeping presentation decoupled from a particular calculation engine.
- Accessible labels, live result output, and keyboard affordances are present in the UI work.

## Honest boundary

The repository contains multiple explorations rather than one unified build system. Only the Python domain core has automated unit coverage. A production version would consolidate the browser variants, add parser/property tests, and package the React component with a documented public API.
