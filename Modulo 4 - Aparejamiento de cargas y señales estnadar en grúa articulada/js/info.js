// JavaScript con prefijos únicos para evitar conflictos
class DidacticImageInteractive {
    constructor() {
        this.descriptions = {
            '1': {
                title: 'Número de modelo',
                text: ''
            },
            '2': {
                title: 'Número de serie',
                text: 'La combinación de números les permite a los técnicos conocer cuáles son las piezas correctas y entender el equipo antes de revisarlo.'
            },
            '3': {
                title: 'Tipo de mástil',
                text: ''
            },
            '4': {
                title: 'Tipo de combustible',
                text: ''
            },
            '5': {
                title: 'Inclinación trasera',
                text: 'Grados que el mástil se puede retraer hacia atrás, 6 grados en este ejemplo.'
            },
            '6': {
                title: 'Aditamentos',
                text: 'Aditamento instalado, observamos que el desplazador está colocado. Esto significa que la carga puede ser desplazada a la izquierda o a la derecha.'
            },
            '7': {
                title: 'Rodamiento frontal',
                text: 'Sirve para entender el espacio que un montacargas estará ocupando en el entorno de trabajo.'
            },
            '8': {
                title: 'Tamaño de la llanta',
                text: '"Solid" indica un neumático sólido. El tipo de llantas cushion se indicará como "Smooth" o "Treaded". Siempre se deben reemplazar con el mismo tamaño y el mismo tipo de llanta.'
            },
            '9': {
                title: 'Peso total del equipo',
                text: ''
            },
            '10': {
                title: 'Diagrama del montacargas',
                text: `
                    <ul style="text-align: left; padding-left: 16px; margin: 0;">
                        <li>El centro de carga horizontal.</li>
                        <li>El centro de carga vertical.</li>
                        <li>La altura máxima de las cuchillas.</li>
                        <li>La distancia máxima que las cuchillas pueden ser desplazadas de la línea central del montacargas.</li>
                    </ul>

                `
            },
            '11': {
                title: 'Advertencia',
                text: `
                    <ul>
                        <li>Sólo operadores capacitados deben manejar el equipo.</li>
                        <li>Deben haber leído y entendido el manual de operación.</li>
                    </ul>
                `
            }
        };


        this.currentActiveMarker = null;
        this.descriptionPanel = document.getElementById('didacticDescriptionPanel');
        this.descriptionContent = document.getElementById('didacticDescriptionContent');
        
        this.initializeEventListeners();
        this.addPulseEffect();
    }

    initializeEventListeners() {
        const markers = document.querySelectorAll('.didactic-marker');
        
        markers.forEach(marker => {
            marker.addEventListener('mouseenter', (e) => this.handleMarkerHover(e));
            marker.addEventListener('mouseleave', (e) => this.handleMarkerLeave(e));
            marker.addEventListener('click', (e) => this.handleMarkerClick(e));
        });
    }

    handleMarkerHover(event) {
        const markerId = event.target.dataset.info;
        const description = this.descriptions[markerId];
        
        if (description) {
            this.showDescription(description);
            this.setActiveMarker(event.target);
            event.target.classList.remove('pulse');
        }
    }

    handleMarkerLeave(event) {
        if (this.currentActiveMarker === event.target) {
            this.showDefaultMessage();
            this.clearActiveMarker();
            event.target.classList.add('pulse');
        }
    }

    handleMarkerClick(event) {
        const markerId = event.target.dataset.info;
        const description = this.descriptions[markerId];
        
        if (description) {
            this.showDescription(description);
            this.setActiveMarker(event.target);
            
            // Efecto visual de clic sin mover el elemento
            event.target.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                event.target.style.filter = '';
            }, 150);
        }
    }

    showDescription(description) {
        this.descriptionPanel.classList.add('updated');

        setTimeout(() => {
            const isCompact = ['10', '11'].includes(this.currentActiveMarker?.dataset.info);
            this.descriptionContent.innerHTML = `
                <div class="didactic-description-title ${isCompact ? 'compact-title' : ''}">${description.title}</div>
                <div class="didactic-description-text ${isCompact ? 'compact-text' : ''}">${description.text}</div>
            `;
            this.descriptionPanel.classList.remove('updated');
        }, 100);
    }


    showDefaultMessage() {
        this.descriptionContent.innerHTML = `
            <div class="didactic-default-message">Pasa el cursor sobre los números para ver la información</div>
        `;
    }

    setActiveMarker(marker) {
        this.clearActiveMarker();
        this.currentActiveMarker = marker;
        marker.classList.add('active');
    }

    clearActiveMarker() {
        if (this.currentActiveMarker) {
            this.currentActiveMarker.classList.remove('active');
            this.currentActiveMarker = null;
        }
    }

    addPulseEffect() {
        const markers = document.querySelectorAll('.didactic-marker');
        markers.forEach(marker => {
            marker.classList.add('pulse');
        });
    }

    // Método público para actualizar descripciones
    updateDescriptions(newDescriptions) {
        this.descriptions = { ...this.descriptions, ...newDescriptions };
    }

    // Método público para añadir nuevos marcadores
    addMarker(id, position, number, description) {
        const container = document.getElementById('didacticImageContainer');
        const marker = document.createElement('div');
        
        marker.className = 'didactic-marker pulse';
        marker.id = `didacticMarker${id}`;
        marker.dataset.info = id;
        marker.style.top = position.top;
        marker.style.left = position.left;
        marker.textContent = number;
        
        container.appendChild(marker);
        
        this.descriptions[id] = description;
        
        // Añadir event listeners al nuevo marcador
        marker.addEventListener('mouseenter', (e) => this.handleMarkerHover(e));
        marker.addEventListener('mouseleave', (e) => this.handleMarkerLeave(e));
        marker.addEventListener('click', (e) => this.handleMarkerClick(e));
    }
}

// Inicializar el componente cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.didacticImageInteractive = new DidacticImageInteractive();
});

// Ejemplo de uso de la API pública:
// window.didacticImageInteractive.updateDescriptions({
//     '1': { title: 'Nuevo Título', text: 'Nueva descripción' }
// });

// window.didacticImageInteractive.addMarker('6', 
//     { top: '50%', left: '50%' }, 
//     '6', 
//     { title: 'Nuevo Punto', text: 'Nueva descripción del punto 6' }
// );