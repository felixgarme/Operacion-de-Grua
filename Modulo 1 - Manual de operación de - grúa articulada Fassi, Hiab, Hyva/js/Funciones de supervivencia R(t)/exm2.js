


// Detectar si es una pantalla pequeña
const isMobile = window.innerWidth <= 768; // puedes ajustar el umbral según necesites

// Configuración del gráfico adaptativa
const margin = { top: 10, right: 40, bottom: 20, left: 40 };
const width = (isMobile ? 320 : 600) - margin.left - margin.right;
const height = (isMobile ? 240 : 400) - margin.top - margin.bottom;

// Crear SVG
const svg = d3.select("#sv-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Escalas
const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);


// Ejes
const xAxis = d3.axisBottom(xScale).tickSize(-height).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft(yScale).tickSize(-width).tickFormat(d3.format(".1f"));

const xAxisG = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

const yAxisG = g.append("g")
    .attr("class", "y-axis");

// Línea generadora
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);

// Contenedores para diferentes tipos de datos
const trainingLinesG = g.append("g").attr("class", "training-lines");
const currentLineG = g.append("g").attr("class", "current-line");
const failurePointsG = g.append("g").attr("class", "failure-points");

// Tooltip
const tooltip = d3.select("#sv-tooltip");

// Variables globales
let trainingData = [];
let currentData = [];
let failureData = [];
let currentCycles = 65;

// Función para generar datos simulados
function generateData() {
    trainingData = [];
    currentData = [];
    failureData = [];

    for (let i = 0; i < 15; i++) {
        const line = [];
        const maxCycles = Math.random() * 150 + 100;
        const degradationRate = Math.random() * 0.003 + 0.002;
        const noiseLevel = Math.random() * 0.05 + 0.02;

        for (let x = 0; x < maxCycles; x += 2) {
            const baseY = 1 - (degradationRate * x) - Math.pow(x / maxCycles, 2) * 0.3;
            const noise = (Math.random() - 0.5) * noiseLevel;
            const y = Math.max(0.1, Math.min(1, baseY + noise));
            line.push({ x, y, lineId: i });
            if (y <= 0.2) break;
        }
        trainingData.push(line);
    }

    const currentDegradationRate = Math.random() * 0.003 + 0.0025;
    for (let x = 0; x <= currentCycles; x += 1) {
        const baseY = 1 - (currentDegradationRate * x) - Math.pow(x / (currentCycles + 50), 2) * 0.2;
        const noise = (Math.random() - 0.5) * 0.03;
        const y = Math.max(0.1, Math.min(1, baseY + noise));
        currentData.push({ x, y });
    }

    for (let i = 0; i < 25; i++) {
        const randomLineIndex = Math.floor(Math.random() * trainingData.length);
        const selectedLine = trainingData[randomLineIndex];

        if (selectedLine && selectedLine.length > 0) {
            const endIndex = selectedLine.length - 1;
            const startIndex = Math.max(0, endIndex - 30);
            const randomIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;
            const basePoint = selectedLine[randomIndex];
            const x = basePoint.x + (Math.random() - 0.5) * 10;
            const y = basePoint.y + (Math.random() - 0.5) * 0.1;
            failureData.push({
                x: Math.max(0, x),
                y: Math.max(0.05, Math.min(0.4, y)),
                id: i,
                sourceLineId: randomLineIndex
            });
        }
    }
}

// Función para actualizar el gráfico
function updateChart() {
    const allXValues = [
        ...trainingData.flat().map(d => d.x),
        ...currentData.map(d => d.x),
        ...failureData.map(d => d.x)
    ];

    const allYValues = [
        ...trainingData.flat().map(d => d.y),
        ...currentData.map(d => d.y),
        ...failureData.map(d => d.y)
    ];

    xScale.domain([0, d3.max(allXValues)]);
    yScale.domain([0, 1.1]);

    xAxisG.transition().duration(750).call(xAxis);
    yAxisG.transition().duration(750).call(yAxis);

    g.selectAll(".axis-label").remove();

    g.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Condition Indicator Value");

    g.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 1})`)
        .style("text-anchor", "middle")
        .text("Life Time Variable (cycles)");

    const filter = document.getElementById('sv-dataFilter').value;
    const opacity = document.getElementById('sv-opacity').value;

    if (filter === 'all' || filter === 'training') {
        const lines = trainingLinesG.selectAll(".training-line")
            .data(trainingData);

        lines.enter()
            .append("path")
            .attr("class", "training-line")
            .merge(lines)
            .transition()
            .duration(750)
            .attr("d", line)
            .style("opacity", opacity)
            .style("display", null);

        lines.exit().remove();

        trainingLinesG.selectAll(".training-line")
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke-width", "2").style("opacity", "0.8");
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>Training Line</strong><br/>
                            Points: ${d.length}<br/>
                            Max Cycles: ${d3.max(d, p => p.x)}`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke-width", "1.5").style("opacity", opacity);
                tooltip.style("opacity", 0);
            });
    } else {
        trainingLinesG.selectAll(".training-line").style("display", "none");
    }

    if (filter === 'all' || filter === 'current') {
        const currentPath = currentLineG.selectAll(".current-path")
            .data([currentData]);

        currentPath.enter()
            .append("path")
            .attr("class", "current-path current-line")
            .merge(currentPath)
            .transition()
            .duration(750)
            .attr("d", line)
            .style("display", null);

        currentPath.exit().remove();

        currentLineG.selectAll(".current-path")
            .on("mouseover", function (event, d) {
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>Current Data</strong><br/>
                            Cycles: ${currentCycles}<br/>
                            Current Value: ${d[d.length - 1].y.toFixed(3)}`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
            });
    } else {
        currentLineG.selectAll(".current-path").style("display", "none");
    }

    if (filter === 'all' || filter === 'failure') {
        const points = failurePointsG.selectAll(".failure-point")
            .data(failureData);

        points.enter()
            .append("circle")
            .attr("class", "failure-point")
            .attr("r", 0)
            .merge(points)
            .transition()
            .duration(750)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 4)
            .style("display", null);

        points.exit().remove();

        failurePointsG.selectAll(".failure-point")
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("r", 6);
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>Failure Event</strong><br/>
                            Cycle: ${Math.round(d.x)}<br/>
                            Value: ${d.y.toFixed(3)}<br/>
                            From Training Line: ${d.sourceLineId + 1}`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr("r", 4);
                tooltip.style("opacity", 0);
            });
    } else {
        failurePointsG.selectAll(".failure-point").style("display", "none");
    }
}

// Controles
function regenerateData() {
    currentCycles = parseInt(document.getElementById('sv-cycles').value);
    generateData();
    updateChart();
}

// Event listeners
document.getElementById('sv-cycles').addEventListener('input', function () {
    currentCycles = parseInt(this.value);
    generateData();
    updateChart();
});

document.getElementById('sv-opacity').addEventListener('input', function () {
    updateChart();
});

document.getElementById('sv-dataFilter').addEventListener('change', function () {
    updateChart();
});

// Inicializar
generateData();
updateChart();
