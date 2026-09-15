/**
 * CR TERAPIA — WIDGET DE RESPIRACIÓN CONSCIENTE 4-7-8
 * Brinda una experiencia de calma interactiva inmediata al visitante
 */

class BreathingWidget {
  constructor() {
    this.container = document.getElementById('breathing-widget');
    this.coreCircle = document.getElementById('breath-core');
    this.phaseText = document.getElementById('breath-phase');
    this.timerText = document.getElementById('breath-timer');
    this.startBtn = document.getElementById('btn-toggle-breath');
    
    this.isRunning = false;
    this.interval = null;
    this.currentSeconds = 0;
    this.phase = 'idle'; // 'inhale', 'hold', 'exhale'

    this.init();
  }

  init() {
    if (!this.startBtn) return;
    this.startBtn.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.startBtn.textContent = 'Pausar ejercicio';
    this.startBtn.classList.remove('btn-secondary');
    this.startBtn.classList.add('btn-ghost');
    this.runCycle();
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.phase = 'idle';
    if (this.coreCircle) {
      this.coreCircle.className = 'breathing-core-circle';
    }
    if (this.phaseText) this.phaseText.textContent = 'Respira con calma';
    if (this.timerText) this.timerText.textContent = '4-7-8';
    this.startBtn.textContent = 'Iniciar respiración guiada';
    this.startBtn.classList.remove('btn-ghost');
    this.startBtn.classList.add('btn-secondary');
  }

  runCycle() {
    // Fase 1: Inhala (4 segundos)
    this.phase = 'inhale';
    this.currentSeconds = 4;
    this.updateUI('Inhala suavemente...', this.currentSeconds, 'inhale');

    this.interval = setInterval(() => {
      this.currentSeconds--;

      if (this.currentSeconds > 0) {
        this.timerText.textContent = this.currentSeconds;
      } else {
        clearInterval(this.interval);
        // Fase 2: Sostén (7 segundos)
        this.runHold();
      }
    }, 1000);
  }

  runHold() {
    this.phase = 'hold';
    this.currentSeconds = 7;
    this.updateUI('Sostén el aire...', this.currentSeconds, 'hold');

    this.interval = setInterval(() => {
      this.currentSeconds--;

      if (this.currentSeconds > 0) {
        this.timerText.textContent = this.currentSeconds;
      } else {
        clearInterval(this.interval);
        // Fase 3: Exhala (8 segundos)
        this.runExhale();
      }
    }, 1000);
  }

  runExhale() {
    this.phase = 'exhale';
    this.currentSeconds = 8;
    this.updateUI('Exhala despacio...', this.currentSeconds, 'exhale');

    this.interval = setInterval(() => {
      this.currentSeconds--;

      if (this.currentSeconds > 0) {
        this.timerText.textContent = this.currentSeconds;
      } else {
        clearInterval(this.interval);
        // Repetir ciclo si sigue activo
        if (this.isRunning) {
          this.runCycle();
        }
      }
    }, 1000);
  }

  updateUI(phaseName, seconds, className) {
    if (this.phaseText) this.phaseText.textContent = phaseName;
    if (this.timerText) this.timerText.textContent = seconds;
    if (this.coreCircle) {
      this.coreCircle.className = `breathing-core-circle ${className}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.breathingWidget = new BreathingWidget();
});
