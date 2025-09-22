
let currentSection = 0;
const totalSections = 6;

function updateProgress() {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const percentage = ((currentSection + 1) / totalSections) * 100;
  
  progressBar.style.width = percentage + '%';
  progressText.textContent = `${currentSection + 1}/${totalSections}`;
}

function updateButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.disabled = currentSection === 0;
  nextBtn.disabled = currentSection === totalSections - 1;
  
  if (currentSection === totalSections - 1) {
    nextBtn.textContent = 'Completado';
  } else {
    nextBtn.textContent = 'Siguiente';
  }
}

function updateSectionIndicators() {
  const indicators = document.querySelectorAll('.section-indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSection);
  });
}

function showSection(sectionIndex) {
  const sections = document.querySelectorAll('.content-section');
  
  sections.forEach((section, index) => {
    if (index === sectionIndex) {
      section.style.display = 'block';
      section.classList.add('fade-in');
      setTimeout(() => {
        section.classList.remove('fade-in');
      }, 500);
    } else {
      section.style.display = 'none';
    }
  });
  
  currentSection = sectionIndex;
  updateProgress();
  updateButtons();
  updateSectionIndicators();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextSection() {
  if (currentSection < totalSections - 1) {
    showSection(currentSection + 1);
  }
}

function prevSection() {
  if (currentSection > 0) {
    showSection(currentSection - 1);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showSection(0);
  
  document.getElementById('nextBtn').addEventListener('click', nextSection);
  document.getElementById('prevBtn').addEventListener('click', prevSection);
  
  document.querySelectorAll('.section-indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSection(index);
    });
  });
  
  document.getElementById('mobileMenu').addEventListener('click', function() {
    const indicators = document.querySelector('.header-section').lastElementChild;
    indicators.style.display = indicators.style.display === 'none' ? 'block' : 'none';
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSection();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSection();
    }
  });
  
  let startY = 0;
  let endY = 0;
  
  document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchend', function(e) {
    endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        nextSection();
      } else {
        prevSection();
      }
    }
  });
  
  const cards = document.querySelectorAll('.content-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    observer.observe(card);
  });
});
