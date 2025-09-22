
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const items = Array.from(document.querySelectorAll('.course-slide-item'));
    const startBtn = document.querySelector('.start-button');
    const state = new Map();
    items.forEach(item => state.set(item, { read: false }));

    function markRead(item) {
      const s = state.get(item);
      if (!s.read) {
        s.read = true;
        item.classList.add('read');
        checkAllRead();
      }
    }

    function checkAllRead() {
      const allRead = Array.from(state.values()).every(v => v.read);
      if (allRead) {
        if (startBtn) startBtn.classList.add('show');
        launchConfetti();
      }
    }

    items.forEach(item => {
      const title = item.querySelector('.course-slide-item-title');
      const content = item.querySelector('.course-slide-item-content');

      // handleOpen: ejecuta la lógica de marcado
      function handleOpen() {
        if (state.get(item).read) return;

        // fuerza recálculo del tamaño luego de abrir la tarjeta
        const needsScroll = content.scrollHeight > content.clientHeight + 2;

        if (!needsScroll) {
          // si no necesita scroll, marcar como leído tras un breve retardo (ver animación)
          setTimeout(() => markRead(item), 600);
          return;
        }

        // si necesita scroll, permitir que el usuario lo haga (escuchar evento)
        function onScroll() {
          if (content.scrollTop + content.clientHeight >= content.scrollHeight - 2) {
            content.removeEventListener('scroll', onScroll);
            clearTimeout(fallback);
            markRead(item);
          }
        }
        content.addEventListener('scroll', onScroll, { passive: true });

        // fallback: marcar después de 6s si el usuario no llega al final (configurable)
        const fallback = setTimeout(() => {
          content.removeEventListener('scroll', onScroll);
          markRead(item);
        }, 6000);
      }

      // conectar con el botón/toggle (es posible que otro script cambie la clase 'open')
      title.addEventListener('click', () => {
        // esperar que la clase 'open' sea aplicada por el toggle previo
        setTimeout(() => {
          if (item.classList.contains('open')) {
            handleOpen();
          }
        }, 140);
      });

      // soportar teclado (Enter/Space)
      title.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setTimeout(() => {
            if (item.classList.contains('open')) handleOpen();
          }, 140);
        }
      });

      // si ya viene abierto al cargar, iniciar verificación
      if (item.classList.contains('open')) {
        setTimeout(() => handleOpen(), 200);
      }
    });

    // Confetti simple en canvas (3s)
    function launchConfetti() {
      if (document.body.dataset.confettiLaunched === 'true') return;
      document.body.dataset.confettiLaunched = 'true';

      const duration = 3000;
      const canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff6b6b', '#4cc9f0'];
      const particles = [];
      const particleCount = Math.floor(window.innerWidth / 8);

      function rand(min, max){ return Math.random()*(max-min)+min; }

      for (let i=0;i<particleCount;i++){
        particles.push({
          x: rand(0, canvas.width),
          y: rand(-canvas.height*0.2, 0),
          w: rand(6,12),
          h: rand(8,16),
          angle: rand(0, Math.PI*2),
          color: colors[Math.floor(rand(0, colors.length))],
          vx: rand(-2,2),
          vy: rand(2,6),
          av: rand(-0.1,0.1)
        });
      }

      let start = null;
      function frame(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy + Math.sin(p.angle)*0.3;
          p.angle += p.av;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
          ctx.restore();
        });
        // remove offscreen
        for (let i=particles.length-1;i>=0;i--){
          if (particles[i].y > canvas.height + 20) particles.splice(i,1);
        }
        if (elapsed < duration) {
          requestAnimationFrame(frame);
        } else {
          // fade out
          const fadeStart = performance.now();
          (function fade(now){
            const fElapsed = now - fadeStart;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.globalAlpha = 1 - Math.min(1, fElapsed/600);
            particles.forEach(p => {
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.angle);
              ctx.fillStyle = p.color;
              ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
              ctx.restore();
            });
            ctx.globalAlpha = 1;
            if (fElapsed < 600) requestAnimationFrame(fade);
            else canvas.remove();
          })(performance.now());
        }
      }
      requestAnimationFrame(frame);
      function onResize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      window.addEventListener('resize', onResize);
      setTimeout(()=> window.removeEventListener('resize', onResize), duration+1000);
    }

    // No sobrescribir goToNextPage si existe
    if (typeof window.goToNextPage !== 'function') {
      window.goToNextPage = function(){
        alert('Continuando a la siguiente página (reemplaza goToNextPage con tu navegación real).');
      };
    }
  });
})();
