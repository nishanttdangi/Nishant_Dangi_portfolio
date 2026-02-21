/**
 * ================================================================
 * NISHANT DANGI — PORTFOLIO: main.js
 * ================================================================
 * Features:
 *  - Dark / Light theme toggle (persisted in localStorage)
 *  - Navbar scroll behaviour (glassmorphism + active link tracking)
 *  - Type-writer role animation
 *  - Scroll-reveal animations (IntersectionObserver)
 *  - Skill-bar fill animation (IntersectionObserver)
 *  - Mobile hamburger menu
 *  - Contact form validation & simulated send
 *  - Back-to-top button
 *  - Footer year auto-update
 * ================================================================
 */

/* ----------------------------------------------------------------
   CONFIG — Edit these variables to personalise the portfolio
   ---------------------------------------------------------------- */
const CONFIG = {
  name: "Nishant",
  roles: [
    "Java Backend Developer",
    "Spring Boot Engineer",
    "REST API Specialist",
    "Backend Problem Solver",
  ],
  typeSpeed:   75,   // ms per character
  deleteSpeed: 40,   // ms per character when deleting
  pauseAfter:  2200, // ms to pause after full word is typed
  pauseBeforeDelete: 400, // ms before starting to delete
};

/* ================================================================
   THEME MANAGEMENT
   ================================================================ */
const themeToggleBtn = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

/**
 * Apply the given theme ("dark" | "light") to the HTML element
 * and persist it in localStorage.
 */
function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
}

/**
 * On first load, read saved preference or fall back to the
 * system's preferred colour scheme.
 */
(function initTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
})();

/** Toggle between dark and light on button click. */
themeToggleBtn.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ================================================================
   NAVBAR — Scroll & Active Link
   ================================================================ */
const navbar   = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

/**
 * Add/remove .scrolled class based on scroll position.
 * Track which section is in the viewport and highlight its nav link.
 */
function handleNavbarScroll() {
  // Glassmorphism effect
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active link tracking
  let currentId = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) {
      currentId = sec.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
// Run once to set initial state
handleNavbarScroll();

/* ================================================================
   MOBILE HAMBURGER MENU
   ================================================================ */
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");

function toggleMobileMenu(open) {
  hamburger.classList.toggle("open", open);
  mobileMenu.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
}

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.contains("open");
  toggleMobileMenu(!isOpen);
});

// Close menu when a link is clicked
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMobileMenu(false));
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (
    mobileMenu.classList.contains("open") &&
    !navbar.contains(e.target)
  ) {
    toggleMobileMenu(false);
  }
});

/* ================================================================
   TYPED ROLE ANIMATION
   ================================================================ */
const typedRoleEl = document.getElementById("typedRole");

(function initTypedRole() {
  if (!typedRoleEl) return;

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  function type() {
    const current = CONFIG.roles[roleIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, CONFIG.pauseBeforeDelete);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typedRoleEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Full word typed — pause, then start deleting
        isPaused = true;
        setTimeout(type, CONFIG.pauseAfter);
        isDeleting = true;
        return;
      }

      setTimeout(type, CONFIG.typeSpeed);
    } else {
      // Deleting
      typedRoleEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Word fully deleted — move to next role
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % CONFIG.roles.length;
        setTimeout(type, 400);
        return;
      }

      setTimeout(type, CONFIG.deleteSpeed);
    }
  }

  // Short initial delay before typing starts
  setTimeout(type, 900);
})();

/* ================================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // Fallback: show everything immediately
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ================================================================
   SKILL BAR ANIMATION — fill bars when they scroll into view
   ================================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar__fill");

  if (!bars.length) return;

  if (!("IntersectionObserver" in window)) {
    bars.forEach((bar) => {
      bar.style.width = `${bar.dataset.width}%`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar    = entry.target;
          const target = bar.dataset.width;
          bar.style.width = `${target}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ================================================================
   CONTACT FORM — Validation & Simulated Submission
   ================================================================ */
(function initContactForm() {
  const form        = document.getElementById("contactForm");
  const submitBtn   = document.getElementById("submitBtn");
  const feedback    = document.getElementById("formFeedback");

  const nameInput   = document.getElementById("contactName");
  const emailInput  = document.getElementById("contactEmail");
  const msgInput    = document.getElementById("contactMessage");

  const nameError   = document.getElementById("nameError");
  const emailError  = document.getElementById("emailError");
  const msgError    = document.getElementById("messageError");

  if (!form) return;

  /** Simple email regex validation */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Show an error on a specific field */
  function showError(input, errorEl, message) {
    input.classList.add("error");
    errorEl.textContent = message;
  }

  /** Clear a field's error state */
  function clearError(input, errorEl) {
    input.classList.remove("error");
    errorEl.textContent = "";
  }

  /** Validate all fields; returns true if valid */
  function validate() {
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, "Please enter your name.");
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Email
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, emailError, "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Message
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      showError(msgInput, msgError, "Message must be at least 10 characters.");
      valid = false;
    } else {
      clearError(msgInput, msgError);
    }

    return valid;
  }

  // Clear errors on input
  [nameInput, emailInput, msgInput].forEach((input) => {
    input.addEventListener("input", () => {
      const errorEl =
        input === nameInput  ? nameError  :
        input === emailInput ? emailError :
        msgError;
      clearError(input, errorEl);
      feedback.className = "form-feedback"; // hide feedback banner
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Set loading state
    submitBtn.classList.add("btn--loading");
    submitBtn.querySelector(".btn-label").textContent = "Sending…";

    /**
     * Simulate an async network request (replace with real
     * fetch() call to a backend / serverless function in production).
     */
    setTimeout(() => {
      submitBtn.classList.remove("btn--loading");
      submitBtn.querySelector(".btn-label").textContent = "Send Message";

      // Show success message
      feedback.textContent =
        "Thanks for reaching out! I'll get back to you soon. ✓";
      feedback.className = "form-feedback success";

      // Reset form
      form.reset();

      // Auto-hide after 6 seconds
      setTimeout(() => {
        feedback.className = "form-feedback";
      }, 6000);
    }, 1600);
  });
})();

/* ================================================================
   BACK-TO-TOP BUTTON
   ================================================================ */
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ================================================================
   FOOTER YEAR — keep copyright current automatically
   ================================================================ */
(function updateFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
})();

/* ================================================================
   SMOOTH SCROLL for all in-page anchor links
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* ================================================================
   HERO NAME — reads from CONFIG for easy personalisation
   ================================================================ */
(function setHeroName() {
  const el = document.getElementById("heroName");
  if (el) el.textContent = CONFIG.name;
})();
