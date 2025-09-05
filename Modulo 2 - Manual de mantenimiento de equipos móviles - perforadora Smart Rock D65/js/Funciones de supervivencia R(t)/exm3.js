function updateParameters() {
    const distributionElement = document.getElementById('distribution');
    const parametersDiv = document.getElementById('parameters');
    if (!distributionElement || !parametersDiv) return;

    const distribution = distributionElement.value;
    
    let parametersHTML = '<div class="input-section">';
    
    switch(distribution) {
        case 'exponential':
            parametersHTML += `
                <div class="input-group">
                    <label for="lambda">Parámetro λ (tasa):</label>
                    <input type="number" id="lambda" step="0.1" min="0.1" value="0.5" placeholder="λ > 0">
                </div>
                <div class="input-group">
                    <p style="margin: 0; color: #666; font-size: 1.5em;">
                        S(t) = e<sup>-λt</sup><br>
                        Media = 1/λ
                    </p>
                </div>
            `;
            break;
        case 'weibull':
            parametersHTML += `
                <div class="input-group">
                    <label for="k">Parámetro k (forma):</label>
                    <input type="number" id="k" step="0.1" min="0.1" value="2" placeholder="k > 0">
                </div>
                <div class="input-group">
                    <label for="lambda_w">Parámetro λ (escala):</label>
                    <input type="number" id="lambda_w" step="0.1" min="0.1" value="1" placeholder="λ > 0">
                </div>
            `;
            break;
        case 'normal':
            parametersHTML += `
                <div class="input-group">
                    <label for="mu">Media μ:</label>
                    <input type="number" id="mu" step="0.1" value="5" placeholder="Media">
                </div>
                <div class="input-group">
                    <label for="sigma">Desviación σ:</label>
                    <input type="number" id="sigma" step="0.1" min="0.1" value="2" placeholder="σ > 0">
                </div>
            `;
            break;
        case 'uniform':
            parametersHTML += `
                <div class="input-group">
                    <label for="a">Límite inferior a:</label>
                    <input type="number" id="a" step="0.1" value="0" placeholder="a">
                </div>
                <div class="input-group">
                    <label for="b">Límite superior b:</label>
                    <input type="number" id="b" step="0.1" value="10" placeholder="b > a">
                </div>
            `;
            break;
    }
    
    parametersHTML += '</div>';
    parametersDiv.innerHTML = parametersHTML;
}

function calculateSurvival() {
    const distribution = document.getElementById('distribution').value;
    const t = parseFloat(document.getElementById('time').value);
    
    if (isNaN(t) || t < 0) {
        alert('Por favor ingrese un tiempo válido (t ≥ 0)');
        return;
    }
    
    let survival = 0;
    let formula = '';
    let calculation = '';
    
    try {
        switch(distribution) {
            case 'exponential':
                const lambda = parseFloat(document.getElementById('lambda').value);
                if (lambda <= 0) {
                    alert('λ debe ser mayor que 0');
                    return;
                }
                survival = Math.exp(-lambda * t);
                formula = `S(${t}) = e<sup>-${lambda}×${t}</sup>`;
                calculation = `S(${t}) = e<sup>-${lambda * t}</sup> = ${survival.toFixed(6)}`;
                break;
                
            case 'weibull':
                const k = parseFloat(document.getElementById('k').value);
                const lambda_w = parseFloat(document.getElementById('lambda_w').value);
                if (k <= 0 || lambda_w <= 0) {
                    alert('Los parámetros k y λ deben ser mayores que 0');
                    return;
                }
                survival = Math.exp(-Math.pow(t/lambda_w, k));
                formula = `S(${t}) = e<sup>-(${t}/${lambda_w})<sup>${k}</sup></sup>`;
                calculation = `S(${t}) = e<sup>-${Math.pow(t/lambda_w, k).toFixed(4)}</sup> = ${survival.toFixed(6)}`;
                break;
                
            case 'normal':
                const mu = parseFloat(document.getElementById('mu').value);
                const sigma = parseFloat(document.getElementById('sigma').value);
                if (sigma <= 0) {
                    alert('σ debe ser mayor que 0');
                    return;
                }
                const z = (t - mu) / sigma;
                survival = 0.5 * (1 - erf(z / Math.sqrt(2)));
                formula = `S(${t}) = 1 - Φ((${t}-${mu})/${sigma})`;
                calculation = `S(${t}) = 1 - Φ(${z.toFixed(4)}) = ${survival.toFixed(6)}`;
                break;
                
            case 'uniform':
                const a = parseFloat(document.getElementById('a').value);
                const b = parseFloat(document.getElementById('b').value);
                if (b <= a) {
                    alert('b debe ser mayor que a');
                    return;
                }
                if (t <= a) {
                    survival = 1;
                } else if (t >= b) {
                    survival = 0;
                } else {
                    survival = (b - t) / (b - a);
                }
                formula = `S(${t}) = (${b}-${t})/(${b}-${a})`;
                calculation = `S(${t}) = ${survival.toFixed(6)}`;
                break;
        }
        
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Resultado:</h3>
            <div style="font-size: 1em; margin: 12px 0;">
                ${formula}
            </div>
            <div style="font-size: 1.2em; font-weight: bold; margin: 12px 0;">
                ${calculation}
            </div>
            <div style="font-size: 0.9em; margin-top: 12px;">
                La probabilidad de supervivencia más allá del tiempo ${t} es: <strong>${(survival * 100).toFixed(2)}%</strong>
            </div>
        `;
        resultDiv.style.display = 'block';
        
    } catch (error) {
        alert('Error en el cálculo. Verifique los parámetros.');
    }
}

// Aproximación de la función de error
function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

// Esperar a que el DOM esté listo antes de ejecutar
document.addEventListener('DOMContentLoaded', function () {
    updateParameters();

    // Esperar a que MathJax esté cargado, luego renderizar
if (window.MathJax && MathJax.Hub) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

});



