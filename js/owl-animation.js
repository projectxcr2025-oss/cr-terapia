/**
 * CR TERAPIA — OWL ANIMATION CONTROLLER (ROBUST & AUTO-REPEATING)
 * Gestiona la llegada del búho volador con ojos abiertos, aterrizaje,
 * transición al sueño, y repetición automática cada 3 minutos.
 */

class OwlFlightController {
  constructor() {
    this.owlEl = document.getElementById('hero-owl');
    this.container = document.querySelector('.hero-emblem-card');
    this.pupils = document.querySelectorAll('.owl-pupil');
    this.isFlying = false;
    this.awakeTimeout = null;
    this.sleepTimeout = null;
    this.autoReplayInterval = null;

    this.init();
  }

  init() {
    if (!this.owlEl) return;

    // Disparar vuelo con un breve retraso inicial para que el visitante aprecie la llegada
    setTimeout(() => {
      this.startFlight();
    }, 700);

    // Clic en el búho repite el vuelo inmediatamente
    this.owlEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.replay();
    });

    // Pasar el cursor despierta al búho si está durmiendo
    this.owlEl.addEventListener('mouseenter', () => this.wakeUp());
    this.owlEl.addEventListener('mouseleave', () => this.sleepAfterDelay(2000));

    // Seguimiento interactivo de la mirada hacia el cursor
    if (this.container) {
      this.container.addEventListener('mousemove', (e) => this.trackCursor(e));
      this.container.addEventListener('mouseleave', () => this.resetPupils());
      // También permitir clic en el contenedor del emblema para repetir el vuelo
      this.container.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-floating-pill')) {
          this.replay();
        }
      });
    }

    // Auto-repetir el vuelo cada 3 minutos (180000 ms)
    this.autoReplayInterval = setInterval(() => {
      // Solo repetir si la sección hero es visible en viewport
      if (this.isHeroVisible() && !this.isFlying) {
        this.replay();
      }
    }, 180000);

    // También repetir cuando el usuario regresa al tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isFlying) {
        // Pequeño delay al volver al tab
        setTimeout(() => {
          if (this.isHeroVisible() && !this.isFlying) {
            this.replay();
          }
        }, 1200);
      }
    });
  }

  isHeroVisible() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return false;
    const rect = heroSection.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  startFlight() {
    this.isFlying = true;
    clearTimeout(this.sleepTimeout);
    clearTimeout(this.awakeTimeout);

    // Durante el vuelo: clase flying activa, ojos abiertos
    this.owlEl.classList.remove('landed');
    this.owlEl.classList.add('flying', 'awake');

    // Duración de la trayectoria de vuelo = 2.6s
    setTimeout(() => {
      this.handleLanding();
    }, 2600);
  }

  handleLanding() {
    this.isFlying = false;
    this.owlEl.classList.remove('flying');
    this.owlEl.classList.add('landed', 'awake');

    // Permanece despierto mirando con curiosidad tras aterrizar
    setTimeout(() => {
      // Mira a un lado
      this.pupils.forEach(pupil => pupil.style.transform = 'translate(3px, -1px)');
      setTimeout(() => {
        // Mira al otro lado
        this.pupils.forEach(pupil => pupil.style.transform = 'translate(-3px, -1px)');
        setTimeout(() => {
          this.resetPupils();
          // Cierra suavemente los ojos para descansar en paz mental
          this.sleepTimeout = setTimeout(() => {
            this.owlEl.classList.remove('awake');
          }, 800);
        }, 450);
      }, 450);
    }, 500);
  }

  wakeUp() {
    if (this.isFlying) return;
    clearTimeout(this.sleepTimeout);
    clearTimeout(this.awakeTimeout);
    this.owlEl.classList.add('awake');
  }

  sleepAfterDelay(delay = 2000) {
    if (this.isFlying) return;
    clearTimeout(this.awakeTimeout);
    this.awakeTimeout = setTimeout(() => {
      this.owlEl.classList.remove('awake');
      this.resetPupils();
    }, delay);
  }

  trackCursor(e) {
    if (this.isFlying || !this.owlEl.classList.contains('awake')) return;

    const rect = this.owlEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const moveX = Math.max(-5, Math.min(5, deltaX * 4.5));
    const moveY = Math.max(-4, Math.min(4, deltaY * 3.5));

    this.pupils.forEach(pupil => {
      pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  resetPupils() {
    this.pupils.forEach(pupil => {
      pupil.style.transform = 'translate(0px, 0px)';
    });
  }

  replay() {
    this.owlEl.classList.remove('flying', 'landed', 'awake');
    this.owlEl.style.animation = 'none';
    this.owlEl.offsetHeight; // Reflow

    const wing = this.owlEl.querySelector('.owl-wing-animated');
    if (wing) {
      wing.style.animation = 'none';
      wing.offsetHeight;
      wing.style.animation = '';
    }
    this.owlEl.style.animation = '';

    setTimeout(() => {
      this.startFlight();
    }, 60);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.owlController = new OwlFlightController();
});
