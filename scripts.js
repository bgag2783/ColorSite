// Elements from the DOM
const colorInput = document.getElementById('colorInput');
const leftHalf = document.getElementById('leftHalf');
const rightHalf = document.getElementById('rightHalf');
const addColorButton = document.getElementById('addColor');
const clearLeft = document.getElementById('clearLeft');

// Function to generate a random color value
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

colorInput.placeholder = `e.g., ${getRandomColor()}`;

function applyBackgroundColor(element, color) {
    if (color.charAt(0) !== '#') {
        color = '#' + color;
    }
    element.style.backgroundColor = color;
}

colorInput.addEventListener('input', (e) => {
    if (!rightHalf.firstChild) {
        applyBackgroundColor(document.body, e.target.value);
    } else {
        applyBackgroundColor(leftHalf, e.target.value);
    }
});

addColorButton.addEventListener('click', () => {
    colorInput.style.position = 'static';
    colorInput.style.transform = 'none';

    const secondColorInput = document.createElement('input');
    secondColorInput.type = 'text';
    secondColorInput.maxLength = 7;
    secondColorInput.className = 'colorInput';
    secondColorInput.placeholder = `e.g., ${getRandomColor()}`;
    
    rightHalf.className = 'half';
    rightHalf.appendChild(secondColorInput);

    const clearRight = document.createElement('div');
    clearRight.textContent = 'x';
    clearRight.className = 'clear-button';
    rightHalf.appendChild(clearRight);

    secondColorInput.addEventListener('input', (e) => {
        applyBackgroundColor(rightHalf, e.target.value);
    });

    clearRight.addEventListener('click', () => {
        rightHalf.style.backgroundColor = '';
        rightHalf.innerHTML = '';
        rightHalf.className = '';
        addColorButton.style.display = 'block';
        applyBackgroundColor(document.body, leftHalf.style.backgroundColor);
        leftHalf.style.backgroundColor = '';
        colorInput.style.position = 'absolute';
        colorInput.style.top = '50%';
        colorInput.style.left = '50%';
        colorInput.style.transform = 'translate(-50%, -50%)';
    });

    addColorButton.style.display = 'none';
});

clearLeft.addEventListener('click', () => {
    leftHalf.style.backgroundColor = '';
    colorInput.value = '';
    applyBackgroundColor(document.body, '');
    colorInput.style.position = 'absolute';
    colorInput.style.top = '50%';
    colorInput.style.left = '50%';
    colorInput.style.transform = 'translate(-50%, -50%)';
});
