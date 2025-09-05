// Variables globales
let chart;
let animationId;
let isAnimating = false;
let currentTime = 0;
let currentDistribution = 'exponential';
let animationSpeed = 5;

// Configuración del gráfico
let ctx;
try {
    const canvas = document.getElementById('survivalChart');
    if (!canvas) throw new Error("No se encontró el canvas con id 'survivalChart'");
    ctx = canvas.getContext('2d');
} catch (err) {
    console.error("Error al obtener el contexto del gráfico:", err.message);
}

// Inicializar gráfico
function initChart() {
    if (!ctx) {
        console.error("No se pudo inicializar el gráfico porque 'ctx' no está definido.");
        return;
    }

    try {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'S(t) - Función de Supervivencia',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                scales: {
                    x: {
                        title: { display: true, text: 'Tiempo (t)', font: { size: 14, weight: 'bold' } },
                        grid: { color: '#f3f4f6' }
                    },
                    y: {
                        min: 0,
                        max: 1,
                        title: { display: true, text: 'Probabilidad de Supervivencia S(t)', font: { size: 14, weight: 'bold' } },
                        grid: { color: '#f3f4f6' }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { font: { size: 12, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `S(${context.parsed.x.toFixed(2)}) = ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error("Error al crear el gráfico con Chart.js:", err.message);
    }
}

// Funciones de supervivencia
function exponentialSurvival(t, lambda) {
    return Math.exp(-lambda * t);
}

function weibullSurvival(t, lambda, k) {
    return Math.exp(-Math.pow(lambda * t, k));
}

function normalSurvival(t, mu, sigma) {
    const z = (t - mu) / (sigma * Math.sqrt(2));
    return 0.5 * (1 + erf(-z));
}

function lognormalSurvival(t, mu, sigma) {
    if (t <= 0) return 1;
    const z = (Math.log(t) - mu) / (sigma * Math.sqrt(2));
    return 0.5 * (1 + erf(-z));
}

function erf(x) {
    const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
    const a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);

    return sign * y;
}

function calculateSurvival(t, distribution, param1, param2) {
    try {
        switch(distribution) {
            case 'exponential':
                return exponentialSurvival(t, param1);
            case 'weibull':
                return weibullSurvival(t, param1, param2);
            case 'normal':
                return normalSurvival(t, param1, param2);
            case 'lognormal':
                return lognormalSurvival(t, param1, param2);
            default:
                console.warn("Distribución no reconocida:", distribution);
                return exponentialSurvival(t, param1);
        }
    } catch (err) {
        console.error(`Error al calcular S(t) con distribución "${distribution}":`, err.message);
        return 0;
    }
}

function updateChart() {
    try {
        const param1 = parseFloat(document.getElementById('param1')?.value);
        const param2 = parseFloat(document.getElementById('param2')?.value);

        if (isNaN(param1)) throw new Error("El valor de param1 no es un número válido");
        if (currentDistribution !== 'exponential' && isNaN(param2)) throw new Error("El valor de param2 no es un número válido");

        const maxTime = 10;
        const points = 200;
        const times = [], survivals = [];

        for (let i = 0; i <= points; i++) {
            const t = (i / points) * maxTime;
            times.push(t.toFixed(2));
            survivals.push(calculateSurvival(t, currentDistribution, param1, param2));
        }

        chart.data.labels = times;
        chart.data.datasets[0].data = survivals;
        chart.update('none');
        updateStats(param1, param2);
    } catch (err) {
        console.error("Error al actualizar el gráfico:", err.message);
    }
}

function updateStats(param1, param2) {
    try {
        let medianTime, meanTime, hazardRate, survival50;

        switch(currentDistribution) {
            case 'exponential':
                medianTime = Math.log(2) / param1;
                meanTime = 1 / param1;
                hazardRate = param1;
                break;
            case 'weibull':
                medianTime = Math.pow(Math.log(2), 1/param2) / param1;
                meanTime = (1/param1) * gamma(1 + 1/param2);
                hazardRate = param1 * param2 * Math.pow(5, param2 - 1);
                break;
            default:
                medianTime = param1;
                meanTime = param1;
                hazardRate = 'Variable';
        }

        survival50 = calculateSurvival(5, currentDistribution, param1, param2);

        document.getElementById('median-time').textContent = isFinite(medianTime) ? medianTime.toFixed(2) : '-';
        document.getElementById('mean-time').textContent = isFinite(meanTime) ? meanTime.toFixed(2) : '-';
        document.getElementById('hazard-rate').textContent = typeof hazardRate === 'number' ? hazardRate.toFixed(3) : hazardRate;
        document.getElementById('survival-50').textContent = survival50.toFixed(4);
    } catch (err) {
        console.error("Error al calcular estadísticas:", err.message);
    }
}

function gamma(z) {
    try {
        return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
    } catch (err) {
        console.error("Error al calcular función gamma:", err.message);
        return 0;
    }
}

function updateEquation() {
    try {
        const equations = {
            exponential: { formula: 'S(t) = e^(-λt)', description: 'λ es la tasa de fallas constante.' },
            weibull:     { formula: 'S(t) = e^(-(λt)^k)', description: 'λ es escala y k es forma.' },
            normal:      { formula: 'S(t) = 1 - Φ((t-μ)/σ)', description: 'μ es media y σ desviación estándar.' },
            lognormal:   { formula: 'S(t) = 1 - Φ((ln(t)-μ)/σ)', description: 'Para tiempos positivos.' }
        };

        const eq = equations[currentDistribution];
        if (!eq) throw new Error("Distribución desconocida para ecuación.");
        document.getElementById('current-equation').textContent = eq.formula;
        document.getElementById('equation-description').textContent = eq.description;
    } catch (err) {
        console.error("Error al actualizar la ecuación mostrada:", err.message);
    }
}

function updateParameterLabels() {
    try {
        const labels = {
            exponential: ['λ (Lambda)', 'No usado'],
            weibull: ['λ (Escala)', 'k (Forma)'],
            normal: ['μ (Media)', 'σ (Desv. Est.)'],
            lognormal: ['μ (Media log)', 'σ (Desv. Est. log)']
        };

        const currentLabels = labels[currentDistribution];
        if (!currentLabels) throw new Error("No se encontraron etiquetas para la distribución actual");

        document.querySelector('label[for="param1"]').textContent = currentLabels[0];
        document.querySelector('label[for="param2"]').textContent = currentLabels[1];

        const showSecond = currentDistribution !== 'exponential';
        document.getElementById('param2').style.display = showSecond ? 'block' : 'none';
        document.querySelector('label[for="param2"]').style.display = showSecond ? 'block' : 'none';
        document.getElementById('param2-value').style.display = showSecond ? 'block' : 'none';
    } catch (err) {
        console.error("Error al actualizar etiquetas de parámetros:", err.message);
    }
}

function animate() {
    try {
        if (!isAnimating) return;

        const param1 = parseFloat(document.getElementById('param1')?.value);
        const param2 = parseFloat(document.getElementById('param2')?.value);
        const maxTime = 10;
        const step = 0.05 * animationSpeed;

        if (currentTime >= maxTime) {
            currentTime = 0;
        }

        const times = [];
        const survivals = [];

        for (let t = 0; t <= currentTime; t += 0.05) {
            times.push(t.toFixed(2));
            survivals.push(calculateSurvival(t, currentDistribution, param1, param2));
        }

        chart.data.labels = times;
        chart.data.datasets[0].data = survivals;
        chart.update('none');

        currentTime += step;
        animationId = requestAnimationFrame(animate);
    } catch (err) {
        console.error("Error durante la animación:", err.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        initChart();
        updateChart();
        updateEquation();
        updateParameterLabels();

        document.getElementById('param1').addEventListener('input', function () {
            document.getElementById('param1-value').textContent = this.value;
            updateChart();
        });

        document.getElementById('param2').addEventListener('input', function () {
            document.getElementById('param2-value').textContent = this.value;
            updateChart();
        });

        document.getElementById('speed').addEventListener('input', function () {
            animationSpeed = parseInt(this.value);
            document.getElementById('speed-value').textContent = this.value + 'x';
        });

        document.querySelectorAll('.distribution-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.distribution-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentDistribution = this.dataset.dist;
                updateChart();
                updateEquation();
                updateParameterLabels();
            });
        });

        document.getElementById('animateBtn').addEventListener('click', function () {
            isAnimating = !isAnimating;
            this.innerHTML = isAnimating ? '<span>⏸️ Pausar Animación</span>' : '<span>▶️ Iniciar Animación</span>';
            this.classList.toggle('running', isAnimating);

            if (isAnimating) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });

        document.getElementById('resetBtn').addEventListener('click', function () {
            isAnimating = false;
            currentTime = 0;
            document.getElementById('animateBtn').innerHTML = '<span>▶️ Iniciar Animación</span>';
            document.getElementById('animateBtn').classList.remove('running');
            cancelAnimationFrame(animationId);
            updateChart();
        });
    } catch (err) {
        console.error("Error durante la inicialización del documento:", err.message);
    }
});
