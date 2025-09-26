// ../../js/components/audio-player.js
class AudioPlayer extends HTMLElement {
  static get observedAttributes() { return ['src', 'preload', 'autoplay', 'css']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // plantilla base (sin <link> para la hoja externa — la añadimos en connectedCallback)
    this.shadowRoot.innerHTML = `
      <style>
        /* estilos mínimos/fallback — la hoja externa main_ex.css puede sobrescribirlos */
        :host { display:inline-block; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .audio-player-container{
          box-sizing: border-box;
          background: #fff;
          border-radius: 10px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          width: 320px;
          max-width: 100%;
        }
        .play-pause-btn{ width:40px;height:40px;border-radius:8px;border:none;background:transparent;cursor:pointer; display:flex;align-items:center;justify-content:center;padding:0;}
        svg{width:22px;height:22px;pointer-events:none}
        .expanded-controls{ display:flex;flex-direction:column;flex:1;gap:8px; }
        .progress-bar{ height:8px;background:#e6eef9;border-radius:8px;position:relative;overflow:hidden;cursor:pointer }
        .progress-fill{ height:100%;width:0%;background:#031794;position:relative }
        .progress-thumb{ position:absolute;right:0;top:50%;transform:translate(50%,-50%);width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid #031794;box-shadow:0 1px 3px rgba(0,0,0,0.15)}
        .volume-control{ display:flex;align-items:center;gap:8px }
        .volume-slider{ width:70px;height:6px;background:#f1f3f6;border-radius:6px;position:relative;cursor:pointer }
        .volume-fill{ height:100%;width:100%;background:#031794 }
        .close-btn{ background:transparent;border:none;cursor:pointer;padding:6px }

        @media (max-width:420px){ .audio-player-container{ width:100% } }
      </style>

      <div class="audio-player-container" part="container">
        <button class="play-pause-btn" aria-label="Play/Pause" part="play-btn">
          <svg id="playIcon" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
          <svg id="pauseIcon" viewBox="0 0 24 24" style="display:none"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>

        <div class="expanded-controls" part="controls">
          <div class="progress-container" part="progress-wrap">
            <div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="progress-fill" id="progressFill">
                <div class="progress-thumb" id="progressThumb"></div>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="volume-control" part="volume">
              <button class="volume-btn" id="volumeToggle" aria-label="Toggle mute">
                <svg id="volumeIcon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
              </button>
              <div class="volume-slider" id="volumeSlider" aria-label="Volume control">
                <div class="volume-fill" id="volumeFill" style="width:100%"></div>
              </div>
            </div>

            <button class="close-btn" id="closeBtn" aria-label="Close player">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        <audio id="audio" preload="metadata"></audio>
      </div>
    `;

    // refs
    this.$ = {
      playBtn: this.shadowRoot.querySelector('.play-pause-btn'),
      playIcon: this.shadowRoot.getElementById('playIcon'),
      pauseIcon: this.shadowRoot.getElementById('pauseIcon'),
      progressBar: this.shadowRoot.getElementById('progressBar'),
      progressFill: this.shadowRoot.getElementById('progressFill'),
      progressThumb: this.shadowRoot.getElementById('progressThumb'),
      volumeToggle: this.shadowRoot.getElementById('volumeToggle'),
      volumeSlider: this.shadowRoot.getElementById('volumeSlider'),
      volumeFill: this.shadowRoot.getElementById('volumeFill'),
      closeBtn: this.shadowRoot.getElementById('closeBtn'),
      audio: this.shadowRoot.getElementById('audio')
    };

    this._isDragging = false;
    this._wasPlayingBeforeSeek = false;
  }

  connectedCallback() {
    // 1) insert hoja de estilos externa dentro del shadow (si existe o por defecto)
    // ruta por defecto root-relative (más segura): '/assets/css/main_ex.css'
    const cssAttr = this.getAttribute('css'); // opcional: <audio-player css="/assets/css/main_ex.css">
    const cssHref = cssAttr ? cssAttr : '../css/main_ex.css';

    // Evitamos duplicados si se conecta varias veces
    if (!this.shadowRoot.querySelector(`link[data-audio-player-css="${cssHref}"]`)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssHref);
      link.setAttribute('data-audio-player-css', cssHref);
      // insertamos al inicio para que pueda ser sobrescrito por <style> adyacente si hace falta
      this.shadowRoot.prepend(link);
    }

    // apply attributes
    if (this.hasAttribute('src')) this.$.audio.src = this.getAttribute('src');
    if (this.hasAttribute('preload')) this.$.audio.preload = this.getAttribute('preload');
    if (this.hasAttribute('autoplay')) this.$.audio.autoplay = true;

    // listeners
    this.$.playBtn.addEventListener('click', ()=> this.togglePlay());
    this.$.audio.addEventListener('timeupdate', ()=> this.updateProgress());
    this.$.audio.addEventListener('loadedmetadata', ()=> this.updateProgress());
    this.$.audio.addEventListener('ended', ()=> this.onEnded());
    this.$.volumeToggle.addEventListener('click', ()=> this.toggleMute());
    this.$.volumeSlider.addEventListener('click', (e)=> this.setVolumeFromEvent(e));
    this.$.progressBar.addEventListener('click', (e)=> this.seekFromEvent(e));
    this.$.progressBar.addEventListener('pointerdown', e => this.startSeek(e));
    document.addEventListener('pointerup', () => this.endSeek());
    document.addEventListener('pointermove', (e)=> this.handlePointerMove(e));
    this.$.closeBtn.addEventListener('click', ()=> this.closePlayer());

    // inicial UI
    this.updatePlayButton();
    this.setVolume(1);
  }

  attributeChangedCallback(name, oldV, newV) {
    if (name==='src' && this.$.audio) this.$.audio.src = newV;
    if (name==='autoplay' && this.$.audio) this.$.audio.autoplay = this.hasAttribute('autoplay');
    if (name==='preload' && this.$.audio) this.$.audio.preload = newV;
    // si cambian css en caliente, actualizamos link
    if (name==='css' && this.shadowRoot) {
      const cssHref = newV || '/assets/css/main_ex.css';
      let existing = this.shadowRoot.querySelector(`link[data-audio-player-css="${cssHref}"]`);
      if (!existing) {
        // remover anteriores
        const oldLinks = this.shadowRoot.querySelectorAll('link[data-audio-player-css]');
        oldLinks.forEach(l => l.remove());
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', cssHref);
        link.setAttribute('data-audio-player-css', cssHref);
        this.shadowRoot.prepend(link);
      }
    }
  }

  /* ---------- behavior methods (igual que tu implementación original) ---------- */
  togglePlay(){ if (this.$.audio.paused) { this.$.audio.play(); } else { this.$.audio.pause(); } this.updatePlayButton(); }
  updatePlayButton(){ if (this.$.audio.paused) { this.$.playIcon.style.display = ''; this.$.pauseIcon.style.display = 'none'; this.$.playBtn.setAttribute('aria-pressed','false'); } else { this.$.playIcon.style.display = 'none'; this.$.pauseIcon.style.display = ''; this.$.playBtn.setAttribute('aria-pressed','true'); } }
  updateProgress(){ if (!this.$.audio.duration || this._isDragging) return; const pct = (this.$.audio.currentTime / this.$.audio.duration) * 100; this.$.progressFill.style.width = pct + '%'; this.$.progressBar.setAttribute('aria-valuenow', String(Math.round(pct))); this.updatePlayButton(); }
  seekFromEvent(e){ const rect = this.$.progressBar.getBoundingClientRect(); const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); this.$.audio.currentTime = x * this.$.audio.duration; this.updateProgress(); }
  startSeek(e){ this._isDragging = true; this._wasPlayingBeforeSeek = !this.$.audio.paused; if (this._wasPlayingBeforeSeek) this.$.audio.pause(); this.handlePointerMove(e); }
  handlePointerMove(e){ if (!this._isDragging) return; const rect = this.$.progressBar.getBoundingClientRect(); const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); this.$.progressFill.style.width = (x*100) + '%'; this.$.progressBar.setAttribute('aria-valuenow', String(Math.round(x*100))); if (this._isDragging && this.$.audio.duration) { this.$.audio.currentTime = x * this.$.audio.duration; } }
  endSeek(){ if (!this._isDragging) return; this._isDragging = false; if (this._wasPlayingBeforeSeek) this.$.audio.play(); this.updatePlayButton(); }
  toggleMute(){ this.$.audio.muted = !this.$.audio.muted; this.$.volumeFill.style.opacity = this.$.audio.muted ? '0.4' : '1'; }
  setVolumeFromEvent(e){ const rect = this.$.volumeSlider.getBoundingClientRect(); const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); this.setVolume(x); }
  setVolume(v){ this.$.audio.volume = v; this.$.volumeFill.style.width = `${v*100}%`; this.$.audio.muted = v === 0; }
  onEnded(){ this.updatePlayButton(); this.dispatchEvent(new CustomEvent('audio-ended', { bubbles:true, composed:true })); }
  closePlayer(){ this.$.audio.pause(); this.style.display = 'none'; this.dispatchEvent(new CustomEvent('audio-closed', { bubbles:true, composed:true })); }
}

customElements.define('audio-player', AudioPlayer);
export default AudioPlayer;
