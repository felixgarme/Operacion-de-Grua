        let chart;
        let selectedAnswers = [];

        function showSection(sectionId, event = null) {
            // Ocultar todas las secciones
            const sections = document.querySelectorAll('.expo-section');
            sections.forEach(section => section.classList.remove('expo-active'));

            // Mostrar la sección seleccionada
            document.getElementById(sectionId).classList.add('expo-active');

            // Remover clase active de todos los botones
            const buttons = document.querySelectorAll('.nav-btn');
            buttons.forEach(btn => btn.classList.remove('active'));

            // Agregar clase active al botón clickeado
            if (event?.target) {
                event.target.classList.add('active');
            }

            // Inicializar el simulador si es necesario
            if (sectionId === 'expo-simulador') {
                setTimeout(() => {
                    initializeChart();
                    attachSliderListener();
                }, 100);
            }
        }

        function initializeChart() {
            const ctx = document.getElementById('exponentialChart')?.getContext('2d');
            if (!ctx) return;

            if (chart) chart.destroy();

            const lambda = parseFloat(document.getElementById('lambdaSlider').value);
            const data = generateExponentialData(lambda);

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.x,
                    datasets: [{
                        label: 'Función de Densidad',
                        data: data.y,
                        borderColor: '#031795',
                        backgroundColor: 'rgba(3, 23, 149, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Tiempo (x)' }},
                        y: { title: { display: true, text: 'Densidad f(x)' }}
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Distribución Exponencial (λ = ${lambda})`
                        }
                    }
                }
            });

            updateChart();
        }

        function generateExponentialData(lambda) {
            const x = [];
            const y = [];
            const maxX = 5 / lambda;
            const step = maxX / 100;

            for (let i = 0; i <= maxX; i += step) {
                x.push(i.toFixed(2));
                y.push(lambda * Math.exp(-lambda * i));
            }

            return { x, y };
        }

        function updateChart() {
            const lambda = parseFloat(document.getElementById('lambdaSlider').value);

            document.getElementById('lambdaValue').textContent = lambda.toFixed(1);
            document.getElementById('meanValue').textContent = (1 / lambda).toFixed(2);
            document.getElementById('varianceValue').textContent = (1 / (lambda ** 2)).toFixed(2);

            if (chart) {
                const data = generateExponentialData(lambda);
                chart.data.labels = data.x;
                chart.data.datasets[0].data = data.y;
                chart.options.plugins.title.text = `Distribución Exponencial (λ = ${lambda})`;
                chart.update();
            }
        }

        function generateRandomSamples() {
            const lambda = parseFloat(document.getElementById('lambdaSlider').value);
            const samples = [];

            for (let i = 0; i < 10; i++) {
                const u = Math.random();
                const sample = -Math.log(1 - u) / lambda;
                samples.push(sample.toFixed(3));
            }

            document.getElementById('samplesDisplay').innerHTML =
                `<strong>10 muestras aleatorias (λ=${lambda}):</strong><br>` +
                samples.join(', ');
        }

        function calculateProbabilities() {
            const lambda = parseFloat(document.getElementById('calcLambda').value);
            const x = parseFloat(document.getElementById('calcTime').value);

            const pLessEqual = 1 - Math.exp(-lambda * x);
            const pGreater = Math.exp(-lambda * x);
            const density = lambda * Math.exp(-lambda * x);

            document.getElementById('probabilityResults').innerHTML = `
                <div class="expo-highlight">
                    <strong>Resultados para λ=${lambda}, x=${x}:</strong><br>
                    P(X ≤ ${x}) = ${(pLessEqual * 100).toFixed(2)}%<br>
                    P(X > ${x}) = ${(pGreater * 100).toFixed(2)}%<br>
                    f(${x}) = ${density.toFixed(4)}
                </div>
            `;
        }

        function selectOption(element, isCorrect) {
            const question = element.closest('.question');
            const options = question.querySelectorAll('.expo-option');

            // Desmarcar todas las opciones
            options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

            // Marcar la opción seleccionada
            element.classList.add('selected');
            if (isCorrect) {
                element.classList.add('correct');
            } else {
                element.classList.add('incorrect');
            }

            // Guardar respuesta
            const questionIndex = Array.from(document.querySelectorAll('.question')).indexOf(question);
            selectedAnswers[questionIndex] = isCorrect;
        }

        function attachSliderListener() {
            const slider = document.getElementById('lambdaSlider');
            if (slider) {
                slider.removeEventListener('input', updateChart);
                slider.addEventListener('input', updateChart);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            attachSliderListener();
            if (document.getElementById('expo-simulador').classList.contains('expo-active')) {
                initializeChart();
            }
        });