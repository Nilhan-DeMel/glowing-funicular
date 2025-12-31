import React, { useMemo, useState } from "react";

import "./CalculatorPanel.css";

type KeyDescriptor = {
  label: string;
  value: string;
  ariaLabel?: string;
  variant?: "default" | "accent" | "utility";
};

type CalculatorPanelProps = {
  displayValue: string;
  onKeyPress?: (value: string) => void;
  onClear?: () => void;
  onDelete?: () => void;
  onEquals?: () => void;
  onToggleSign?: () => void;
  history?: string[];
  modes?: string[];
  activeMode?: string;
  onModeChange?: (mode: string) => void;
  keypad?: KeyDescriptor[];
};

const defaultKeypad: KeyDescriptor[] = [
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "÷", value: "/", variant: "accent", ariaLabel: "divide" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "×", value: "*", variant: "accent", ariaLabel: "multiply" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "−", value: "-", variant: "accent", ariaLabel: "subtract" },
  { label: "0", value: "0" },
  { label: ".", value: ".", ariaLabel: "decimal" },
  { label: "±", value: "toggle-sign", ariaLabel: "toggle sign", variant: "utility" },
  { label: "+", value: "+", variant: "accent", ariaLabel: "add" },
];

export function CalculatorPanel({
  displayValue,
  onKeyPress,
  onClear,
  onDelete,
  onEquals,
  onToggleSign,
  history = [],
  modes = ["Standard", "Scientific"],
  activeMode,
  onModeChange,
  keypad,
}: CalculatorPanelProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const keys = useMemo(() => keypad ?? defaultKeypad, [keypad]);
  const active = activeMode ?? modes[0];

  const handleKey = (key: KeyDescriptor) => {
    if (key.value === "toggle-sign") {
      onToggleSign?.();
      return;
    }

    onKeyPress?.(key.value);
  };

  return (
    <div className="calculator-shell">
      <div className="calculator-layout">
        <section className="panel">
          <div className="panel__header">
            <div className="panel__modes" aria-label="Calculator modes">
              {modes.map((mode) => (
                <button
                  key={mode}
                  className={`pill pill--interactive ${mode === active ? "pill--active" : ""}`}
                  onClick={() => onModeChange?.(mode)}
                  aria-pressed={mode === active}
                  type="button"
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              className="history-toggle pill pill--interactive"
              type="button"
              onClick={() => setIsHistoryOpen((open) => !open)}
            >
              {isHistoryOpen ? "Hide history" : "Show history"}
            </button>
          </div>

          <div className="display" aria-live="polite">
            <div className="display__label">Display</div>
            <div className="display__value">{displayValue}</div>
          </div>

          <div className="keypad" role="grid" aria-label="Calculator keypad">
            {keys.map((key) => (
              <button
                key={key.value + key.label}
                className={`keypad__key keypad__key--${key.variant ?? "default"}`}
                onClick={() => handleKey(key)}
                aria-label={key.ariaLabel ?? key.label}
                type="button"
              >
                {key.label}
              </button>
            ))}
          </div>

          <div className="action-bar">
            <button className="pill pill--interactive" type="button" onClick={() => onClear?.()}>
              Clear
            </button>
            <button className="pill pill--interactive" type="button" onClick={() => onDelete?.()}>
              Delete
            </button>
            <button
              className="pill pill--interactive pill--primary"
              type="button"
              onClick={() => onEquals?.()}
            >
              Equals
            </button>
          </div>
        </section>

        <aside
          className={`history ${isHistoryOpen ? "history--open" : ""}`}
          aria-label="Calculation history"
        >
          <div className="history__header">History</div>
          <div className="history__body">
            {history.length === 0 ? (
              <p className="history__empty">No calculations yet.</p>
            ) : (
              <ol className="history__list">
                {history.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="history__item">
                    {entry}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CalculatorPanel;
