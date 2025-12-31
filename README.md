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

## Testing

Run the unit tests with:

```bash
python -m unittest discover
```
