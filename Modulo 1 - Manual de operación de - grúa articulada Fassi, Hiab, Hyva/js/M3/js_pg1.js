
let currentSection = 'importancia';

function showSection(sectionId) {
// Ocultar todas las secciones
const sections = document.querySelectorAll('.section');
sections.forEach(section => section.classList.remove('active'));

// Mostrar la sección seleccionada
document.getElementById(sectionId).classList.add('active');

// Actualizar navegación
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => item.classList.remove('active'));
event.target.classList.add('active');

currentSection = sectionId;

// Cerrar menú móvil si está abierto
closeMobileMenu();
}

function toggleMobileMenu() {
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.mobile-overlay');
sidebar.classList.toggle('open');
overlay.classList.toggle('open');
}

function closeMobileMenu() {
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.mobile-overlay');
sidebar.classList.remove('open');
overlay.classList.remove('open');
}

function updateProgress() {
const checkboxes = document.querySelectorAll('.inspection-checkbox');
const totalItems = checkboxes.length;
let completedItems = 0;
let completedList = [];

checkboxes.forEach((checkbox, index) => {
    const listItem = checkbox.closest('.inspection-item');
    const text = checkbox.nextElementSibling.textContent;
    
    if (checkbox.checked) {
    completedItems++;
    listItem.classList.add('completed');
    completedList.push(text);
    } else {
    listItem.classList.remove('completed');
    }
});

const percentage = Math.round((completedItems / totalItems) * 100);

// Actualizar barra de progreso
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const completedItemsDiv = document.getElementById('completedItems');

progressFill.style.width = percentage + '%';
progressText.textContent = `${percentage}% completado (${completedItems} de ${totalItems} elementos)`;

// Actualizar lista de elementos completados
if (completedList.length === 0) {
    completedItemsDiv.textContent = 'No hay elementos completados aún.';
} else {
    completedItemsDiv.innerHTML = '<ul style="list-style: disc; padding-left: 20px; color: #4D4D4E;">' + 
    completedList.map(item => `<li style="margin: 5px 0; font-size: 0.9rem;">${item}</li>`).join('') + 
    '</ul>';
}
}

// Inicializar progreso al cargar la página
document.addEventListener('DOMContentLoaded', function() {
updateProgress();
});
