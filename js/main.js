import { IMAGES } from "./images.js";

/* ==========================================================================
   1. CONFIGURACION INICIAL
   ========================================================================== */

const eventDate = new Date("July 18, 2026 13:30:00").getTime();

/* ==========================================================================
   2. CUENTA ATRAS
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
    if (container) container.innerHTML = "<h3>Estamos de celebracion! 🥂</h3>";
    return;
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (days === 0 && countdownTitle) {
    countdownTitle.innerText = "Mañana es el gran dia! ✨";
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
   3. ANIMACIONES DE ENTRADA (Intersection Observer)
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
   4. CARRUSEL — NUESTRA HISTORIA
   ========================================================================== */

(function () {
  const INTERVAL = 4500;
  const IMAGE_PATH = "media/Imagenes/compressed/";

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
    const filename = file.replace(/\.(jpg|jpeg|png|avif)$/i, ".webp");

    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.style.backgroundImage = `url(${IMAGE_PATH}${encodeURIComponent(filename)})`;
    slide.style.backgroundSize = zoom;
    slide.style.backgroundPosition = position;
    slide.style.backgroundRepeat = "no-repeat";
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
   5. FORMULARIO: menus dinamicos y logica de autobus
   ========================================================================== */

const MENU_OPCIONES = [
  { value: "Estandar", label: "Menu Estandar" },
  { value: "Vegetariano", label: "Menu Vegetariano" },
  { value: "Infantil", label: "Menu Infantil" },
];

function crearSelectorMenu(nombre, inputName) {
  const wrap = document.createElement("div");
  wrap.className = "menu-persona radio-modern";

  const legend = document.createElement("legend");
  legend.textContent = nombre;
  wrap.appendChild(legend);

  const options = document.createElement("div");
  options.className = "options";

  MENU_OPCIONES.forEach((op, i) => {
    const label = document.createElement("label");
    label.className = "option" + (i === 0 ? " selected" : "");
    label.dataset.value = op.value;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = inputName;
    input.value = op.value;
    input.style.display = "none";
    if (i === 0) input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(op.label));
    options.appendChild(label);
  });

  wrap.appendChild(options);

  options.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      options
        .querySelectorAll(".option")
        .forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      option.querySelector('input[type="radio"]').checked = true;
    });
  });

  return wrap;
}

function actualizarMenus() {
  const n = parseInt(document.getElementById("plus-one").value) || 0;
  const contenedor = document.getElementById("menu-dinamico");
  contenedor.innerHTML = "";

  contenedor.appendChild(crearSelectorMenu("Tu menu", "Menu_0"));
  for (let i = 1; i <= n; i++) {
    contenedor.appendChild(crearSelectorMenu(`Acompañante ${i}`, `Menu_${i}`));
  }
}

actualizarMenus();

const inputAcompanantes = document.getElementById("plus-one");
const valorAcompanantes = document.getElementById("plus-one-value");

if (inputAcompanantes) {
  inputAcompanantes.addEventListener("keydown", (e) => e.preventDefault());
  inputAcompanantes.addEventListener("input", () => {
    valorAcompanantes.textContent = inputAcompanantes.value;
    actualizarMenus();
  });
}

function activarRadioModern(group) {
  group.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      group
        .querySelectorAll(".option")
        .forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      option.querySelector('input[type="radio"]').checked = true;

      const radio = option.querySelector('input[name="Viveiro"]');
      if (radio) {
        const busQuestion = document.getElementById("bus-question");
        const busOptions = busQuestion.querySelectorAll(".option");

        if (radio.value === "Si") {
          busQuestion.classList.remove("hidden");
        } else {
          busQuestion.classList.add("hidden");
          busOptions.forEach((o) => o.classList.remove("selected"));
          busOptions[0].classList.add("selected");
          busOptions[0].querySelector('input[type="radio"]').checked = true;
        }
      }
    });
  });
}

document.querySelectorAll(".radio-modern .options").forEach(activarRadioModern);

/* ==========================================================================
   6. FADE DE SALIDA DEL HEADER AL HACER SCROLL
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

/* ==========================================================================
   7. TOGGLE DE TRANSPORTE
   ========================================================================== */

document.querySelectorAll(".transport-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    document
      .querySelectorAll(".transport-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document
      .querySelectorAll(".transport-info")
      .forEach((info) => info.classList.add("hidden"));
    document.getElementById(`info-${target}`).classList.remove("hidden");
  });
});

/* ==========================================================================
   8. COPIAR NUMERO DE CUENTA
   ========================================================================== */

const copiarBtn = document.getElementById("copiar-cuenta");
const confirmacion = document.getElementById("cuenta-confirmacion");

if (copiarBtn) {
  copiarBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("ES33 3058 0990 2527 6357 3607");
    confirmacion.classList.remove("hidden");
    copiarBtn.textContent = "Copiado";
    setTimeout(() => {
      confirmacion.classList.add("hidden");
      copiarBtn.textContent = "Copiar numero";
    }, 2500);
  });
}
