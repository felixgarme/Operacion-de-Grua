// Variables globales
let checkedItems = 0;
let totalItems = 9;

// Navegación entre secciones
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover active de todos los botones
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        // Agregar active al botón clickeado
        this.classList.add('active');
        
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección correspondiente
        const targetSection = this.getAttribute('data-section');
        document.getElementById(targetSection).classList.add('active');
        
        // Actualizar barra de progreso
        updateProgress();
    });
});

// Funcionalidad del checklist
document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', function() {
        const checkbox = this.querySelector('.checkbox');
        
        if (!checkbox.classList.contains('checked')) {
            checkbox.classList.add('checked');
            checkedItems++;
            
            // Efecto de vibración
            this.style.animation = 'checkPop 0.3s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        } else {
            checkbox.classList.remove('checked');
            checkedItems--;
        }
        
        updateProgress();
    });
});

// Actualizar barra de progreso
function updateProgress() {
    const activeSection = document.querySelector('.content-section.active').id;
    let progress = 0;
    
    if (activeSection === 'area-trabajo') {
        progress = (checkedItems / totalItems) * 50; // 50% para la primera sección
    } else if (activeSection === 'maquina') {
        progress = 50 + 50; // 50% base + 50% por completar la segunda sección
    }
    
    document.getElementById('progressFill').style.width = progress + '%';
}

// Animaciones para las tarjetas
document.querySelectorAll('.inspection-card').forEach(card => {
    card.addEventListener('click', function() {
        // Efecto de click
        this.style.transform = 'translateY(-10px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        }, 100);
        
        // Mostrar información adicional (simulado)
        const cardTitle = this.querySelector('.card-title').textContent;
        showTooltip(`Información detallada sobre: ${cardTitle}`, this);
    });
});

// Función para mostrar tooltip
function showTooltip(message, element) {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        max-width: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease-out;
    `;
    tooltip.textContent = message;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}

// Animaciones de entrada para las tarjetas de puntos
function animatePointCards() {
    const pointCards = document.querySelectorAll('.point-card');
    pointCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideUp 0.8s ease-out';
        }, index * 100);
    });
}

// Observer para animar elementos cuando entran en vista
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('point-card')) {
                entry.target.style.animation = 'slideUp 0.8s ease-out';
            }
        }
    });
});

// Observar elementos
document.querySelectorAll('.point-card, .inspection-card').forEach(el => {
    observer.observe(el);
});

// Inicializar progreso
updateProgress();

// Efecto de partículas en el fondo (opcional)
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: float 6s linear infinite;
        z-index: -1;
    `;
    
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '100vh';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

// Crear partículas cada cierto tiempo
setInterval(createParticle, 2000);