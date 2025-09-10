class SafetyCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
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
        this.startAutoSlide();
    }

    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'safety-indicator-dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(dot);
        }
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        let startX = 0;
        let endX = 0;

        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Pause auto-slide on hover
        this.slidesContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.slidesContainer.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Update navigation buttons
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
        
        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.safety-indicator-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update counter
        this.counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 8000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    resetAutoSlide() {
        this.pauseAutoSlide();
        this.startAutoSlide();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SafetyCarousel();
});
