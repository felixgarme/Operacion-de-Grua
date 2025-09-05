const inspectionData = {
    checklist: {
        title: "Uso de Check-list",
        icon: "📋",
        iconClass: "icon-checklist",
        items: [
            "Seguir una secuencia ordenada para completar la inspección",
            "Verificar que todos los componentes sean inspeccionados",
            "Documentar cualquier anomalía encontrada",
            "Asegurar que no se omita ningún sistema del equipo"
        ]
    },
    visual: {
        title: "Inspección Visual",
        icon: "👁️",
        iconClass: "icon-visual",
        items: [
            "Caminar alrededor del equipo completamente",
            "Revisar componentes de la estructura del equipo",
            "Inspeccionar estado de los neumáticos",
            "Verificar funcionamiento de luces",
            "Comprobar legibilidad de etiquetas de seguridad",
            "Revisar estado general de controles externos"
        ]
    },
    forks: {
        title: "Horquillas y Carruaje (Bastidor)",
        icon: "🔧",
        iconClass: "icon-forks",
        items: [
            "Buscar desviaciones en las horquillas",
            "Verificar ausencia de rajaduras o fisuras",
            "Comprobar que no existan desniveles",
            "Inspeccionar el estado del bastidor",
            "Revisar puntos de soldadura críticos",
            "Verificar alineación correcta de las horquillas"
        ]
    },
    hydraulic: {
        title: "Componentes Hidráulicos",
        icon: "💧",
        iconClass: "icon-hydraulic",
        items: [
            "Inspeccionar mangueras hidráulicas por fugas",
            "Revisar todas las cañerías del sistema",
            "Verificar conexiones hidráulicas",
            "Comprobar funcionamiento del sistema de elevación",
            "Revisar nivel de fluido hidráulico",
            "Inspeccionar cilindros hidráulicos"
        ]
    },
    cabin: {
        title: "Inspección de la Cabina",
        icon: "🚗",
        iconClass: "icon-cabin",
        items: [
            "Ingresar al compartimiento del operador",
            "Verificar funcionamiento de pedales",
            "Comprobar estado de luces interiores",
            "Revisar posición y estado de espejos",
            "Verificar dispositivos de seguridad",
            "Probar funcionamiento de bocinas",
            "Comprobar todos los mandos y controles"
        ]
    }
};

let currentSection = null;
let checkedItems = new Set();
let totalItems = 0;

// Calcular total de items
Object.values(inspectionData).forEach(section => {
    totalItems += section.items.length;
});

function showDetails(sectionKey) {
    const section = inspectionData[sectionKey];
    const panel = document.getElementById('detailsPanel');
    const icon = document.getElementById('detailsIcon');
    const title = document.getElementById('detailsTitle');
    const itemsList = document.getElementById('checklistItems');

    // Actualizar contenido
    icon.textContent = section.icon;
    icon.className = `details-icon ${section.iconClass}`;
    title.textContent = section.title;

    // Crear items de checklist
    itemsList.innerHTML = '';
    section.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'checklist-item';
        const itemId = `${sectionKey}-${index}`;
        const isChecked = checkedItems.has(itemId);
        
        li.innerHTML = `
            <div class="checkbox ${isChecked ? 'checked' : ''}" onclick="toggleCheck('${itemId}', this)"></div>
            <div class="item-text">${item}</div>
        `;
        itemsList.appendChild(li);
    });

    // Mostrar panel
    panel.classList.add('active');
    currentSection = sectionKey;

    // Actualizar tarjetas
    document.querySelectorAll('.inspection-card').forEach(card => {
        if (card.dataset.section === sectionKey) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

function closeDetails() {
    const panel = document.getElementById('detailsPanel');
    panel.classList.remove('active');
    document.querySelectorAll('.inspection-card').forEach(card => {
        card.classList.remove('active');
    });
    currentSection = null;
}

function toggleCheck(itemId, element) {
    if (checkedItems.has(itemId)) {
        checkedItems.delete(itemId);
        element.classList.remove('checked');
    } else {
        checkedItems.add(itemId);
        element.classList.add('checked');
    }
    
    updateProgress();
    checkCompletion();
}

function updateProgress() {
    const progress = (checkedItems.size / totalItems) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Progreso: ${Math.round(progress)}% completado`;
}

function checkCompletion() {
    if (checkedItems.size === totalItems) {
        setTimeout(() => {
            const celebration = document.getElementById('completionCelebration');
            celebration.classList.add('show');
            closeDetails();
        }, 500);
    }
}

// Event listeners para las tarjetas
document.querySelectorAll('.inspection-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.dataset.section;
        showDetails(section);
    });
});

// Efecto de hover mejorado para las tarjetas
document.querySelectorAll('.inspection-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotate(1deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(0) rotate(0deg)';
        }
    });
});

// Cerrar panel con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && currentSection) {
        closeDetails();
    }
});