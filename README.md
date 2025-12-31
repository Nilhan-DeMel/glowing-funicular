# Calculator

A simple command-line calculator supporting addition, subtraction, multiplication, division, and exponentiation.

## Installation

Requires Python 3.11+.

## Usage

Run operations by invoking the module and passing an operation followed by numbers:

```bash
python calculator.py add 1 2 3
# 6

python calculator.py div 100 4 2
# 12.5

python calculator.py pow 2 3
# 8
```

If you provide an unsupported operation, too few operands, or attempt division by zero, the program prints an error message and exits.

## Web calculator

An accessible, keyboard-friendly calculator UI is available via `index.html`. Open the file in a browser to:

- Enter expressions with buttons, keyboard shortcuts (digits 0–9, operators, Enter, Backspace), and quick trigonometry keys (S, C, T for sin/cos/tan, P for π).
- Toggle settings in the drawer (Ctrl/Cmd + S) for precision, number separators, angle units, and light/dark/system themes.
- Respect reduced-motion preferences by disabling background particles and ripple effects automatically.

## Testing

Run the unit tests with:

```bash
python -m unittest discover
```
