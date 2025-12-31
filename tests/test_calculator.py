import unittest

import calculator


class EvaluateTests(unittest.TestCase):
    def test_add(self):
        self.assertEqual(calculator.evaluate("add", [1, 2, 3]), 6)

    def test_subtract(self):
        self.assertEqual(calculator.evaluate("sub", [10, 5, 2]), 3)

    def test_multiply(self):
        self.assertEqual(calculator.evaluate("mul", [2, 3, 4]), 24)

    def test_divide(self):
        self.assertAlmostEqual(calculator.evaluate("div", [100, 4, 2]), 12.5)

    def test_power(self):
        self.assertEqual(calculator.evaluate("pow", [2, 3]), 8)

    def test_invalid_operation(self):
        with self.assertRaises(calculator.CalculatorError):
            calculator.evaluate("unknown", [1, 2])

    def test_insufficient_operands(self):
        with self.assertRaises(calculator.CalculatorError):
            calculator.evaluate("add", [1])

    def test_division_by_zero(self):
        with self.assertRaises(calculator.CalculatorError):
            calculator.evaluate("div", [1, 0])


if __name__ == "__main__":
    unittest.main()
