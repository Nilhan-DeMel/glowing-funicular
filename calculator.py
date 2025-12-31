"""Simple command-line calculator."""
from __future__ import annotations

import argparse
import operator
from typing import Callable, Iterable, List


Operation = Callable[[float, float], float]


class CalculatorError(Exception):
    """Custom exception for calculator errors."""


def _build_operations() -> dict[str, Operation]:
    return {
        "add": operator.add,
        "sub": operator.sub,
        "mul": operator.mul,
        "div": _safe_divide,
        "pow": operator.pow,
    }


def _safe_divide(left: float, right: float) -> float:
    if right == 0:
        raise CalculatorError("Division by zero is not allowed.")
    return left / right


def evaluate(operation: str, operands: Iterable[float]) -> float:
    """Evaluate the operation across the provided operands.

    Args:
        operation: One of the supported operations (add, sub, mul, div, pow).
        operands: Iterable of numeric operands. At least two operands are required.

    Returns:
        The result of folding the operation from left to right across the operands.

    Raises:
        CalculatorError: If the operation is not supported or insufficient operands are provided.
    """

    ops = _build_operations()
    if operation not in ops:
        raise CalculatorError(f"Unsupported operation: {operation}")

    operand_list: List[float] = list(operands)
    if len(operand_list) < 2:
        raise CalculatorError("At least two operands are required.")

    result = operand_list[0]
    for value in operand_list[1:]:
        result = ops[operation](result, value)
    return result


def parse_arguments(args: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a simple calculator.")
    parser.add_argument(
        "operation",
        choices=sorted(_build_operations().keys()),
        help="Operation to apply.",
    )
    parser.add_argument(
        "operands",
        metavar="N",
        type=float,
        nargs="+",
        help="Operands to use (at least two).",
    )
    return parser.parse_args(args)


def main(argv: list[str] | None = None) -> None:
    args = parse_arguments(argv)
    try:
        result = evaluate(args.operation, args.operands)
    except CalculatorError as exc:
        raise SystemExit(str(exc)) from exc
    print(result)


if __name__ == "__main__":
    main()
