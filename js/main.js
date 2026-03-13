/* ==========================================================================
   1. CONFIGURACIÓN INICIAL
   ========================================================================== */

const eventDate    = new Date('July 18, 2026 13:30:00').getTime();
const themeToggle  = document.getElementById('theme-toggle');
const savedTheme   = localStorage.getItem('theme');

/* ==========================================================================
   2. MODO OSCURO
   ========================================================================== */

// Aplicar preferencia guardada al cargar la página
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerText = savedTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerText = isDark ? '🌙 Modo Oscuro' : '☀️ Modo Claro';
    localStorage.setItem('theme', newTheme);
});

/* ==========================================================================
   3. FORMULARIO: deshabilitar escritura en el campo de acompañantes
   ========================================================================== */

const plusOneInput = document.getElementById('plus-one');
if (plusOneInput) {
    plusOneInput.addEventListener('keydown', (e) => e.preventDefault());
}

/* ==========================================================================
   4. CUENTA ATRÁS
   ========================================================================== */

const dEl = document.getElementById('days');
const hEl = document.getElementById('hours');
const mEl = document.getElementById('minutes');
const sEl = document.getElementById('seconds');
const countdownTitle = document.querySelector('#countdown-section h2');

const updateCountdown = () => {
    const remaining = eventDate - Date.now();

    // La boda ya pasó
    if (remaining < 0) {
        clearInterval(countdownInterval);
        const container = document.getElementById('countdown');
        if (container) container.innerHTML = '<h3>¡Estamos de celebración! 🥂</h3>';
        return;
    }

    const days    = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    // Mensaje especial cuando queda menos de un día
    if (days === 0 && countdownTitle) {
        countdownTitle.innerText = '¡Mañana es el gran día! ✨';
        countdownTitle.style.color = 'var(--accent-color)';
    }

    if (dEl) dEl.innerText = String(days).padStart(2, '0');
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
    if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
};

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Primera ejecución inmediata

/* ==========================================================================
   5. ANIMACIONES DE ENTRADA (Intersection Observer)
   ========================================================================== */

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('section').forEach((section) => {
    section.classList.add('fade-in');
    observer.observe(section);
});