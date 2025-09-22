// Funcionalidades interactivas del curso
(function() {
  'use strict';
  
  let currentView = null;
  let isLoading = false;
  let requestParallaxUpdate;
  let clickedViews = new Set(); // 🔥 almacenar qué vistas ya se clicaron
  
  const imageContainers = document.querySelectorAll('.image-container');
  const infoContents = document.querySelectorAll('.info-content');
  const learnMoreBtn = document.getElementById('learn-more');
  const nextLessonBtn = document.getElementById('next-lesson');
  const infoPanel = document.querySelector('.info-panel');
  const msgPanel = document.getElementById('msgPanel'); // 🔥 panel para mensajes
  const btnContinuar = document.getElementById('btnContinuar');
  
  function init() {
    // ocultar info al inicio
    infoContents.forEach(content => content.classList.add('hidden'));
    
    // mostrar mensaje inicial
    if (msgPanel) {
      msgPanel.textContent = "Haz clic en una opción para continuar...";
    }
    
    // si ya se desbloqueó continuar antes (persistente)
    if (localStorage.getItem('continuarDesbloqueado') === 'true') {
      mostrarContinuar();
    }
    
    setupImageContainers();
    setupButtons();
    addInteractiveEffects();
    injectAnimations();
  }
  
  function setupImageContainers() {
    imageContainers.forEach(container => {
      container.addEventListener('click', handleImageClick);
      container.addEventListener('mouseenter', handleImageHover);
      container.addEventListener('mouseleave', handleImageLeave);
    });
  }
  
  function handleImageClick(event) {
    if (isLoading) return;
    const clickedContainer = event.currentTarget;
    const type = clickedContainer.getAttribute('data-type');
    if (type === currentView) return;
    
    updateActiveContainer(clickedContainer);
    currentView = type;
    updateInfoPanel();
    addClickEffect(clickedContainer);
    
    // registrar vista clickeada
    clickedViews.add(type);
    checkContinuar();
  }
  
  function updateActiveContainer(activeContainer) {
    imageContainers.forEach(container => {
      container.classList.remove('active');
    });
    activeContainer.classList.add('active');
  }
  
  function updateInfoPanel() {
    infoContents.forEach(content => content.classList.add('hidden'));
    const targetInfo = document.getElementById(currentView + '-info');
    if (targetInfo) {
      setTimeout(() => {
        targetInfo.classList.remove('hidden');
        targetInfo.classList.add('fade-in');
      }, 150);
    }
  }
  
  function checkContinuar() {
    if (clickedViews.has('camion') && clickedViews.has('grua')) {
      if (!localStorage.getItem('continuarDesbloqueado')) {
        mostrarContinuar();
        localStorage.setItem('continuarDesbloqueado', 'true');
      }
    } else {
      if (msgPanel) {
        msgPanel.textContent = "Explora ambas opciones para continuar.";
      }
    }
  }
  
  function mostrarContinuar() {
    if (btnContinuar) {
      btnContinuar.style.display = "inline-block";
    }
    if (msgPanel) {
      msgPanel.textContent = ""; // limpiar mensaje
    }
  }
  
  function handleImageHover(event) {
    const container = event.currentTarget;
    const placeholder = container.querySelector('.image-placeholder');
    if (placeholder && !container.classList.contains('active')) {
      placeholder.classList.add('hover-scale');
    }
  }
  
  function handleImageLeave(event) {
    const container = event.currentTarget;
    const placeholder = container.querySelector('.image-placeholder');
    if (placeholder) {
      placeholder.classList.remove('hover-scale');
    }
  }
  
  function setupButtons() {
    if (learnMoreBtn) learnMoreBtn.addEventListener('click', handleLearnMore);
    if (nextLessonBtn) nextLessonBtn.addEventListener('click', handleNextLesson);
  }
  
  function handleLearnMore() {
    if (isLoading) return;
    showLoadingState(learnMoreBtn);
    setTimeout(() => {
      hideLoadingState(learnMoreBtn);
      showDetailedInfo();
    }, 1000);
  }
  
  function showDetailedInfo() {
    if (!infoPanel) return;
    const detailsHtml = `
      <div class="detailed-info animated-card">
        <h4>
          Información Adicional - ${currentView === 'camion' ? 'Camión' : 'Grúa Articulada'}
        </h4>
        <div>
          ${currentView === 'camion' ? 
            'El camión base debe tener características específicas para soportar el peso y las fuerzas generadas por la grúa articulada durante su operación. Incluye sistemas de estabilización y puntos de anclaje reforzados.' :
            'La grúa articulada utiliza un sistema hidráulico de alta presión que permite movimientos precisos y controlados. Cada articulación está diseñada para soportar cargas específicas según la extensión del brazo.'
          }
        </div>
        <button class="close-btn">Cerrar</button>
      </div>
    `;
    
    const existingDetails = document.querySelector('.detailed-info');
    if (existingDetails) existingDetails.remove();
    
    infoPanel.insertAdjacentHTML('beforeend', detailsHtml);
    const closeBtn = infoPanel.querySelector('.detailed-info .close-btn');
    closeBtn.addEventListener('click', () => {
      closeBtn.parentElement.classList.add('fade-out');
      setTimeout(() => closeBtn.parentElement.remove(), 400);
    });
  }

  function showLoadingState(button) {
    isLoading = true;
    if (!button) return;
    button.classList.add('loading');
    button.disabled = true;
  }
  
  function hideLoadingState(button) {
    isLoading = false;
    if (!button) return;
    button.classList.remove('loading');
    button.disabled = false;
  }
  
  function addClickEffect(element) {
    element.classList.add('click-bounce');
    setTimeout(() => {
      element.classList.remove('click-bounce');
    }, 300);
  }
  
  function addInteractiveEffects() {
    let ticking = false;
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.main-title, .technical-specs');
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      ticking = false;
    }
    requestParallaxUpdate = function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', requestParallaxUpdate);
    }
    animateTitle();
  }
  
  function animateTitle() {
    const titleElement = document.querySelector('.main-title h1');
    if (!titleElement) return;
    const text = titleElement.textContent;
    titleElement.textContent = '';
    let index = 0;
    const typingSpeed = 50;
    function typeWriter() {
      if (index < text.length) {
        titleElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, typingSpeed);
      }
    }
    setTimeout(typeWriter, 300);
  }
  
  function handleError(event) {
    console.error('Error capturado:', event.message, 'en', event.filename, 'línea', event.lineno);
  }
  window.addEventListener('error', handleError);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.addEventListener('beforeunload', () => {
    if (requestParallaxUpdate) {
      window.removeEventListener('scroll', requestParallaxUpdate);
    }
    window.removeEventListener('error', handleError);
  });
  
  function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .hidden { display: none !important; }
      .hover-scale {
        transition: transform 0.4s ease;
        transform: scale(1.05);
      }
      .click-bounce {
        animation: bounce 0.3s ease;
      }
      @keyframes bounce {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      .fade-in {
        animation: fadeIn 0.6s ease forwards;
      }
      .fade-out {
        animation: fadeOut 0.4s ease forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
      .animated-card {
        background: linear-gradient(135deg, #E5F0F9 0%, #FFFFFF 100%);
        border: 2px solid #031794;
        border-radius: 12px;
        padding: 12px;
        margin-top: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        animation: fadeIn 0.6s ease forwards;
      }
      .animated-card .close-btn {
        background: #ff3b3b;
        color: #fff;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        margin-top: 10px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.3s ease;
      }
      .animated-card .close-btn:hover {
        background: #cc2c2c;
      }
    `;
    document.head.appendChild(style);
  }
  
})();
