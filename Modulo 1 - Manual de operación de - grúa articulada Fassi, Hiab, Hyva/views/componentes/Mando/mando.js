
(function () {
    const container = document.getElementById('v3d-joystick');
    const knob = document.getElementById('v3d-joystick-knob');
    const base = document.getElementById('v3d-joystick-base');

    // ---------- CONFIGURACIÓN ----------
    const REPEAT_INTERVAL_MS = 70; // envío repetido mientras se mantiene dirección
    const TURN_TRIGGER_DEG_RIGHT = 360;  // umbral (en grados) para detectar "vultas-derecha"
    const TURN_TRIGGER_DEG_LEFT  = 360;  // umbral (en grados) para detectar "vultas-izquierda"
    const ROTATION_MIN_RADIUS_FACTOR = 0.45; // sólo cuenta rotaciones si el knob está a >= este factor del radio
    const LOCK_THRESHOLD_DEG = 25; // acumulación mínima para entrar en "modo rotación" y bloquear direcciones
    // -----------------------------------

    // métricas dinámicas
    let rect = container.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    let maxRadius = Math.min(rect.width, rect.height) / 2 - 8;
    const deadZone = 10; // px mínimo para considerar movimiento
    let dragging = false;

    // repetición direccional
    let repeatTimer = null;
    let currentRepeatDirection = null;

    // rotación
    let anglePrev = null;      // en radianes (usamos sistema 'y hacia arriba' convirtiendo -dy)
    let angleAccumDeg = 0;     // acumulador en grados
    let rotationMode = false;  // cuando true, bloquea las direcciones y sólo procesa rotación

    function refreshMetrics() {
    rect = container.getBoundingClientRect();
    center.x = rect.width / 2;
    center.y = rect.height / 2;
    maxRadius = Math.min(rect.width, rect.height) / 2 - 8;
    }

    function setKnobPosition(x, y, animate = false) {
    knob.style.transition = animate ? 'transform 0.12s cubic-bezier(.2,.9,.2,1)' : 'transform 0s';
    knob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function toLocalCoords(clientX, clientY) {
    const r = container.getBoundingClientRect();
    return {
        x: clientX - r.left,
        y: clientY - r.top
    };
    }

    function determineDirection(dx, dy) {
    if (Math.hypot(dx, dy) < deadZone) return null;
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'derecha' : 'izquierda';
    } else {
        return dy < 0 ? 'arriba' : 'abajo';
    }
    }

    function safeCall(procName) {
    try {
        if (window.v3d && v3d.puzzles && v3d.puzzles.procedures && typeof v3d.puzzles.procedures[procName] === 'function') {
        v3d.puzzles.procedures[procName]();
        } else {
        // silencio si no existe
        }
    } catch (e) {
        console.error('Error llamando a procedimiento v3d:', e);
    }
    }

    // repetición direccional
    function startRepeating(direction) {
    if (!direction) return;
    // si estamos en modo rotación, no permitimos repetición direccional
    if (rotationMode) return;
    if (currentRepeatDirection === direction) return;
    stopRepeating();
    currentRepeatDirection = direction;
    safeCall(direction); // llamada inmediata
    repeatTimer = setInterval(() => {
        safeCall(direction);
    }, REPEAT_INTERVAL_MS);
    }

    function stopRepeating() {
    if (repeatTimer) {
        clearInterval(repeatTimer);
        repeatTimer = null;
    }
    currentRepeatDirection = null;
    }

    // --- Rotación: manejar acumulador angular ---
    function angleFromDxDy(dx, dy) {
    // convertimos a coordenadas con Y hacia arriba para que las rotaciones
    // sigan la convención matemática (ángulos CCW positivos).
    // en pantalla dy = clientY - centerY (y hacia abajo), por eso invertimos.
    return Math.atan2(-dy, dx); // radianes
    }

    function radToDeg(rad) {
    return rad * 180 / Math.PI;
    }

    function normalizeDeltaDeg(delta) {
    // normaliza a [-180,180]
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
    }

    function handleRotationUpdate(dx, dy) {
    const dist = Math.hypot(dx, dy);
    const rotationMinRadius = maxRadius * ROTATION_MIN_RADIUS_FACTOR;

    // si demasiado cerca del centro, no consideramos rotación
    if (dist < rotationMinRadius) {
        anglePrev = null;
        return;
    }

    const ang = angleFromDxDy(dx, dy); // rad
    if (anglePrev === null) {
        anglePrev = ang;
        return;
    }

    // delta en grados, normalizado
    let deltaDeg = radToDeg(ang - anglePrev);
    deltaDeg = normalizeDeltaDeg(deltaDeg);
    anglePrev = ang;

    // ignorar jitter pequeño
    if (Math.abs(deltaDeg) < 0.6) return; // menor tolerancia para evitar ruido
    angleAccumDeg += deltaDeg;

    // si se supera umbral mínimo, activamos modo rotación (bloqueo de direcciones)
    if (!rotationMode && Math.abs(angleAccumDeg) >= LOCK_THRESHOLD_DEG) {
        rotationMode = true;
        stopRepeating(); // bloquear direccionales
        container.classList.add('rotating');
    }

    // detectar giros según umbrales separados derecha/izquierda
    // Nota: angleAccumDeg > 0 => giro CCW (izquierda). angleAccumDeg < 0 => giro CW (derecha).
    if (angleAccumDeg >= TURN_TRIGGER_DEG_LEFT) {
        // vuelta en sentido antihorario -> "vultas-izquierda"
        safeCall('vultas-izquierda');
        angleAccumDeg -= TURN_TRIGGER_DEG_LEFT; // permitir detectar múltiples vueltas
    } else if (angleAccumDeg <= -TURN_TRIGGER_DEG_RIGHT) {
        // vuelta en sentido horario -> "vultas-derecha"
        safeCall('vultas-derecha');
        angleAccumDeg += TURN_TRIGGER_DEG_RIGHT;
    }
    }

    // --- Eventos mouse/touch ---

    knob.addEventListener('mousedown', function (ev) {
    ev.preventDefault();
    dragging = true;
    anglePrev = null;
    angleAccumDeg = 0;
    rotationMode = false;
    container.classList.remove('rotating');
    });

    document.addEventListener('mousemove', function (ev) {
    if (!dragging) return;
    const p = toLocalCoords(ev.clientX, ev.clientY);
    let dx = p.x - center.x;
    let dy = p.y - center.y;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
        const s = maxRadius / dist;
        dx *= s;
        dy *= s;
    }
    setKnobPosition(dx, dy, false);

    // actualización de rotación (acumula ángulos y entra en rotationMode si se supera el umbral)
    handleRotationUpdate(dx, dy);

    // dirección dominante y repetición (se bloquea si rotationMode == true)
    if (!rotationMode) {
        const dir = determineDirection(dx, dy);
        if (dir) startRepeating(dir);
        else stopRepeating();
    } else {
        // en rotationMode no enviamos direcciones
        stopRepeating();
    }
    });

    document.addEventListener('mouseup', function (ev) {
    if (!dragging) return;
    dragging = false;
    stopRepeating();
    // reset rotación y desbloqueo
    anglePrev = null;
    angleAccumDeg = 0;
    rotationMode = false;
    container.classList.remove('rotating');
    setKnobPosition(0, 0, true);
    });

    // touch support
    knob.addEventListener('touchstart', function (ev) {
    ev.preventDefault();
    dragging = true;
    anglePrev = null;
    angleAccumDeg = 0;
    rotationMode = false;
    container.classList.remove('rotating');
    }, { passive: false });

    document.addEventListener('touchmove', function (ev) {
    if (!dragging) return;
    const t = ev.touches[0];
    if (!t) return;
    const p = toLocalCoords(t.clientX, t.clientY);
    let dx = p.x - center.x;
    let dy = p.y - center.y;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
        const s = maxRadius / dist;
        dx *= s;
        dy *= s;
    }
    setKnobPosition(dx, dy, false);

    // actualización de rotación
    handleRotationUpdate(dx, dy);

    if (!rotationMode) {
        const dir = determineDirection(dx, dy);
        if (dir) startRepeating(dir);
        else stopRepeating();
    } else {
        stopRepeating();
    }
    }, { passive: false });

    document.addEventListener('touchend', function (ev) {
    if (!dragging) return;
    dragging = false;
    stopRepeating();
    anglePrev = null;
    angleAccumDeg = 0;
    rotationMode = false;
    container.classList.remove('rotating');
    setKnobPosition(0, 0, true);
    });

    // click en la base para pulsación rápida (una sola llamada)
    base.addEventListener('click', function (ev) {
    const p = toLocalCoords(ev.clientX, ev.clientY);
    let dx = p.x - center.x;
    let dy = p.y - center.y;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
        const s = maxRadius / dist;
        dx *= s;
        dy *= s;
    }
    setKnobPosition(dx, dy, true);
    // si estamos en modo rotación no disparamos direcciones
    if (!rotationMode) {
        const dir = determineDirection(dx, dy);
        if (dir) safeCall(dir);
    }
    setTimeout(() => setKnobPosition(0, 0, true), 120);
    });

    // mantener métricas al cambiar tamaño / escala
    const ro = new ResizeObserver(refreshMetrics);
    try { ro.observe(container); } catch (e) { /* no crítico */ }

    // inicial
    refreshMetrics();
    setKnobPosition(0, 0, false);

    // expongo utilidades para debug si necesitas
    window.__v3dJoystick = {
    setKnobPosition,
    refreshMetrics,
    safeCall,
    startRepeating,
    stopRepeating,
    // getters para estado
    getAngleAccum() { return angleAccumDeg; },
    getRotationMode() { return rotationMode; }
    };
})();
