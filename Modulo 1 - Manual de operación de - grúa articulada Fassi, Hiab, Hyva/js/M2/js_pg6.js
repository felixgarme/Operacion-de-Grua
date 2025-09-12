
  class MachineDescriptionComponent {
    constructor() {
      // Keys para localStorage
      this.storageKeySections = 'machine_open_sections_v1';
      this.storageKeyCompleted = 'machine_completed_v1';
      this.storageKeyConfetti = 'machine_confetti_shown_v1';

      this.sectionsOpened = 0;
      this.totalSections = 0;
      this.confettiShown = false;
      this.init();
    }

    init() {
      this.setupEventListeners();
      this.countSections();
      this.restoreState(); // restaura antes de calcular progreso visual
      this.updateProgress();
      this.ensureButtonStateOnLoad();
    }

    setupEventListeners() {
      const headers = document.querySelectorAll('.machine-description-component .section-header');
      headers.forEach(header => {
        header.addEventListener('click', (e) => {
          this.toggleSection(e.currentTarget.parentElement);
        });
      });

      // Asegurar que el botón exista en DOM (estará oculto por CSS hasta completar)
      const startBtn = document.querySelector('.machine-description-component .start-button') ||
                       document.querySelector('.start-button');
      if (startBtn) {
        // por defecto quitar la clase show
        startBtn.classList.remove('show');
        startBtn.disabled = true;
      }
    }

    countSections() {
      this.totalSections = document.querySelectorAll('.machine-description-component .section').length;
    }

    toggleSection(section) {
      const id = this.getSectionId(section);
      const isActive = section.classList.contains('active');

      if (isActive) {
        section.classList.remove('active');
      } else {
        section.classList.add('active');
      }

      // recalculamos la cantidad abierta
      this.sectionsOpened = document.querySelectorAll('.machine-description-component .section.active').length;

      this.updateProgress();
      this.saveState();

      const completedPreviously = this.readCompletedFlag();

      if (this.sectionsOpened === this.totalSections) {
        // Si se completa ahora y antes no estaba completado -> mostrar mensaje, confetti y mostrar botón
        if (!completedPreviously) {
          this.showCompletionMessage();
          this.createConfetti();
          this.saveCompletedFlag(true);
        } else {
          // ya estaba completado anteriormente; solo aseguramos mostrar mensaje y botón
          this.showCompletionMessage();
        }
      } else {
        // Si no se cumple todo, ocultamos mensaje y ocultamos botón
        this.hideCompletionMessage();
        this.saveCompletedFlag(false);
      }
    }

    updateProgress() {
      const progressFill = document.querySelector('.machine-description-component .progress-fill');
      const percentage = this.totalSections === 0 ? 0 : (this.sectionsOpened / this.totalSections) * 100;
      if (progressFill) progressFill.style.width = percentage + '%';
    }

    showCompletionMessage() {
      const message = document.querySelector('.machine-description-component .completion-message');
      if (message) message.classList.add('show');

      const startBtn = document.querySelector('.machine-description-component .start-button') ||
                       document.querySelector('.start-button');
      if (startBtn) {
        // mostrar botón (controlado por CSS)
        startBtn.classList.add('show');
        startBtn.disabled = false;
      }
    }

    hideCompletionMessage() {
      const message = document.querySelector('.machine-description-component .completion-message');
      if (message) message.classList.remove('show');

      const startBtn = document.querySelector('.machine-description-component .start-button') ||
                       document.querySelector('.start-button');
      if (startBtn) {
        startBtn.classList.remove('show');
        startBtn.disabled = true;
      }
    }

    createConfetti() {
      // Evitar crear confetti varias veces en la misma sesión/recarga
      if (this.confettiShown || this.readConfettiFlag()) return;

      const colors = ['#FF0000', '#031794', '#3479F6', '#1F87C6', '#34C0C0'];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.8 + 's';
        confetti.style.animationDuration = (Math.random() * 1.5 + 2) + 's';

        document.body.appendChild(confetti);

        setTimeout(() => {
          if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
        }, 5000);
      }

      this.confettiShown = true;
      this.saveConfettiFlag(true);
    }

    // -------- Persistencia --------
    getSectionId(section, indexFallback = null) {
      return section.getAttribute('data-section') || indexFallback;
    }

    saveState() {
      const sections = Array.from(document.querySelectorAll('.machine-description-component .section'));
      const activeIds = sections.map((sec, idx) => {
        return sec.classList.contains('active') ? (sec.getAttribute('data-section') || `index-${idx}`) : null;
      }).filter(Boolean);

      localStorage.setItem(this.storageKeySections, JSON.stringify(activeIds));
    }

    restoreState() {
      const raw = localStorage.getItem(this.storageKeySections);
      let activeIds = [];
      try {
        activeIds = raw ? JSON.parse(raw) : [];
      } catch (e) {
        activeIds = [];
      }

      const sections = Array.from(document.querySelectorAll('.machine-description-component .section'));
      sections.forEach((sec, idx) => {
        const id = sec.getAttribute('data-section') || `index-${idx}`;
        if (activeIds.includes(id)) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      // recalculamos contador
      this.sectionsOpened = document.querySelectorAll('.machine-description-component .section.active').length;

      // si ya estaba completado antes, mostramos el mensaje y mostramos el botón
      const completed = this.readCompletedFlag();
      if (this.sectionsOpened === this.totalSections && this.totalSections > 0) {
        if (completed) {
          this.showCompletionMessage();
        } else {
          // si todas abiertas pero no marcado completed -> marcamos y mostramos
          this.showCompletionMessage();
          this.saveCompletedFlag(true);
        }
      } else {
        // no todo revisado -> ocultar y ocultar botón
        this.hideCompletionMessage();
      }

      // restaurar progreso visual
      this.updateProgress();
    }

    saveCompletedFlag(value) {
      localStorage.setItem(this.storageKeyCompleted, value ? '1' : '0');
    }

    readCompletedFlag() {
      return localStorage.getItem(this.storageKeyCompleted) === '1';
    }

    saveConfettiFlag(value) {
      localStorage.setItem(this.storageKeyConfetti, value ? '1' : '0');
    }

    readConfettiFlag() {
      return localStorage.getItem(this.storageKeyConfetti) === '1';
    }

    // Asegura el estado del botón al cargar la página
    ensureButtonStateOnLoad() {
      const startBtn = document.querySelector('.machine-description-component .start-button') ||
                       document.querySelector('.start-button');
      const completed = this.readCompletedFlag();
      if (startBtn) {
        if (completed) {
          startBtn.classList.add('show');
          startBtn.disabled = false;
        } else {
          startBtn.classList.remove('show');
          startBtn.disabled = true;
        }
      }

      // no re-lanzamos confetti automáticamente en recargas si ya se mostró antes
    }
  }

  // Inicializar el componente cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new MachineDescriptionComponent();
    });
  } else {
    new MachineDescriptionComponent();
  }

