
let sectionsOpened = new Set();
const totalSections = 3;

function toggleSection(sectionId) {
const content = document.getElementById('content-' + sectionId);
const icon = document.getElementById('icon-' + sectionId);

const isActive = content.classList.contains('active');

if (isActive) {
    content.classList.remove('active');
    icon.classList.remove('active');
    sectionsOpened.delete(sectionId);
} else {
    content.classList.add('active');
    icon.classList.add('active');
    sectionsOpened.add(sectionId);
    
    // Smooth scroll to section
    content.parentElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
    });
}

updateProgress();
}

function updateProgress() {
const progress = (sectionsOpened.size / totalSections) * 100;
document.getElementById('progressFill').style.width = progress + '%';
}

function expandAll() {
const sections = ['maquina', 'area', 'factores'];
sections.forEach(sectionId => {
    const content = document.getElementById('content-' + sectionId);
    const icon = document.getElementById('icon-' + sectionId);
    
    content.classList.add('active');
    icon.classList.add('active');
    sectionsOpened.add(sectionId);
});

updateProgress();
}

function collapseAll() {
const sections = ['maquina', 'area', 'factores'];
sections.forEach(sectionId => {
    const content = document.getElementById('content-' + sectionId);
    const icon = document.getElementById('icon-' + sectionId);
    
    content.classList.remove('active');
    icon.classList.remove('active');
    sectionsOpened.delete(sectionId);
});

updateProgress();
}

function resetProgress() {
collapseAll();
document.querySelector('.curso-container').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
});
}

// Initialize hover effects for factor cards
document.addEventListener('DOMContentLoaded', function() {
const factorCards = document.querySelectorAll('.factor-card');
factorCards.forEach(card => {
    card.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
        this.style.transform = 'scale(1)';
        }, 150);
    }, 100);
    });
});
});
