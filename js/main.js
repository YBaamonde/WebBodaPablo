import { IMAGES } from "./images.js";

/* ==========================================================================
   1. CONFIGURACIÓN INICIAL
   ========================================================================== */

const eventDate = new Date("July 18, 2026 13:30:00").getTime();
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

/* ==========================================================================
   2. MODO OSCURO
   ========================================================================== */

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.innerText =
    savedTheme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.innerText = isDark ? "🌙 Modo Oscuro" : "☀️ Modo Claro";
  localStorage.setItem("theme", newTheme);
});

/* ==========================================================================
   3. FORMULARIO: deshabilitar escritura en el campo de acompañantes
   ========================================================================== */

const plusOneInput = document.getElementById("plus-one");
if (plusOneInput) {
  plusOneInput.addEventListener("keydown", (e) => e.preventDefault());
}

/* ==========================================================================
   4. CUENTA ATRÁS
   ========================================================================== */

const dEl = document.getElementById("days");
const hEl = document.getElementById("hours");
const mEl = document.getElementById("minutes");
const sEl = document.getElementById("seconds");
const countdownTitle = document.querySelector("#countdown-section h2");

const updateCountdown = () => {
  const remaining = eventDate - Date.now();

  if (remaining < 0) {
    clearInterval(countdownInterval);
    const container = document.getElementById("countdown");
    if (container) container.innerHTML = "<h3>¡Estamos de celebración! 🥂</h3>";
    return;
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (days === 0 && countdownTitle) {
    countdownTitle.innerText = "¡Mañana es el gran día! ✨";
    countdownTitle.style.color = "var(--accent-color)";
  }

  if (dEl) dEl.innerText = String(days).padStart(2, "0");
  if (hEl) hEl.innerText = String(hours).padStart(2, "0");
  if (mEl) mEl.innerText = String(minutes).padStart(2, "0");
  if (sEl) sEl.innerText = String(seconds).padStart(2, "0");
};

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

/* ==========================================================================
   5. ANIMACIONES DE ENTRADA (Intersection Observer)
   ========================================================================== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll("section").forEach((section) => {
  section.classList.add("fade-in");
  observer.observe(section);
});

/* ==========================================================================
   6. CARRUSEL — NUESTRA HISTORIA
   ========================================================================== */

(function () {
  const INTERVAL = 4500;
  const IMAGE_PATH = "/media/Imagenes/";

  const track = document.getElementById("historia-track");
  const progress = document.getElementById("historia-progress");
  const prevBtn = document.getElementById("historia-prev");
  const nextBtn = document.getElementById("historia-next");
  const wrap = document.getElementById("historia-carousel");

  if (!track) return;

  IMAGES.forEach((entry, i) => {
    const file = typeof entry === "string" ? entry : entry.file;
    const position =
      typeof entry === "string" ? "center" : (entry.position ?? "center");
    const zoom = typeof entry === "string" ? "cover" : (entry.zoom ?? "cover");

    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.style.backgroundImage = `url(${IMAGE_PATH}${encodeURIComponent(file)})`; // ← codifica espacios y caracteres especiales
    slide.style.backgroundSize = zoom;
    slide.style.backgroundPosition = position;
    slide.style.backgroundRepeat = "no-repeat"; // ← evita el mosaico
    slide.setAttribute("aria-label", `Foto ${i + 1}`);
    track.appendChild(slide);
  });

  const total = IMAGES.length;
  let current = 0;
  let timer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    restartProgress();
  }

  function restartProgress() {
    clearInterval(timer);
    progress.style.transition = "none";
    progress.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        progress.style.transition = `width ${INTERVAL}ms linear`;
        progress.style.width = "100%";
      }),
    );
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  let startX = 0;
  wrap.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  wrap.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  restartProgress();
})();

/* ==========================================================================
   7. FORMULARIO: mostrar pregunta de autobús solo si viene de Viveiro
   ========================================================================== */

document.querySelectorAll('input[name="Viveiro"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const busQuestion = document.getElementById("bus-question");
    const busInputs = busQuestion.querySelectorAll('input[name="Bus"]');

    if (e.target.value === "Si") {
      busQuestion.classList.remove("hidden");
    } else {
      busQuestion.classList.add("hidden");
      busInputs.forEach((input) => {
        if (input.value === "No") input.checked = true;
      });
    }
  });
});

/* ==========================================================================
   8. FADE DE SALIDA DEL HEADER AL HACER SCROLL
   ========================================================================== */

(function () {
  const content = document.querySelector(".header-content");
  const header = document.querySelector("header");

  if (!content || !header) return;

  content.style.transition = "opacity 0.15s ease";

  window.addEventListener(
    "scroll",
    () => {
      const threshold = header.offsetHeight * 0.25;
      const opacity = Math.max(0, 1 - window.scrollY / threshold);
      content.style.opacity = opacity;
    },
    { passive: true },
  );
})();
