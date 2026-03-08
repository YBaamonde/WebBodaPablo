// JS principal para la página

document.addEventListener('DOMContentLoaded', () => {
  /* ── Cuenta regresiva (si existen los elementos) ── */
  const targetDate = new Date('July 18, 2026 13:00:00').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.innerText = d;
    hoursEl.innerText = h;
    minutesEl.innerText = m;
    secondsEl.innerText = s;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── Reveal content on scroll ── */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transition = 'opacity 1s ease-out';
    sectionObserver.observe(section);
  });

  /* ── Timeline animation ── */
  const tlItems = document.querySelectorAll('.tl-item');
  if (tlItems.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    tlItems.forEach(item => timelineObserver.observe(item));
  }

  /* ── Formspree AJAX submit (con validación) ── */
  const form = document.getElementById('rsvp-form');
  const success = document.getElementById('form-success');

  function setFieldError(input, message) {
    if (!input) return;
    let error = input.parentElement.querySelector('.field-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'field-error';
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
  }

  function clearFieldError(input) {
    if (!input) return;
    const error = input.parentElement.querySelector('.field-error');
    if (error) error.remove();
  }

  function validateRsvpForm() {
    if (!form) return false;

    const name = form.querySelector('#nombre');
    const asistencia = form.querySelector('input[name="asistencia"]:checked');
    const acompanantes = form.querySelector('#acompanantes');
    const mensaje = form.querySelector('#mensaje');

    let valid = true;

    // Nombre mínimo 2 caracteres (sin contar espacios) y sin números
    if (name) {
      const value = name.value.trim();
      clearFieldError(name);
      if (value.length < 2) {
        setFieldError(name, 'Introduce tu nombre completo.');
        valid = false;
      } else if (/\d/.test(value)) {
        setFieldError(name, 'El nombre no puede contener números.');
        valid = false;
      }
    }

    // Asistencia obligatoria
    if (!asistencia) {
      const radioWrapper = form.querySelector('.radio-group');
      if (radioWrapper) {
        setFieldError(radioWrapper, 'Selecciona si vas a asistir.');
      }
      valid = false;
    } else {
      const radioWrapper = form.querySelector('.radio-group');
      if (radioWrapper) clearFieldError(radioWrapper);
    }

    // Acompañantes (0-4)
    if (acompanantes) {
      clearFieldError(acompanantes);
      const value = Number(acompanantes.value);
      if (Number.isNaN(value) || value < 0 || value > 4) {
        setFieldError(acompanantes, 'Selecciona un número válido (0–4).');
        valid = false;
      }
    }

    // Mensaje (opcional, pero no demasiado largo)
    if (mensaje) {
      clearFieldError(mensaje);
      if (mensaje.value.length > 400) {
        setFieldError(mensaje, 'Máximo 400 caracteres.');
        valid = false;
      }
    }

    return valid;
  }

  if (form && success) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!validateRsvpForm()) return;

      const btn = form.querySelector('.btn-submit');
      if (btn) {
        btn.textContent = 'Enviando…';
        btn.disabled = true;
      }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.style.display = 'none';
          success.style.display = 'block';
        } else {
          if (btn) {
            btn.textContent = '¡Confirmar asistencia!';
            btn.disabled = false;
          }
          alert('Ha habido un error. Por favor, inténtalo de nuevo.');
        }
      } catch (err) {
        if (btn) {
          btn.textContent = '¡Confirmar asistencia!';
          btn.disabled = false;
        }
        alert('Sin conexión. Por favor, inténtalo de nuevo.');
      }
    });
  }

  /* ── Subtle parallax on hero names ── */
  const heroNames = document.querySelector('.hero-names');
  if (heroNames) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroNames.style.transform = `translateY(${y * 0.15}px)`;
    });
  }
});
