let currentStep = 1;
const totalSteps = 5;

function showStep(stepNumber) {
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById(`step${i}`);
        // Mostrar todos los pasos hasta el actual
        step.classList.toggle('active', i <= stepNumber);
    }
    const progress = (stepNumber / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('prevBtn').disabled = stepNumber === 1;
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = stepNumber === totalSteps;
    nextBtn.textContent = stepNumber === totalSteps ? '✓ Completado' : 'Siguiente';
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function resetSteps() {
    currentStep = 1;
    showStep(currentStep);
}

function highlightFormula(element) {
    element.style.background = '#e6fffa';
    element.style.borderColor = '#38b2ac';
    element.style.transform = 'scale(1.02)';
    setTimeout(() => {
        element.style.background = '#f7fafc';
        element.style.borderColor = '#e2e8f0';
        element.style.transform = 'scale(1)';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
});
