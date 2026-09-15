/**
 * CR TERAPIA — MAIN JAVASCRIPT
 * Controlador global de interactividad, filtros, menú y formulario
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Año dinámico en el footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Menú móvil (Hamburger)
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Header sombreado al hacer scroll
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. Scroll Reveal con IntersectionObserver
  const fadeElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => revealObserver.observe(el));

  // 5. Filtro de Categorías de Servicios
  const filterBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCategory.includes(category)) {
          card.classList.remove('hidden');
          // Pequeña animación de entrada
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 6. Efecto 3D Tilt en tarjetas al mover el cursor
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 7. Preguntas Frecuentes (FAQ Accordion)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPane = item.querySelector('.faq-answer-pane');

    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros acordeones abiertos si se desea estilo único
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherPane = otherItem.querySelector('.faq-answer-pane');
          if (otherPane) otherPane.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answerPane.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
      }
    });
  });

  // 8. Formulario Rápido de Agendamiento hacia WhatsApp
  const bookingForm = document.getElementById('quick-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim() || '';
      const phone = document.getElementById('form-phone')?.value.trim() || '';
      const service = document.getElementById('form-service')?.value || 'Consulta general';
      const schedule = document.getElementById('form-schedule')?.value || 'Indiferente';
      const message = document.getElementById('form-message')?.value.trim() || '';

      if (!name) {
        alert('Por favor indica tu nombre completo.');
        return;
      }

      // Construir mensaje amigable para WhatsApp
      let text = `*Hola Dra. Adriana Trigueros / CR Terapia*,\n\n`;
      text += `Deseo solicitar información para agendar una sesión:\n`;
      text += `• *Nombre:* ${name}\n`;
      if (phone) text += `• *Teléfono/Contacto:* ${phone}\n`;
      text += `• *Servicio de interés:* ${service}\n`;
      text += `• *Horario de preferencia:* ${schedule}\n`;
      if (message) text += `• *Mensaje o motivo:* ${message}\n\n`;
      text += `Agradezco su pronta respuesta y disponibilidad. ¡Muchas gracias!`;

      const encoded = encodeURIComponent(text);
      const waUrl = `https://wa.me/50683952601?text=${encoded}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 9. Enlaces de servicio hacia WhatsApp directo
  document.querySelectorAll('.btn-service-wa').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'un servicio';
      const text = `Hola Dra. Adriana Trigueros, deseo consultar disponibilidad e información sobre el servicio de *${serviceName}* en CR Terapia.`;
      const waUrl = `https://wa.me/50683952601?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });
});
