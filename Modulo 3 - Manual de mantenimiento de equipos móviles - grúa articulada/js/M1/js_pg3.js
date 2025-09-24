

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================================= //
    // FUNCIONALIDAD DE EXPANSIÓN DE SECCIONES                      //
    // ============================================================= //
    const segIndSecciones = document.querySelectorAll('.seg-ind-seccion-card');
    
    segIndSecciones.forEach(seccion => {
        seccion.addEventListener('click', function() {
            const isActive = this.classList.contains('seg-ind-active');
            
            // Cerrar todas las secciones
            segIndSecciones.forEach(s => s.classList.remove('seg-ind-active'));
            
            // Abrir la sección clickeada si no estaba activa
            if (!isActive) {
                this.classList.add('seg-ind-active');
            }
        });
    });

    // ============================================================= //
    // FUNCIONALIDAD DEL QUIZ INTERACTIVO                           //
    // ============================================================= //
    const segIndQuizButtons = document.querySelectorAll('.seg-ind-quiz-button');
    const segIndQuizResult = document.getElementById('seg-ind-quiz-result');
    
    segIndQuizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answer = this.getAttribute('data-answer');
            
            // Deshabilitar botones temporalmente
            segIndQuizButtons.forEach(btn => {
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            });
            
            // Mostrar resultado
            segIndQuizResult.style.display = 'block';
            
            if (answer === 'correct') {
                segIndQuizResult.textContent = 'Correcto! Las etiquetas de seguridad son fundamentales para la prevención.';
                segIndQuizResult.className = 'seg-ind-quiz-result seg-ind-correct';
                this.style.opacity = '1';
                this.style.background = '#031794';
                this.style.color = '#FFFFFF';
            } else {
                segIndQuizResult.textContent = 'Incorrecto. Las etiquetas tienen un propósito de seguridad vital.';
                segIndQuizResult.className = 'seg-ind-quiz-result seg-ind-incorrect';
                this.style.opacity = '1';
                this.style.background = '#FF0000';
                this.style.color = '#FFFFFF';
            }
            
            // Reiniciar botones después de 3 segundos
            setTimeout(() => {
                segIndQuizButtons.forEach(btn => {
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    btn.style.background = '#FFFFFF';
                    btn.style.color = '#031794';
                });
                segIndQuizResult.style.display = 'none';
            }, 3000);
        });
    });

    // ============================================================= //
    // EFECTOS DE ANIMACIÓN PARA ELEMENTOS EPP                      //
    // ============================================================= //
    const segIndEppItems = document.querySelectorAll('.seg-ind-epp-item');
    segIndEppItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'seg-ind-fadeIn 0.5s ease forwards';
        }, index * 100);
    });

    // ============================================================= //
    // EFECTOS DE CLICK PARA DISPOSITIVOS                           //
    // ============================================================= //
    const segIndDispositivoItems = document.querySelectorAll('.seg-ind-dispositivo-item');
    segIndDispositivoItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ============================================================= //
    // INICIALIZACIÓN: ABRIR PRIMERA SECCIÓN POR DEFECTO            //
    // ============================================================= //
    if (segIndSecciones.length > 0) {
        segIndSecciones[0].classList.add('seg-ind-active');
    }
    
});
