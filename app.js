const operators = {
  "+": { precedence: 1, associativity: "left", apply: (a, b) => a + b },
  "-": { precedence: 1, associativity: "left", apply: (a, b) => a - b },
  "*": { precedence: 2, associativity: "left", apply: (a, b) => a * b },
  "/": {
    precedence: 2,
    associativity: "left",
    apply: (a, b) => {
      if (b === 0) {
        throw new Error("Division by zero is not allowed.");
      }
      return a / b;
    },
  },
  "^": { precedence: 3, associativity: "right", apply: (a, b) => Math.pow(a, b) },
};

const historyKey = "calculator:history";
let history = loadHistory();

const expressionInput = document.getElementById("expression-input");
const resultDisplay = document.getElementById("result-display");
const historyList = document.getElementById("history-list");
const evaluateButton = document.getElementById("evaluate");
const clearHistoryButton = document.getElementById("clear-history");
const toastContainer = document.getElementById("toast-container");
const tokenKeys = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "+",
  "-",
  "*",
  "/",
  "^",
  "(",
  ")",
]);

function isTextInputLike(element) {
  return (
    element &&
    (element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.isContentEditable ||
      element.getAttribute("role") === "textbox")
  );
}

function showToast(message, variant = "error", duration = 3200) {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.setAttribute("role", variant === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", variant === "error" ? "assertive" : "polite");
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function loadHistory() {
  try {
    const stored = localStorage.getItem(historyKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error("Unable to load history", err);
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 30)));
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function renderHistory() {
  historyList.setAttribute("role", "list");
  historyList.innerHTML = "";
  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "subtitle";
    empty.textContent = "No calculations yet. Your history will appear here.";
    empty.setAttribute("role", "note");
    historyList.appendChild(empty);
    return;
  }

  const sorted = [...history].sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.timestamp - a.timestamp);

  sorted.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.setAttribute("role", "listitem");
    row.setAttribute("aria-label", `${item.expression} equals ${item.result}`);

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "history-expression";
    title.textContent = `${item.expression} = ${item.result}`;
    title.title = "Use this expression";
    title.tabIndex = 0;
    title.addEventListener("click", () => {
      expressionInput.value = item.expression;
      expressionInput.focus();
    });
    title.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        expressionInput.value = item.expression;
        expressionInput.focus();
      }
    });

    const meta = document.createElement("div");
    meta.className = "history-meta";
    const time = document.createElement("span");
    time.textContent = formatTimestamp(item.timestamp);
    meta.appendChild(time);

    if (item.favorite) {
      const badge = document.createElement("span");
      badge.className = "badge favorited";
      badge.textContent = "Favorite";
      meta.appendChild(badge);
    }

    content.appendChild(title);
    content.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "history-actions";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.title = "Copy expression to clipboard";
    copyBtn.setAttribute("aria-label", `Copy ${item.expression} = ${item.result}`);
    copyBtn.addEventListener("click", () => copyExpression(item));

    const favBtn = document.createElement("button");
    favBtn.textContent = item.favorite ? "★" : "☆";
    favBtn.title = "Toggle favorite";
    favBtn.setAttribute("aria-pressed", String(item.favorite));
    favBtn.setAttribute(
      "aria-label",
      item.favorite ? "Remove from favorites" : "Mark as favorite"
    );
    favBtn.addEventListener("click", () => toggleFavorite(item.timestamp));

    actions.appendChild(copyBtn);
    actions.appendChild(favBtn);

    row.appendChild(content);
    row.appendChild(actions);
    historyList.appendChild(row);
  });
}

function copyExpression(item) {
  const text = `${item.expression} = ${item.result}`;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast("Copied to clipboard", "success"))
      .catch(() => showToast("Unable to copy expression", "error"));
  } else {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    document.body.appendChild(fallback);
    fallback.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard", "success");
    } catch (error) {
      showToast("Unable to copy expression", "error");
    }
    document.body.removeChild(fallback);
  }
}

function toggleFavorite(timestamp) {
  history = history.map((entry) =>
    entry.timestamp === timestamp ? { ...entry, favorite: !entry.favorite } : entry
  );
  saveHistory();
  renderHistory();
}

function appendToExpression(token) {
  const current = expressionInput.value;
  const trimmed = current.trimEnd();
  const lastChar = trimmed.slice(-1);
  const isOperator = Boolean(operators[token]);
  const lastIsOperator = Boolean(operators[lastChar]);
  const lastIsOpening = lastChar === "(";

  if (isOperator) {
    if (!trimmed || lastIsOperator || lastIsOpening) {
      return showToast("Place an operator after a number or closing parenthesis.");
    }
  }

  if (token === ")") {
    const { open, close } = countParens(trimmed);
    if (open <= close || lastIsOperator || lastIsOpening || !trimmed) {
      return showToast("Unbalanced parenthesis.");
    }
  }

  if (token === "(") {
    if (trimmed && !lastIsOperator && lastChar !== "(") {
      return showToast("Insert an operator before opening a group.");
    }
  }

  if (token === ".") {
    const lastNumber = trimmed.split(/[^\d.]/).pop();
    if (lastNumber && lastNumber.includes(".")) {
      return showToast("Only one decimal per number.");
    }
    if (!lastNumber) {
      expressionInput.value = `${trimmed}0.`;
      return;
    }
  }

  expressionInput.value = current + token;
  expressionInput.focus();
}

function countParens(expression) {
  let open = 0;
  let close = 0;
  for (const char of expression) {
    if (char === "(") open += 1;
    if (char === ")") close += 1;
  }
  return { open, close };
}

function tokenize(expression) {
  const tokens = [];
  let i = 0;

  const isDigit = (char) => /\d/.test(char);
  const isDecimal = (char) => char === ".";

  while (i < expression.length) {
    const char = expression[i];

    if (char === " " || char === "\t") {
      i += 1;
      continue;
    }

    const prev = tokens[tokens.length - 1];
    const prevIsOperator = prev && prev.type === "operator";
    const prevIsOpening = prev && prev.type === "paren" && prev.value === "(";
    const unaryMinus =
      char === "-" &&
      (tokens.length === 0 || prevIsOperator || prevIsOpening) &&
      (isDigit(expression[i + 1]) || expression[i + 1] === ".");

    if (isDigit(char) || isDecimal(char) || unaryMinus) {
      let numberStr = unaryMinus ? "-" : "";
      if (unaryMinus) {
        i += 1;
      }

      let dotCount = 0;
      while (i < expression.length && (isDigit(expression[i]) || isDecimal(expression[i]))) {
        if (isDecimal(expression[i])) {
          dotCount += 1;
          if (dotCount > 1) {
            throw new Error("Malformed number with multiple decimals.");
          }
        }
        numberStr += expression[i];
        i += 1;
      }
      if (!/^[-]?\\d*\\.?\\d+$/.test(numberStr) || numberStr === "-" || numberStr === "." || numberStr === "-.") {
        throw new Error("Malformed number.");
      }
      tokens.push({ type: "number", value: parseFloat(numberStr) });
      continue;
    }

    if (operators[char]) {
      if (!tokens.length || prevIsOperator || prevIsOpening) {
        throw new Error("Invalid sequence: operator cannot follow another operator.");
      }
      tokens.push({ type: "operator", value: char });
      i += 1;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      i += 1;
      continue;
    }

    throw new Error(`Unsupported character '${char}'.`);
  }

  return tokens;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
      continue;
    }

    if (token.type === "operator") {
      const { precedence, associativity } = operators[token.value];
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type !== "operator") break;
        const topOp = operators[top.value];
        const shouldPop =
          topOp.precedence > precedence ||
          (topOp.precedence === precedence && associativity === "left");
        if (!shouldPop) break;
        output.push(stack.pop());
      }
      stack.push(token);
      continue;
    }

    if (token.type === "paren" && token.value === "(") {
      stack.push(token);
      continue;
    }

    if (token.type === "paren" && token.value === ")") {
      let foundOpening = false;
      while (stack.length) {
        const top = stack.pop();
        if (top.type === "paren" && top.value === "(") {
          foundOpening = true;
          break;
        }
        output.push(top);
      }
      if (!foundOpening) {
        throw new Error("Mismatched parentheses.");
      }
    }
  }

  while (stack.length) {
    const top = stack.pop();
    if (top.type === "paren") {
      throw new Error("Mismatched parentheses.");
    }
    output.push(top);
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (left === undefined || right === undefined) {
      throw new Error("Malformed expression.");
    }

    const operatorDef = operators[token.value];
    const result = operatorDef.apply(left, right);
    stack.push(result);
  }

  if (stack.length !== 1) {
    throw new Error("Malformed expression.");
  }

  return stack[0];
}

function evaluateExpression() {
  const expression = expressionInput.value.trim();
  if (!expression) {
    return showToast("Enter an expression to evaluate.");
  }

  try {
    const tokens = tokenize(expression);
    const { open, close } = countParens(expression);
    if (open !== close) {
      throw new Error("Mismatched parentheses.");
    }
    const lastToken = tokens[tokens.length - 1];
    if (!lastToken || lastToken.type === "operator" || (lastToken.type === "paren" && lastToken.value === "(")) {
      throw new Error("Expression cannot end with an operator or opening parenthesis.");
    }
    const rpn = toRPN(tokens);
    const value = evaluateRPN(rpn);
    resultDisplay.textContent = `Result: ${value}`;
    resultDisplay.setAttribute("aria-live", "polite");
    resultDisplay.classList.add("pill-success");
    const entry = {
      expression,
      result: value,
      timestamp: Date.now(),
      favorite: false,
    };
    history = [entry, ...history].slice(0, 30);
    saveHistory();
    renderHistory();
  } catch (error) {
    showToast(error.message || "Unable to evaluate expression.");
    resultDisplay.textContent = "Error";
    resultDisplay.classList.remove("pill-success");
  }
}

function clearExpression() {
  expressionInput.value = "";
  resultDisplay.textContent = "Ready to calculate";
  resultDisplay.classList.remove("pill-success");
}

function removeLastChar() {
  expressionInput.value = expressionInput.value.slice(0, -1);
}

function bindEvents() {
  document.querySelectorAll("[data-token]").forEach((button) => {
    button.addEventListener("click", () => appendToExpression(button.dataset.token));
  });

  document.getElementById("backspace").addEventListener("click", removeLastChar);
  document.getElementById("clear").addEventListener("click", clearExpression);

  evaluateButton.addEventListener("click", evaluateExpression);
  clearHistoryButton.addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
  });

  expressionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      evaluateExpression();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key;
    const target = event.target;
    const targetIsInput = target === expressionInput || isTextInputLike(target);

    if (tokenKeys.has(key)) {
      if (!targetIsInput) {
        appendToExpression(key);
        event.preventDefault();
      }
      return;
    }

    if (key === "Enter" || key === "=") {
      event.preventDefault();
      evaluateExpression();
      return;
    }

    if (key === "Backspace") {
      if (!targetIsInput) {
        event.preventDefault();
        removeLastChar();
      }
      return;
    }

    if (key === "Escape") {
      event.preventDefault();
      clearExpression();
    }
  });
}

bindEvents();
renderHistory();
