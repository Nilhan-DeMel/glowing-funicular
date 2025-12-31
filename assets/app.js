const expressionLabel = document.getElementById("expressionLabel");
const resultLabel = document.getElementById("resultLabel");
const keypadButtons = document.querySelectorAll("[data-input], [data-action]");
const openSettingsButton = document.getElementById("openSettings");
const closeSettingsButton = document.getElementById("closeSettings");
const settingsDrawer = document.getElementById("settingsDrawer");
const scrim = document.getElementById("scrim");

const precisionSelect = document.getElementById("precisionSelect");
const separatorSelect = document.getElementById("separatorSelect");
const angleInputs = document.querySelectorAll('input[name="angle"]');
const themeSelect = document.getElementById("themeSelect");

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  expression: "",
  result: "Result",
  numericResult: null,
  settings: {
    precision: Number(precisionSelect.value),
    separator: separatorSelect.value,
    angleUnit: document.querySelector('input[name="angle"]:checked').value,
    theme: themeSelect.value,
  },
};

function updateMotionPreference() {
  document.body.classList.toggle("reduce-motion", motionQuery.matches);
}

function applyTheme(theme) {
  const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

function formatNumber(value) {
  if (!isFinite(value)) return "Error";
  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: state.settings.precision,
    useGrouping: state.settings.separator !== "none",
  });
  let output = formatter.format(Number(value.toFixed(state.settings.precision)));
  if (state.settings.separator === "space") {
    output = output.replace(/,/g, " ");
  }
  return output;
}

function sanitizeExpression(raw) {
  return raw
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**")
    .replace(/π/g, "pi");
}

function evaluateExpression() {
  if (!state.expression.trim()) return;
  try {
    const sanitized = sanitizeExpression(state.expression);
    const evaluator = new Function(
      "sin",
      "cos",
      "tan",
      "sqrt",
      "log",
      "pi",
      `return (${sanitized});`
    );
    const toRadians = (value) => (state.settings.angleUnit === "deg" ? (value * Math.PI) / 180 : value);
    const trig = (fn) => (value) => fn(toRadians(value));
    const result = evaluator(trig(Math.sin), trig(Math.cos), trig(Math.tan), Math.sqrt, Math.log10, Math.PI);
    state.numericResult = result;
    state.result = formatNumber(result);
  } catch (error) {
    state.result = "Error";
    state.numericResult = null;
  }
  updateDisplay();
}

function updateDisplay() {
  expressionLabel.textContent = state.expression || "0";
  resultLabel.textContent = state.result;
}

function handleInput(value) {
  state.expression += value;
  state.numericResult = null;
  updateDisplay();
}

function handleAction(action) {
  if (action === "clear") {
    state.expression = "";
    state.result = "Result";
    state.numericResult = null;
    updateDisplay();
    return;
  }

  if (action === "delete") {
    state.expression = state.expression.slice(0, -1);
    state.numericResult = null;
    updateDisplay();
    return;
  }

  if (action === "equals") {
    evaluateExpression();
  }
}

keypadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { input, action } = button.dataset;
    if (input) {
      handleInput(input);
    } else if (action) {
      handleAction(action);
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const isDrawerOpen = settingsDrawer.classList.contains("drawer--open");

  if ((event.ctrlKey || event.metaKey) && key.toLowerCase() === "s") {
    event.preventDefault();
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
    return;
  }

  if (isDrawerOpen && key === "Escape") {
    event.preventDefault();
    closeDrawer();
    return;
  }

  const numeric = /[0-9]/;
  if (numeric.test(key)) {
    handleInput(key);
    return;
  }

  const operatorMap = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
    ".": ".",
    "(": "(",
    ")": ")",
  };

  if (key in operatorMap) {
    handleInput(operatorMap[key]);
    return;
  }

  const functionMap = {
    s: "sin(",
    c: "cos(",
    t: "tan(",
    p: "π",
  };

  const lowerKey = key.toLowerCase();
  if (lowerKey in functionMap) {
    handleInput(functionMap[lowerKey]);
    return;
  }

  if (key === "Enter" || key === "=") {
    evaluateExpression();
    return;
  }

  if (key === "Backspace") {
    handleAction("delete");
    return;
  }

  if (key === "Escape") {
    handleAction("clear");
  }
});

function openDrawer() {
  settingsDrawer.hidden = false;
  settingsDrawer.classList.add("drawer--open");
  scrim.hidden = false;
  openSettingsButton.setAttribute("aria-expanded", "true");
}

function closeDrawer() {
  settingsDrawer.classList.remove("drawer--open");
  scrim.hidden = true;
  openSettingsButton.setAttribute("aria-expanded", "false");
  settingsDrawer.hidden = true;
}

openSettingsButton.addEventListener("click", openDrawer);
closeSettingsButton.addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);

precisionSelect.addEventListener("change", (event) => {
  state.settings.precision = Number(event.target.value);
  if (typeof state.numericResult === "number" && isFinite(state.numericResult)) {
    state.result = formatNumber(state.numericResult);
    updateDisplay();
  }
});

separatorSelect.addEventListener("change", (event) => {
  state.settings.separator = event.target.value;
  if (typeof state.numericResult === "number" && isFinite(state.numericResult)) {
    state.result = formatNumber(state.numericResult);
    updateDisplay();
  }
});

angleInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    state.settings.angleUnit = event.target.value;
  });
});

themeSelect.addEventListener("change", (event) => {
  state.settings.theme = event.target.value;
  applyTheme(state.settings.theme);
});

updateDisplay();
applyTheme(state.settings.theme);
updateMotionPreference();
motionQuery.addEventListener("change", updateMotionPreference);
