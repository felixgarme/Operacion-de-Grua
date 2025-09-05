class CustomAudioPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.audioToggle = document.getElementById('audioToggle');
        this.audioControls = document.getElementById('audioControls');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.volumeToggle = document.getElementById('volumeToggle');
        this.speedBtn = document.getElementById('speedBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeFill = document.getElementById('volumeFill');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.audioInfo = document.getElementById('audioInfo');

        this.isControlsVisible = false;
        this.currentSpeed = 1;
        this.speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        this.speedIndex = 2; // 1x por defecto

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.audioPlayer.volume = 0.8;
        this.updateVolumeDisplay();

        // Auto-play si está configurado
        if (this.audioPlayer.hasAttribute('autoplay')) {
            this.audioPlayer.play().catch(e => {
                // console.log('Autoplay bloqueado:', e);
            });
        }
    }

    setupEventListeners() {
        // Toggle de controles
        this.audioToggle.addEventListener('click', () => this.toggleControls());

        // Cerrar controles al hacer clic fuera
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Controles de reproducción
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.audioToggle.addEventListener('dblclick', () => this.togglePlayPause());

        // Control de volumen
        this.volumeToggle.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));

        // Control de velocidad
        this.speedBtn.addEventListener('click', () => this.cycleSpeed());

        // Barra de progreso
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));

        // Eventos del audio
        this.audioPlayer.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.audioPlayer.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audioPlayer.addEventListener('play', () => this.onPlay());
        this.audioPlayer.addEventListener('pause', () => this.onPause());
        this.audioPlayer.addEventListener('ended', () => this.onEnded());
        this.audioPlayer.addEventListener('loadstart', () => this.onLoadStart());
        this.audioPlayer.addEventListener('canplay', () => this.onCanPlay());
    }

    onLoadedMetadata() {
        // Mostrar la duración total cuando se cargan los metadatos
        this.durationDisplay.textContent = this.formatTime(this.audioPlayer.duration);
        this.updateVolumeIcon();
    }

    onLoadStart() {
        // Mostrar estado de carga
        this.audioInfo.textContent = 'Cargando...';
        this.durationDisplay.textContent = '0:00';
    }

    onCanPlay() {
        // Limpiar mensaje de carga cuando esté listo para reproducir
        this.audioInfo.textContent = '';
        // Asegurar que la duración se muestre correctamente
        if (this.audioPlayer.duration && !isNaN(this.audioPlayer.duration)) {
            this.durationDisplay.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    toggleControls() {
        this.isControlsVisible = !this.isControlsVisible;
        this.audioControls.classList.toggle('show', this.isControlsVisible);
    }

    handleOutsideClick(e) {
        if (!this.audioToggle.contains(e.target) && !this.audioControls.contains(e.target)) {
            this.isControlsVisible = false;
            this.audioControls.classList.remove('show');
        }
    }

    togglePlayPause() {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }

    toggleMute() {
        this.audioPlayer.muted = !this.audioPlayer.muted;
        this.updateVolumeIcon();
    }

    setVolume(e) {
        const rect = this.volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const volume = Math.max(0, Math.min(1, clickX / rect.width));
        this.audioPlayer.volume = volume;
        this.audioPlayer.muted = false;
        this.updateVolumeDisplay();
        this.updateVolumeIcon();
    }

    cycleSpeed() {
        this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
        this.currentSpeed = this.speeds[this.speedIndex];
        this.audioPlayer.playbackRate = this.currentSpeed;
        this.speedDisplay.textContent = this.currentSpeed + 'x';
    }

    setProgress(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audioPlayer.duration;
        this.audioPlayer.currentTime = newTime;
    }

    updateVolumeDisplay() {
        const volume = this.audioPlayer.muted ? 0 : this.audioPlayer.volume;
        this.volumeFill.style.width = (volume * 100) + '%';
    }

    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volumeIcon');
        const muteIcon = document.getElementById('muteIcon');

        if (this.audioPlayer.muted || this.audioPlayer.volume === 0) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    onTimeUpdate() {
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressFill.style.width = progress + '%';
        this.currentTimeDisplay.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    onPlay() {
        // Iconos del botón principal
        document.getElementById('togglePlayIcon').style.display = 'none';
        document.getElementById('togglePauseIcon').style.display = 'block';

        // Iconos del botón de control
        document.getElementById('playIcon').style.display = 'none';
        document.getElementById('pauseIcon').style.display = 'block';

        this.audioToggle.classList.add('playing');
    }

    onPause() {
        // Iconos del botón principal
        document.getElementById('togglePlayIcon').style.display = 'block';
        document.getElementById('togglePauseIcon').style.display = 'none';

        // Iconos del botón de control
        document.getElementById('playIcon').style.display = 'block';
        document.getElementById('pauseIcon').style.display = 'none';

        this.audioToggle.classList.remove('playing');
    }

    onEnded() {
        this.onPause();
        this.progressFill.style.width = '0%';
        this.currentTimeDisplay.textContent = '0:00';
    }
}

// Inicializar el reproductor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CustomAudioPlayer();
});

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todos los elementos con clase fade-in
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Activar animaciones del hero inmediatamente
    setTimeout(() => {
        document.querySelectorAll('.hero-section .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
});

// Animación adicional para las líneas del documento
const docLines = document.querySelectorAll('.doc-line');
docLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.2}s`;
});


document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('effectiveness-slider');
    const levels = document.querySelectorAll('.control-level');

    // Mapeo de los umbrales del slider para cada nivel.
    // El slider va de 0 (abajo) a 100 (arriba).
    // Nivel 0 (Eliminación) se muestra si el valor es >= 80.
    // Nivel 1 (Sustitución) se muestra si el valor es >= 60, etc.
    // Los niveles están en orden inverso en el array de umbrales.
    const thresholds = [80, 60, 40, 20, 0];

    function updateVisibility() {
        const sliderValue = parseInt(slider.value);

        levels.forEach((level, index) => {
            // Comprueba si el valor del slider es mayor o igual al umbral para este nivel.
            if (sliderValue >= thresholds[index]) {
                level.classList.add('visible');
            } else {
                level.classList.remove('visible');
            }
        });
    }

    // Llama a la función cuando el slider se mueve.
    slider.addEventListener('input', updateVisibility);

    // Llama a la función una vez al cargar la página para establecer el estado inicial.
    // Como el valor del slider es 0, solo se mostrará el nivel con umbral 0 (EPP).
    updateVisibility();
    setupContinueSection();
});


// Continue section functionality
function setupContinueSection() {
    const continueSection = document.getElementById('continueSection');
    const footer = document.querySelector('.page-end-trigger');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                continueSection.classList.add('visible');
            } else {
                continueSection.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.5 // Aparece cuando el 50% del footer es visible
    });

    observer.observe(footer);
}

document.getElementById('descargar-ats').addEventListener('click', function () {
    const enlace = document.createElement('a');
    enlace.href = '../assets/pdf/ATS.pdf'; // Reemplaza esto con la ruta real de tu archivo
    enlace.download = 'ATS.pdf'; // Este será el nombre del archivo al descargarse
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
});