
class SafetyCourse {
    constructor() {
        this.items = document.querySelectorAll('.safety-course-item');
        this.detailsPanel = document.getElementById('safetyDetails');
        this.activeItem = null;
        this.itemDetails = {
            '1': {
                title: 'Etiquetas de advertencia',
                content: 'Las etiquetas de advertencia proporcionan información crítica sobre peligros potenciales y procedimientos de seguridad. Deben ser visibles, legibles y estar ubicadas estratégicamente en la máquina.'
            },
            '2': {
                title: 'Sistema contra incendios',
                content: 'Sistema de prevención y extinción de incendios que incluye detectores de humo, rociadores automáticos y extintores portátiles ubicados en puntos estratégicos de la máquina.'
            },
            '3': {
                title: 'Cinturón de seguridad',
                content: 'Dispositivo de retención personal que mantiene al operador seguro en su posición de trabajo, especialmente importante en máquinas elevadas o móviles.'
            },
            '4': {
                title: 'Etiquetado y bloqueo',
                content: 'Procedimiento LOTO (Lockout/Tagout) que asegura que la máquina esté completamente desactivada durante el mantenimiento, usando etiquetas y candados de seguridad.'
            },
            '5': {
                title: 'Alarma de retroceso',
                content: 'Sistema de alerta sonora y/o visual que advierte a las personas cercanas cuando la máquina se mueve en reversa, previniendo accidentes por atropellamiento.'
            },
            '6': {
                title: 'Luces de trabajo',
                content: 'Sistema de iluminación que garantiza visibilidad adecuada en el área de operación, incluyendo luces LED de alta eficiencia y luces de emergencia.'
            },
            '7': {
                title: 'Pisos antideslizante',
                content: 'Superficies texturizadas o con recubrimientos especiales que proporcionan tracción segura para prevenir caídas y resbalones del operador.'
            },
            '8': {
                title: 'Estribos',
                content: 'Escalones y plataformas de acceso seguro a la máquina, diseñados con materiales antideslizantes y dimensiones ergonómicas adecuadas.'
            },
            '9': {
                title: 'Pasamanos',
                content: 'Barreras de protección instaladas en plataformas, escaleras y áreas elevadas para prevenir caídas y proporcionar apoyo al operador.'
            },
            '10': {
                title: 'Controles y medidores',
                content: 'Panel de instrumentos que monitorea el estado de la máquina, incluyendo medidores de presión, temperatura, velocidad y sistemas de control de seguridad.'
            },
            'op-1': {
                title: 'El Operador',
                content: 'Factor humano crítico en la seguridad. Requiere capacitación adecuada, certificaciones vigentes, conocimiento de procedimientos y uso correcto del equipo de protección personal.'
            },
            'op-2': {
                title: 'La máquina',
                content: 'Condición mecánica y estado de mantenimiento de la máquina. Incluye el funcionamiento correcto de todos los sistemas de seguridad y componentes críticos.'
            },
            'op-3': {
                title: 'El área de trabajo',
                content: 'Condiciones ambientales y del entorno de trabajo, incluyendo visibilidad, terreno, clima, presencia de otros trabajadores y obstáculos potenciales.'
            },
            'sec-1': {
                title: 'Tormentas eléctricas',
                content: 'Riesgo de rayos en máquinas con componentes metálicos altos. Requiere procedimientos de evacuación y refugio seguro hasta que pase la tormenta.'
            },
            'sec-2': {
                title: 'Explosión de neumáticos',
                content: 'Riesgo de explosión por sobrepresión o daño en neumáticos de gran tamaño. Requiere inspección regular, presión correcta y procedimientos seguros de mantenimiento.'
            },
            'sec-3': {
                title: 'Volcadura y colisión',
                content: 'Riesgo de accidentes por pérdida de estabilidad o impacto con obstáculos. Requiere operación a velocidad segura, uso de cinturón y conocimiento del terreno.'
            }
        };
        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleItemClick(e.currentTarget);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleItemClick(e.currentTarget);
                }
            });
            item.setAttribute('tabindex', '0');
        });
    }

    handleItemClick(item) {
        const itemId = item.getAttribute('data-item');
        if (this.activeItem) {
            this.activeItem.classList.remove('active');
        }
        item.classList.add('active');
        this.activeItem = item;
        this.updateDetailsPanel(itemId);
        this.scrollToDetails();
    }

    updateDetailsPanel(itemId) {
        const details = this.itemDetails[itemId];
        if (details) {
            const titleElement = this.detailsPanel.querySelector('.safety-course-details-title');
            const contentElement = this.detailsPanel.querySelector('.safety-course-details-content');
            titleElement.textContent = details.title;
            contentElement.textContent = details.content;
            this.detailsPanel.style.background = '#E5F0F9';
            this.detailsPanel.style.borderColor = '#031794';
        }
    }

    scrollToDetails() {
        if (window.innerWidth <= 767) {
            this.detailsPanel.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    reset() {
        if (this.activeItem) {
            this.activeItem.classList.remove('active');
            this.activeItem = null;
        }
        const titleElement = this.detailsPanel.querySelector('.safety-course-details-title');
        const contentElement = this.detailsPanel.querySelector('.safety-course-details-content');
        titleElement.textContent = 'Selecciona un elemento para ver más información';
        contentElement.textContent = 'Haz clic en cualquier elemento de la lista para conocer más detalles sobre ese dispositivo o factor de seguridad.';
        this.detailsPanel.style.background = '#FFFFFF';
        this.detailsPanel.style.borderColor = '#DDE8F5';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const safetyCourse = new SafetyCourse();
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && safetyCourse.activeItem) {
            safetyCourse.detailsPanel.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });
});
