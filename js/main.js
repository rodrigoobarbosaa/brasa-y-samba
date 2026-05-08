/* ========================================
   BRASA Y SAMBA — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollAnimations();
  initContactForm();
  initDateRestrictions();
});

/* ----------------------------------------
   NAVBAR — Scroll Effect
   ---------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Skip scroll effect on subpages (navbar already has .scrolled)
  if (navbar.classList.contains('scrolled')) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ----------------------------------------
   HAMBURGER — Mobile Menu
   ---------------------------------------- */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');
  if (!hamburger || !navMenu || !navbar) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ----------------------------------------
   SCROLL ANIMATIONS — Fade In on Scroll
   ---------------------------------------- */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   CONTACT FORM — Validation & Submit
   ---------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    const required = ['nombre', 'email', 'telefono', 'fecha', 'hora', 'personas'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
      showFormMessage('Por favor, rellena todos los campos obligatorios.', 'error');
      return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      showFormMessage('Por favor, introduce un email válido.', 'error');
      return;
    }

    // Check if selected day is open (Thu-Sun)
    const selectedDate = new Date(data.fecha);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 3) {
      showFormMessage('Lo sentimos, estamos cerrados de lunes a miércoles. Por favor selecciona jueves a domingo.', 'error');
      return;
    }

    // Build WhatsApp message
    const message = encodeURIComponent(
      `¡Hola! Quiero reservar mesa en Brasa y Samba:\n\n` +
      `👤 Nombre: ${data.nombre}\n` +
      `📧 Email: ${data.email}\n` +
      `📞 Teléfono: ${data.telefono}\n` +
      `📅 Fecha: ${data.fecha}\n` +
      `🕐 Hora: ${data.hora}\n` +
      `👥 Personas: ${data.personas}\n` +
      (data.mensaje ? `💬 Mensaje: ${data.mensaje}\n` : '') +
      `\n¡Gracias!`
    );

    const whatsappUrl = `https://wa.me/34685563874?text=${message}`;

    showFormMessage('Tu reserva queda pendiente de confirmación por WhatsApp. Te redirigimos ahora.', 'success');

    setTimeout(() => {
      form.reset();
      window.location.href = whatsappUrl;
    }, 1500);
  });
}

function showFormMessage(text, type) {
  // Remove existing messages
  const existing = document.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = `form-message form-message-${type}`;
  msg.textContent = text;
  msg.style.cssText = `
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-weight: 600;
    text-align: center;
    ${type === 'success'
      ? 'background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7;'
      : 'background: #FFEBEE; color: #C62828; border: 1px solid #EF9A9A;'
    }
  `;

  const form = document.getElementById('contactForm');
  form.appendChild(msg);

  setTimeout(() => msg.remove(), 5000);
}

/* ----------------------------------------
   DATE RESTRICTIONS — Disable closed days
   ---------------------------------------- */
function initDateRestrictions() {
  const dateInput = document.getElementById('fecha');
  if (!dateInput) return;

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}
