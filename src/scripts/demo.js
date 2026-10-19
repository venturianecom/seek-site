const demo = document.querySelector("[data-seek-demo]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".manifesto, .section-heading, .feature-card, .keyboard-copy, .keyboard, .privacy, .final-cta, .details-grid, .release-list, .support-list, .prose-body, .footer-shell",
  );

  document.querySelectorAll(".feature-card").forEach((card, index) => {
    card.style.setProperty("--reveal-delay", `${(index % 2) * 75}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-ready");
    revealObserver.observe(target);
  });
}

if (mobileMenu) {
  const summary = mobileMenu.querySelector("summary");

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") mobileMenu.open = false;
  });

  document.addEventListener("pointerdown", (event) => {
    if (mobileMenu.open && !mobileMenu.contains(event.target))
      mobileMenu.open = false;
  });

  mobileMenu.addEventListener("toggle", () => {
    summary.setAttribute(
      "aria-label",
      mobileMenu.open ? "Close navigation" : "Open navigation",
    );
  });
}

document.querySelectorAll("[data-window-demo]").forEach((windowDemo) => {
  const controls = windowDemo.querySelectorAll("[data-window-position]");
  const status = windowDemo.querySelector("[data-window-status]");

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const position = control.dataset.windowPosition;
      windowDemo.dataset.position = position;

      controls.forEach((button) => {
        const isActive = button === control;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      status.textContent =
        position === "maximize"
          ? "Window maximized"
          : `Window moved ${position}`;
    });
  });
});

if (demo) {
  const input = demo.querySelector("#seek-demo-input");
  const results = demo.querySelector("[data-demo-results]");
  const group = demo.querySelector("[data-demo-group]");
  const action = demo.querySelector("[data-demo-action]");
  const status = document.querySelector("[data-demo-status]");
  const statusPill = status.closest(".demo-status");

  function updateStatus(message) {
    if (status.textContent === message) return;
    status.textContent = message;
    statusPill.classList.remove("status-updated");
    requestAnimationFrame(() => statusPill.classList.add("status-updated"));
  }

  statusPill.addEventListener("animationend", (event) => {
    if (event.animationName === "status-update")
      statusPill.classList.remove("status-updated");
  });

  const items = [
    {
      title: "Safari",
      description: "Open the web browser",
      type: "Application",
      icon: "◉",
      iconClass: "safari-icon",
      favorite: true,
      keywords: "browser web internet",
    },
    {
      title: "App Store",
      description: "Discover apps for your Mac",
      type: "Application",
      icon: "A",
      iconClass: "store-icon",
      favorite: true,
      keywords: "applications updates",
    },
    {
      title: "Finder",
      description: "Browse files and folders",
      type: "Application",
      icon: "F",
      iconClass: "finder-icon",
      keywords: "files folders",
    },
    {
      title: "Calendar",
      description: "View your calendar",
      type: "Application",
      icon: "6",
      iconClass: "calendar-icon",
      keywords: "events meetings schedule",
    },
    {
      title: "Notes",
      description: "Open your notes",
      type: "Application",
      icon: "N",
      iconClass: "notes-icon",
      keywords: "write text",
    },
    {
      title: "System Settings",
      description: "Change macOS settings",
      type: "Application",
      icon: "⚙",
      iconClass: "settings-icon",
      keywords: "preferences system",
    },
    {
      title: "Terminal",
      description: "Open a command line",
      type: "Application",
      icon: ">_",
      iconClass: "terminal-icon",
      keywords: "shell developer",
    },
    {
      title: "Celebrate with Confetti",
      description: "Fill the screen with a quick celebration",
      type: "Command",
      icon: "✦",
      iconClass: "purple-icon",
      keywords: "fun party celebrate",
    },
    {
      title: "Let It Snow",
      description: "Snowflakes, snowmen and festive surprises",
      type: "Command",
      icon: "❄",
      iconClass: "purple-icon",
      keywords: "fun winter",
    },
    {
      title: "Maximize Window",
      description: "Fill the available screen",
      type: "Command",
      icon: "□",
      iconClass: "purple-icon",
      keywords: "window resize full",
    },
    {
      title: "Center Window",
      description: "Move the active window to the center",
      type: "Command",
      icon: "◇",
      iconClass: "purple-icon",
      keywords: "window move position",
    },
    {
      title: "Clipboard History",
      description: "Search recent local clipboard text",
      type: "Command",
      icon: "⌘",
      iconClass: "purple-icon",
      keywords: "copy paste history",
    },
    {
      title: "File Search",
      description: "Find files through Spotlight",
      type: "Command",
      icon: "⌕",
      iconClass: "purple-icon",
      keywords: "files documents spotlight",
    },
    {
      title: "Lock Mac",
      description: "Lock this Mac",
      type: "Command",
      icon: "●",
      iconClass: "purple-icon",
      keywords: "system security",
    },
  ];

  let visibleItems = [];
  let selectedIndex = 0;

  function tokenize(expression) {
    const normalized = expression
      .replaceAll("×", "*")
      .replaceAll("÷", "/")
      .replaceAll("−", "-");
    const tokens = [];
    let position = 0;

    while (position < normalized.length) {
      if (/\s/.test(normalized[position])) {
        position += 1;
        continue;
      }

      const number = normalized
        .slice(position)
        .match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (number) {
        tokens.push({ type: "number", value: Number(number[0]) });
        position += number[0].length;
        continue;
      }

      if ("+-*/%()".includes(normalized[position])) {
        tokens.push({
          type: normalized[position],
          value: normalized[position],
        });
        position += 1;
        continue;
      }

      return null;
    }

    return tokens;
  }

  function calculate(expression) {
    if (expression.length > 80 || !/\d\s*[+\-*/%×÷]/.test(expression)) {
      return null;
    }

    const tokens = tokenize(expression);
    if (!tokens?.length) return null;
    let position = 0;

    const parsePrimary = () => {
      const token = tokens[position];
      if (!token) throw new Error("Incomplete expression");
      if (token.type === "number") {
        position += 1;
        return token.value;
      }
      if (token.type === "(") {
        position += 1;
        const value = parseExpression();
        if (tokens[position]?.type !== ")")
          throw new Error("Missing parenthesis");
        position += 1;
        return value;
      }
      throw new Error("Unexpected token");
    };

    const parseUnary = () => {
      if (tokens[position]?.type === "+") {
        position += 1;
        return parseUnary();
      }
      if (tokens[position]?.type === "-") {
        position += 1;
        return -parseUnary();
      }
      return parsePrimary();
    };

    const parseProduct = () => {
      let value = parseUnary();
      while (["*", "/", "%"].includes(tokens[position]?.type)) {
        const operator = tokens[position].type;
        position += 1;
        const right = parseUnary();
        if ((operator === "/" || operator === "%") && right === 0)
          throw new Error("Division by zero");
        if (operator === "*") value *= right;
        if (operator === "/") value /= right;
        if (operator === "%") value %= right;
      }
      return value;
    };

    const parseExpression = () => {
      let value = parseProduct();
      while (["+", "-"].includes(tokens[position]?.type)) {
        const operator = tokens[position].type;
        position += 1;
        const right = parseProduct();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    };

    try {
      const value = parseExpression();
      if (position !== tokens.length || !Number.isFinite(value)) return null;
      const formatted = Number(value.toFixed(10)).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: 10,
      });
      return {
        title: formatted,
        description: expression,
        type: "Result",
        icon: "=",
        iconClass: "calculator-icon",
        calculator: true,
      };
    } catch {
      return null;
    }
  }

  function getResults(query) {
    const calculation = calculate(query);
    if (calculation) return [calculation];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 5);

    return items
      .map((item) => {
        const title = item.title.toLowerCase();
        const searchable = `${title} ${item.description.toLowerCase()} ${item.keywords}`;
        const score = title.startsWith(normalized)
          ? 0
          : title.includes(normalized)
            ? 1
            : searchable.includes(normalized)
              ? 2
              : 99;
        return { item, score };
      })
      .filter(({ score }) => score < 99)
      .sort(
        (first, second) =>
          first.score - second.score ||
          first.item.title.localeCompare(second.item.title),
      )
      .slice(0, 5)
      .map(({ item }) => item);
  }

  function activate(item) {
    if (item.calculator) {
      updateStatus(`Press Return to copy ${item.title}`);
      return;
    }
    updateStatus(
      `Seek would ${item.type === "Application" ? "open" : "run"} ${item.title}`,
    );
  }

  function render() {
    visibleItems = getResults(input.value);
    if (selectedIndex >= visibleItems.length) selectedIndex = 0;
    results.replaceChildren();
    group.textContent = visibleItems[0]?.calculator
      ? "Calculator"
      : input.value.trim()
        ? "Results"
        : "Apps & Commands";

    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "demo-empty";
      empty.textContent =
        "No preview result. Try Safari, window, clipboard, or a calculation.";
      results.append(empty);
      action.textContent = "No Action";
      updateStatus("No matches · Try “window”");
      return;
    }

    visibleItems.forEach((item, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `seek-row${index === selectedIndex ? " is-selected" : ""}`;
      row.style.setProperty("--result-index", index);
      const icon = document.createElement("span");
      icon.className = `app-icon ${item.iconClass}`;
      icon.textContent = item.icon;
      icon.setAttribute("aria-hidden", "true");

      const title = document.createElement("strong");
      title.textContent = item.title;

      const description = document.createElement("span");
      description.className = "row-description";
      description.textContent = item.description;

      const favorite = document.createElement("span");
      favorite.className = "favorite";
      favorite.textContent = item.favorite ? "★" : "";
      favorite.setAttribute("aria-hidden", "true");

      const type = document.createElement("span");
      type.className = "row-type";
      type.textContent = item.type;

      row.append(icon, title, description, favorite, type);
      row.addEventListener("click", () => activate(item));
      results.append(row);
    });

    const selected = visibleItems[selectedIndex];
    action.textContent = selected.calculator
      ? "Copy Result"
      : selected.type === "Application"
        ? "Open Application"
        : "Run Command";
    const query = input.value.trim();
    updateStatus(
      selected.calculator
        ? "Calculation ready · Press Return"
        : query
          ? `${visibleItems.length} ${visibleItems.length === 1 ? "match" : "matches"} found`
          : "Interactive preview · Start typing above",
    );
  }

  input.addEventListener("input", () => {
    selectedIndex = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (!visibleItems.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % visibleItems.length;
      render();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedIndex =
        (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
      render();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      activate(visibleItems[selectedIndex]);
    }
    if (event.key === "Escape") {
      input.value = "";
      selectedIndex = 0;
      render();
    }
  });

  render();
}
