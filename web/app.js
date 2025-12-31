const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const operations = {
  add: {
    label: "Add",
    run: (values) => values.reduce((acc, curr) => acc + curr, 0),
  },
  sub: {
    label: "Subtract",
    run: (values) => values.slice(1).reduce((acc, curr) => acc - curr, values[0] ?? 0),
  },
  mul: {
    label: "Multiply",
    run: (values) => values.reduce((acc, curr) => acc * curr, 1),
  },
  div: {
    label: "Divide",
    run: (values) => values.slice(1).reduce((acc, curr) => acc / curr, values[0] ?? 0),
  },
  pow: {
    label: "Power",
    run: (values) => {
      if (values.length === 0) return 0;
      return values.slice(1).reduce((acc, curr) => acc ** curr, values[0]);
    },
  },
};

function parseValues(raw) {
  return raw
    .split(/[,\s]+/)
    .map((val) => val.trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function animateResult(element) {
  element.classList.remove("animate");
  void element.offsetWidth; // force reflow for restart
  element.classList.add("animate");
}

function animateModeWipe(wipeEl) {
  wipeEl.classList.remove("is-active");
  void wipeEl.offsetWidth;
  wipeEl.classList.add("is-active");
}

function formatResult(result) {
  if (!Number.isFinite(result)) return "Result is not finite";
  if (Math.abs(result) >= 1_000_000 || Math.abs(result) <= 0.0001) {
    return result.toExponential(6);
  }
  return Number(result.toFixed(6)).toString();
}

function setupCalculator() {
  const form = document.getElementById("calculator-form");
  const input = document.getElementById("operands");
  const resultEl = document.getElementById("result-value");
  const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
  const wipe = document.getElementById("mode-wipe");

  let currentMode = "add";

  function setMode(mode) {
    currentMode = mode;
    modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === mode);
    });
    animateModeWipe(wipe);
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = parseValues(input.value);

    if (values.length < 2) {
      resultEl.textContent = "Please enter at least two numbers";
      resultEl.classList.toggle("error", true);
      animateResult(resultEl);
      return;
    }

    const op = operations[currentMode];
    const result = op.run(values);
    resultEl.textContent = `${op.label}: ${formatResult(result)}`;
    resultEl.classList.toggle("error", false);
    animateResult(resultEl);
  });
}

function setupParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = 120;
  let width = 0;
  let height = 0;
  let parallax = { x: 0, y: 0 };
  let parallaxTarget = { x: 0, y: 0 };

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const seedParticles = () => {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        depth: Math.random(),
      });
    }
  };

  const step = () => {
    parallax.x += (parallaxTarget.x - parallax.x) * 0.08;
    parallax.y += (parallaxTarget.y - parallax.y) * 0.08;
    canvas.style.transform = `translate3d(${parallax.x}px, ${parallax.y}px, 0)`;

    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
      if (p.y > height) p.y = 0;
      if (p.y < 0) p.y = height;

      const alpha = 0.25 + p.depth * 0.5;
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
      const offsetX = parallax.x * p.depth * 0.4;
      const offsetY = parallax.y * p.depth * 0.4;
      ctx.beginPath();
      ctx.arc(p.x + offsetX, p.y + offsetY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    window.requestAnimationFrame(step);
  };

  const updateParallax = (event) => {
    const targetX = (event.clientX / window.innerWidth - 0.5) * 16;
    const targetY = (event.clientY / window.innerHeight - 0.5) * 16;
    parallaxTarget.x = clamp(targetX, -16, 16);
    parallaxTarget.y = clamp(targetY, -16, 16);
  };

  window.addEventListener("pointermove", updateParallax, { passive: true });
  window.addEventListener("resize", () => {
    resize();
    seedParticles();
  });

  resize();
  seedParticles();
  window.requestAnimationFrame(step);
}

window.addEventListener("DOMContentLoaded", () => {
  setupCalculator();
  setupParticles();
});
