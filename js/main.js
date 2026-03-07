// Configuramos la fecha del evento
const eventDate = new Date('July 18, 2026 13:30:00').getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const duration = eventDate - now;

    // 1. Si la boda ya pasó
    if (duration < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = "<h3>¡Estamos de celebración! 🥂</h3>";
        return;
    }

    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    
    // 2. Lógica para menos de 24 horas
    const countdownTitle = document.querySelector('#countdown-section h2');
    if (days === 0 && duration > 0) {
        countdownTitle.innerText = "¡Mañana es el gran día! ✨";
        countdownTitle.style.color = "#e63946"; // Un tono más vibrante/emocionante
    }

    // Cálculos estándar
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
};

// Actualizamos cada segundo
const countdownInterval = setInterval(updateCountdown, 1000);

// Ejecutamos una vez al cargar para evitar el "00" inicial
updateCountdown();