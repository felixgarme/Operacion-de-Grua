let currentSection = 'teoria';
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

const questions = [
    {
        question: "¿Cuál es la característica principal de la distribución exponencial?",
        options: [
            "Tiene memoria del tiempo pasado",
            "Es 'sin memoria' - la probabilidad futura no depende del pasado",
            "Solo se puede usar para tiempos negativos",
            "Requiere dos parámetros para definirse"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es la fórmula de la función de densidad de probabilidad (PDF)?",
        options: [
            "f(x) = λe^(-λx)",
            "f(x) = e^(-λx)",
            "f(x) = λx*e^(-λx)",
            "f(x) = 1 - e^(-λx)"
        ],
        correct: 0
    },
    {
        question: "¿En cuál de estas aplicaciones es más útil la distribución exponencial?",
        options: [
            "Modelar alturas de personas",
            "Modelar tiempos de fallo de componentes electrónicos",
            "Modelar resultados de exámenes",
            "Modelar temperaturas diarias"
        ],
        correct: 1
    }
];

function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(section).classList.add('active');
    
    // Activar el botón correspondiente
    event.target.classList.add('active');
    
    currentSection = section;
    updateProgress();
}

function updateProgress() {
    const sections = ['teoria', 'formulas', 'calculadora', 'aplicaciones', 'quiz'];
    const currentIndex = sections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function calculateProbabilities() {
    const lambda = parseFloat(document.getElementById('lambda').value);
    const x = parseFloat(document.getElementById('xValue').value);
    
    if (lambda <= 0 || x < 0) {
        alert('Por favor, ingrese valores válidos (λ > 0, x ≥ 0)');
        return;
    }
    
    // Calcular PDF
    const pdf = lambda * Math.exp(-lambda * x);
    
    // Calcular CDF
    const cdf = 1 - Math.exp(-lambda * x);
    
    // Calcular estadísticas
    const mean = 1 / lambda;
    const variance = 1 / (lambda * lambda);
    const stdDev = 1 / lambda;
    
    const results = `
        <p><strong>Función de Densidad (PDF):</strong> ${pdf.toFixed(6)}</p>
        <p><strong>Función Acumulativa (CDF):</strong> ${cdf.toFixed(6)}</p>
        <p><strong>P(X ≤ ${x}):</strong> ${(cdf * 100).toFixed(2)}%</p>
        <hr style="margin: 15px 0;">
        <p><strong>Media (μ):</strong> ${mean.toFixed(4)}</p>
        <p><strong>Varianza (σ²):</strong> ${variance.toFixed(4)}</p>
        <p><strong>Desviación Estándar (σ):</strong> ${stdDev.toFixed(4)}</p>
    `;
    
    document.getElementById('results').innerHTML = results;
    document.getElementById('resultBox').classList.add('show');
}

function selectOption(element, isCorrect) {
    // Remover selección previa
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Seleccionar la opción actual
    element.classList.add('selected');
    selectedOption = { element, isCorrect };
}

function nextQuestion() {
    if (!selectedOption) {
        alert('Por favor, seleccione una respuesta');
        return;
    }
    
    // Mostrar la respuesta correcta
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        if (index === questions[currentQuestion].correct) {
            opt.classList.add('correct');
        } else if (opt.classList.contains('selected') && !selectedOption.isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    if (selectedOption.isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
    }
    
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showFinalScore();
        }
    }, 2000);
}

function loadQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        opt.textContent = question.options[index];
        opt.className = 'quiz-option';
    });
    
    selectedOption = null;
}

function showFinalScore() {
    const percentage = (score / questions.length) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = 'Excelente!';
    } else if (percentage >= 60) {
        message = 'Buen trabajo!';
    } else {
        message = 'Sigue practicando';
    }
    
    document.querySelector('.quiz-container').innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #031795; margin-bottom: 20px;">Quiz Completado</h3>
            <div style="font-size: 2em; margin: 20px 0;">${message}</div>
            <p style="font-size: 1.5em;">Puntuación Final: ${score}/${questions.length}</p>
            <p style="font-size: 1.2em;">Porcentaje: ${percentage.toFixed(1)}%</p>
 
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    document.getElementById('score').textContent = '0';
    
    document.querySelector('.quiz-container').innerHTML = `
        <div class="question" id="questionText">¿Cuál es la característica principal de la distribución exponencial?</div>
        
        <div class="quiz-option" onclick="selectOption(this, false)">
            Tiene memoria del tiempo pasado
        </div>
        <div class="quiz-option" onclick="selectOption(this, true)">
            Es "sin memoria" - la probabilidad futura no depende del pasado
        </div>
        <div class="quiz-option" onclick="selectOption(this, false)">
            Solo se puede usar para tiempos negativos
        </div>
        <div class="quiz-option" onclick="selectOption(this, false)">
            Requiere dos parámetros para definirse
        </div>
        
        <button class="calculate-btn" onclick="nextQuestion()" style="margin-top: 20px;">Siguiente Pregunta</button>
        
        <div style="text-align: center; margin-top: 20px;">
            <p>Pregunta <span id="questionNumber">1</span> de 3</p>
            <p>Puntuación: <span id="score">0</span>/3</p>
        </div>
    `;
}


// Inicializar
updateProgress();