const svg = document.getElementById('graph');
const point = document.getElementById('movablePoint');
const verticalLine = document.getElementById('verticalLine');
const statusIndicator = document.getElementById('statusIndicator');
const xCoordDisplay = document.getElementById('xCoord');
const yCoordDisplay = document.getElementById('yCoord');

let isDragging = false;
let startX, startY;

// Function to get Y value on curve for given X
function getCurveY(x) {
    // Approximation of the curve equation based on the path
    // This is a simplified version - adjust based on your specific curve
    if (x < 50) return 155;
    if (x > 550) return 285;
    
    // Piecewise quadratic approximation of the curve
    if (x <= 250) {
        // First segment: slight rise
        return 155 + (x - 50) * 0.1;
    } else if (x <= 450) {
        // Second segment: more pronounced rise
        return 175 + (x - 250) * 0.25;
    } else {
        // Third segment: steeper rise
        return 225 + (x - 450) * 0.6;
    }
}

// Function to check if point is below curve and update color
function updatePointColor(pointX, pointY) {
    const curveY = getCurveY(pointX);
    
    if (pointY >= curveY) {
        // Point is below or on the curve (remember SVG Y is inverted)
        point.classList.remove('above-curve');
        point.classList.add('below-curve');
        verticalLine.classList.remove('danger');
        verticalLine.classList.add('safe');
        statusIndicator.classList.remove('danger');
        statusIndicator.classList.add('safe');
        statusIndicator.innerHTML = 'Seguro';
    } else {
        // Point is above the curve
        point.classList.remove('below-curve');
        point.classList.add('above-curve');
        verticalLine.classList.remove('safe');
        verticalLine.classList.add('danger');
        statusIndicator.classList.remove('safe');
        statusIndicator.classList.add('danger');
        statusIndicator.innerHTML = 'Peligroso';
    }
}
function svgToReal(svgX, svgY) {
    const realX = Math.round((svgX - 50) * 2); // Scale factor for X (mm)
    const realY = Math.round((350 - svgY) * 5); // Scale factor for Y (Kg)
    return { x: Math.max(0, Math.min(1000, realX)), y: Math.max(0, Math.min(1000, realY)) };
}

// Function to convert SVG coordinates to real values
function svgToReal(svgX, svgY) {
    const realX = Math.round((svgX - 50) * 2); // Scale factor for X (mm)
    const realY = Math.round((350 - svgY) * 5); // Scale factor for Y (Kg)
    return { x: Math.max(0, Math.min(1000, realX)), y: Math.max(0, Math.min(1000, realY)) };
}

// Function to update coordinate display
function updateCoordinates(svgX, svgY) {
    const real = svgToReal(svgX, svgY);
    xCoordDisplay.textContent = real.x;
    yCoordDisplay.textContent = real.y;
}

// Function to update vertical line
function updateVerticalLine(x) {
    verticalLine.setAttribute('x1', x);
    verticalLine.setAttribute('x2', x);
}

// Function to update point position and color
function updatePoint(newX, newY) {
    point.setAttribute('cx', newX);
    point.setAttribute('cy', newY);
    updateVerticalLine(newX);
    verticalLine.setAttribute('y1', newY);
    updateCoordinates(newX, newY);
    updatePointColor(newX, newY);
}

// Mouse down event
point.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = svg.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    point.style.cursor = 'grabbing';
    point.style.animation = 'none'; // Stop pulse animation when dragging
    e.preventDefault();
});

// Mouse move event
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = svg.getBoundingClientRect();
    let newX = e.clientX - rect.left;
    let newY = e.clientY - rect.top;
    
    // Constrain to graph boundaries
    newX = Math.max(50, Math.min(550, newX));
    newY = Math.max(50, Math.min(350, newY));
    
    // Update point with color check
    updatePoint(newX, newY);
});

// Mouse up event
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        point.style.cursor = 'grab';
        point.style.animation = 'pulse 2s infinite'; // Resume pulse animation
    }
});

// Touch events for mobile support
point.addEventListener('touchstart', (e) => {
    isDragging = true;
    const rect = svg.getBoundingClientRect();
    const touch = e.touches[0];
    startX = touch.clientX - rect.left;
    startY = touch.clientY - rect.top;
    point.style.animation = 'none'; // Stop pulse animation when dragging
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const rect = svg.getBoundingClientRect();
    const touch = e.touches[0];
    let newX = touch.clientX - rect.left;
    let newY = touch.clientY - rect.top;
    
    // Constrain to graph boundaries
    newX = Math.max(50, Math.min(550, newX));
    newY = Math.max(50, Math.min(350, newY));
    
    // Update point with color check
    updatePoint(newX, newY);
    
    e.preventDefault();
});

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        point.style.animation = 'pulse 2s infinite'; // Resume pulse animation
    }
});

// Initialize coordinates display and color
updateCoordinates(350, 190);
updatePointColor(350, 190);

// Add smooth animation when point is clicked anywhere on the graph
svg.addEventListener('click', (e) => {
    if (e.target === point) return; // Don't move if clicking the point itself
    
    const rect = svg.getBoundingClientRect();
    let newX = e.clientX - rect.left;
    let newY = e.clientY - rect.top;
    
    // Constrain to graph boundaries
    newX = Math.max(50, Math.min(550, newX));
    newY = Math.max(50, Math.min(350, newY));
    
    // Animate point to new position
    point.style.transition = 'cx 0.3s ease, cy 0.3s ease, fill 0.3s ease, stroke 0.3s ease';
    updatePoint(newX, newY);
    
    // Remove transition after animation
    setTimeout(() => {
        point.style.transition = 'r 0.2s ease, fill 0.3s ease, stroke 0.3s ease';
    }, 300);
});
