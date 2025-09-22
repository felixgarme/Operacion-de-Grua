class SafetyCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.safety-carousel-slide').length;
        this.slidesContainer = document.getElementById('safetySlides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.counter = document.getElementById('counter');
        this.indicatorsContainer = document.getElementById('indicators');
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.updateCarousel();
        this.bindEvents();

        // 👇 Revisamos si ya se desbloqueó antes
        const continuarBtn = document.querySelector('.start-button');
        if (localStorage.getItem("continuarDesbloqueado") === "true") {
            continuarBtn.style.display = "inline-block";
        }
    }
    
    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'safety-indicator-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        let startX = null;
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            if (!startX) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            startX = null;
        });
    }
    
    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Update counter
        this.counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        
        // Update indicators
        document.querySelectorAll('.safety-indicator-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        // 👇 Desbloquear botón si es el último slide
        const continuarBtn = document.querySelector('.start-button');
        if (this.currentSlide === this.totalSlides - 1) {
            continuarBtn.style.display = "inline-block";
            localStorage.setItem("continuarDesbloqueado", "true"); // guardamos estado
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SafetyCarousel();
});
