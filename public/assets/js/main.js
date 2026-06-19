/* =========================================================
   Main interactive behaviour — UkraïnaFest Castellón 2026
   ========================================================= */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    initSkipLink();
    initMobileMenu();
    initActiveNav();
    initReveal();
    initCounters();
    initCountdown();
    initCalendarLinks();
    initMapConsent();
    initRegForm();
  });

  function getLang() {
    return (window.UFest && window.UFest.detectLang && window.UFest.detectLang()) || "es";
  }

  function t(key, fallback) {
    const lang = getLang();
    if (window.I18N && window.I18N[lang] && window.I18N[lang][key] !== undefined) {
      return window.I18N[lang][key];
    }
    return fallback;
  }

  function initSkipLink() {
    const mainTarget = document.querySelector("main") || document.querySelector("section");
    if (!mainTarget) return;
    if (!mainTarget.id) mainTarget.id = "main-content";

    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main-content";
    skip.textContent = t("a11y.skip", "Skip to main content");
    document.body.insertBefore(skip, document.body.firstChild);
  }

  function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav    = document.querySelector(".nav");
    if (!toggle || !nav) return;
    if (!nav.id) nav.id = "site-nav";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  function initActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav a").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("is-active");
      }
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    const animate = el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1500;
      const start = performance.now();

      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(target * eased);
        el.textContent = value.toLocaleString("uk-UA") + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  function initCountdown() {
    const root = document.querySelector("[data-countdown-root]");
    if (!root) return;
    const target = new Date("2026-10-24T10:00:00+02:00").getTime();
    const value = root.querySelector("[data-countdown-value]");
    const label = root.querySelector("[data-countdown-label]");
    if (!value || !label) return;

    label.textContent = t("countdown.label", "Festival starts in:");

    const render = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        value.textContent = t("countdown.ended", "Festival has started!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      value.textContent = `${days}d ${hours}h ${mins}m`;
    };

    render();
    setInterval(render, 60000);
  }

  function initCalendarLinks() {
    const google = document.querySelector("[data-calendar-google]");
    const ics = document.querySelector("[data-calendar-ics]");
    const title = "UkraïnaFest Castellón 2026";
    const location = "Parque Ribalta, Castellón de la Plana, España";
    const details = "Festival de cultura ucraniana en España. Entrada libre.";
    const start = "20261024T080000Z";
    const end = "20261024T203000Z";

    if (google) {
      const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
      google.href = `${base}&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
      google.target = "_blank";
      google.rel = "noopener noreferrer";
      google.textContent = t("calendar.google", "Add to Google Calendar");
    }

    if (ics) {
      const icsBody = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//UkraïnaFest//Festival Calendar//EN",
        "BEGIN:VEVENT",
        "UID:ukrainafest-2026@ukrainafest.es",
        "DTSTAMP:20260611T120000Z",
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${details}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      ics.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsBody);
      ics.download = "ukrainafest-2026.ics";
      ics.textContent = t("calendar.ics", "Download .ics");
    }
  }

  function initMapConsent() {
    const STORAGE_KEY = "ufest.mapConsent";
    const allowed = localStorage.getItem(STORAGE_KEY) === "yes";
    const mapIframes = document.querySelectorAll(".map-frame iframe");
    if (!mapIframes.length || allowed) return;

    mapIframes.forEach(iframe => {
      const src = iframe.getAttribute("src");
      iframe.removeAttribute("src");

      const placeholder = document.createElement("div");
      placeholder.className = "map-consent";
      placeholder.innerHTML = `
        <h3>${t("cookie.map.title", "Map consent required")}</h3>
        <p>${t("cookie.map.text", "To display Google Maps, allow external content.")}</p>
        <button type="button" class="btn btn--primary">${t("cookie.map.btn", "Allow map")}</button>
      `;
      iframe.parentElement.appendChild(placeholder);

      const btn = placeholder.querySelector("button");
      btn.addEventListener("click", () => {
        localStorage.setItem(STORAGE_KEY, "yes");
        iframe.setAttribute("src", src);
        placeholder.remove();
      });
    });
  }

  function initRegForm() {
    const form = document.querySelector("#reg-form");
    if (!form) return;

    const fields = {
      name: form.querySelector("#reg-name"),
      email: form.querySelector("#reg-email"),
      role: form.querySelector("#reg-role"),
      consent: form.querySelector("#reg-consent")
    };

    Object.values(fields).forEach(field => {
      if (!field) return;
      if (field.parentElement && !field.parentElement.querySelector(".field-error")) {
        const err = document.createElement("div");
        err.className = "field-error";
        field.parentElement.appendChild(err);
      }
    });

    const setError = (field, message) => {
      if (!field || !field.parentElement) return;
      const err = field.parentElement.querySelector(".field-error");
      if (err) err.textContent = message;
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
    };

    const clearError = field => {
      if (!field || !field.parentElement) return;
      const err = field.parentElement.querySelector(".field-error");
      if (err) err.textContent = "";
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    };

    form.addEventListener("submit", e => {
      e.preventDefault();
      const lang = getLang();
      let hasError = false;

      Object.values(fields).forEach(clearError);

      if (!fields.name.value.trim()) {
        hasError = true;
        setError(fields.name, t("reg.error.name", "Please enter your name."));
      }
      if (!fields.email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
        hasError = true;
        setError(fields.email, t("reg.error.email", "Please enter a valid email."));
      }
      if (!fields.role.value) {
        hasError = true;
        setError(fields.role, t("reg.error.role", "Please select a role."));
      }
      if (!fields.consent.checked) {
        hasError = true;
        setError(fields.consent, t("reg.error.consent", "Consent is required."));
      }
      if (hasError) return;

      const msg  = lang === "ua"
        ? "Дякуємо! Ваша заявка надіслана. Ми зв'яжемося з вами найближчим часом."
        : "¡Gracias! Tu solicitud ha sido enviada. Te contactaremos pronto.";
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = msg;
        status.style.display = "block";
      }
      form.reset();
    });
  }
})();
