const reveals = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".nav a");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const counters = document.querySelectorAll("[data-count]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  },
);

reveals.forEach((element) => revealObserver.observe(element));

const sectionTargets = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  },
);

sectionTargets.forEach((section) => sectionObserver.observe(section));

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    tabButtons.forEach((candidate) => {
      candidate.classList.toggle("is-active", candidate === button);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `tab-${tabName}`);
    });
  });
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      const raw = el.dataset.count || "";
      const numeric = parseFloat(raw.replace(/[^\d.-]/g, ""));
      const hasPercent = raw.includes("%");
      const prefix = raw.trim().startsWith("+") ? "+" : "";
      const decimals = raw.includes(".") ? raw.split(".")[1].replace(/[^\d]/g, "").length : 0;
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = numeric * eased;
        const formatted = `${prefix}${value.toFixed(decimals)}${hasPercent ? "%" : ""}`;
        el.textContent = formatted;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      }

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  },
  {
    threshold: 0.4,
  },
);

counters.forEach((counter) => counterObserver.observe(counter));
