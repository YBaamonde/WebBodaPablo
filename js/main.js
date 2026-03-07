/* ==========================================================================
   1. CONFIGURACIÓN Y ESTADO INICIAL
   ========================================================================== */

// Fecha del gran día
const eventDate = new Date('July 18, 2026 13:30:00').getTime();

// Elementos del DOM para el tema
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

/* ==========================================================================
   2. GESTIÓN DEL MODO OSCURO (DARK MODE)
   ========================================================================== */

// Aplicamos preferencia guardada al cargar
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.innerText = "☀️ Modo Claro";
    }
}

// Escuchador para el cambio de tema
themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerText = "🌙 Modo Oscuro";
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerText = "☀️ Modo Claro";
        localStorage.setItem('theme', 'dark');
    }
});

/* ==========================================================================
   3. LÓGICA DE LA CUENTA ATRÁS (COUNTDOWN)
   ========================================================================== */

const updateCountdown = () => {
    const now = new Date().getTime();
    const duration = eventDate - now;

    // Caso: La boda ya ha pasado o es hoy
    if (duration < 0) {
        clearInterval(countdownInterval);
        const countdownContainer = document.getElementById('countdown');
        if (countdownContainer) {
            countdownContainer.innerHTML = "<h3>¡Estamos de celebración! 🥂</h3>";
        }
        return;
    }

    // Cálculos de tiempo
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    // Actualización de UI para el título (Menos de 24h)
    const countdownTitle = document.querySelector('#countdown-section h2');
    if (days === 0 && duration > 0 && countdownTitle) {
        countdownTitle.innerText = "¡Mañana es el gran día! ✨";
        countdownTitle.style.color = "var(--accent-color)"; 
    }

    // Inserción de valores con formato 00
    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = days.toString().padStart(2, '0');
    if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
    if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
    if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
};

// Intervalo de actualización (1 segundo)
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Ejecución inmediata al cargar

/* ==========================================================================
   4. ANIMACIONES DE ENTRADA (INTERSECTION OBSERVER)
   ========================================================================== */

const observerOptions = {
    threshold: 0.1 // Se activa cuando el 10% de la sección es visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Opcional: dejar de observar una vez animado
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Aplicamos la clase base y empezamos a observar todas las secciones
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});