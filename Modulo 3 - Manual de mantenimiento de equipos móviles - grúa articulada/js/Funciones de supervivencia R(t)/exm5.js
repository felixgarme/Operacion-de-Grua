// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    try {
        const canvas = document.getElementById('hazardChart');
        if (!canvas) throw new Error("No se encontró el elemento <canvas> con id 'hazardChart'");
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("No se pudo obtener el contexto 2D del canvas");

        // Datos basados en la forma visual del SVG (aproximación manual)
        function generateData() {
            const t = [0, 1, 2, 3, 4]; // puntos del eje X

            return {
                t: t,
                // Curva 1: Decreciente (#1e3a8a)
                decreciente: [2.5, 2.0, 1.5, 1.0, 0.6],
                // Curva 2: Constante (#dc2626)
                constante: [1.8, 1.8, 1.8, 1.8, 1.8],
                // Curva 3: Montaña (#059669)
                montania: [0.8, 1.5, 2.2, 1.6, 1.0],
                // Curva 4: Creciente (#7c3aed)
                creciente: [0.5, 1.0, 1.6, 2.2, 2.8],
                // Curva 5: Tina de baño (#0891b2)
                banio: [2.2, 1.6, 1.0, 1.6, 2.2]
            };
        }

        let data;
        try {
            data = generateData();
        } catch (err) {
            console.error("Error al generar datos de las funciones de riesgo:", err.message);
            return;
        }

        const chartConfig = {
            type: 'line',
            data: {
                labels: data.t,
                datasets: [
                    {
                        label: 'Decreciente',
                        data: data.decreciente,
                        borderColor: '#1e3a8a',
                        backgroundColor: 'rgba(30, 58, 138, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Constante',
                        data: data.constante,
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'Montaña',
                        data: data.montania,
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Creciente',
                        data: data.creciente,
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Tina de baño',
                        data: data.banio,
                        borderColor: '#0891b2',
                        backgroundColor: 'rgba(8, 145, 178, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Ejemplos de Funciones de Riesgo',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: true
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 't',
                            font: { size: 16, weight: 'bold' }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'λ(t)',
                            font: { size: 16, weight: 'bold' }
                        },
                        min: 0
                    }
                }
            }
        };

        let chart;
        try {
            chart = new Chart(ctx, chartConfig);
        } catch (err) {
            console.error("Error al crear el gráfico:", err.message);
            return;
        }

        // Checkbox handling
        const checkboxes = {
            'decreciente': document.getElementById('decreciente'),
            'constante': document.getElementById('constante'),
            'montania': document.getElementById('montania'),
            'creciente': document.getElementById('creciente'),
            'banio': document.getElementById('banio')
        };

        const datasetMap = {
            'decreciente': 0,
            'constante': 1,
            'montania': 2,
            'creciente': 3,
            'banio': 4
        };

        Object.keys(checkboxes).forEach(key => {
            const checkbox = checkboxes[key];
            if (!checkbox) return;
            checkbox.addEventListener('change', function () {
                const datasetIndex = datasetMap[key];
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.hidden = !this.checked;
                chart.update();
            });
        });

    } catch (err) {
        console.error("Error general:", err.message);
    }
});
