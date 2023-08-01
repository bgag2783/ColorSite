// Elements from the DOM
const colorInput = document.getElementById('colorInput');
const leftHalf = document.getElementById('leftHalf');
const rightHalf = document.getElementById('rightHalf');
const addColorButton = document.getElementById('addColor');
const clearLeft = document.getElementById('clearLeft');
const menuButton = document.getElementById('menuButton');
const colorHistory = document.getElementById('colorHistory');

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
    hideWelcomeMessage();
});

addColorButton.addEventListener('click', () => {
    colorInput.style.position = 'static';
    colorInput.style.transform = 'none';

    const secondColorInput = document.createElement('input');
    secondColorInput.type = 'text';
    secondColorInput.id = 'rightColorInput';
    secondColorInput.maxLength = 7;
    secondColorInput.className = 'colorInput';
    secondColorInput.placeholder = `e.g., ${getRandomColor()}`;
    
    rightHalf.className = 'half';
    rightHalf.appendChild(secondColorInput);

    const clearRight = document.createElement('div');
    clearRight.textContent = 'x';
    clearRight.id = 'clearRight';
    clearRight.className = 'clear-button';
    rightHalf.appendChild(clearRight);

    secondColorInput.addEventListener('input', (e) => {
        applyBackgroundColor(rightHalf, e.target.value);
    });

    clearRight.addEventListener('click', () => {
        rightHalf.style.backgroundColor = '';
        rightHalf.innerHTML = '';
        rightHalf.className = '';
        addColorButton.style.display = 'inherit';
        applyBackgroundColor(document.body, leftHalf.style.backgroundColor);
        leftHalf.style.backgroundColor = '';
        colorInput.style.position = 'absolute';
        colorInput.style.top = '50%';
        colorInput.style.left = '50%';
        colorInput.style.transform = 'translate(-50%, -50%)';
    });
    
    // After setting the background color, store it to history
    secondColorInput.addEventListener('change', (e) => {
        const rightInput = document.getElementById('rightColorInput');
        if (rightInput && rightInput.value) {
            storeColorToHistory(colorInput.value, rightInput.value);
        } else {
            storeColorToHistory(colorInput.value);
    }
});

    addColorButton.style.display = 'none';
    hideWelcomeMessage();
});

clearLeft.addEventListener('click', () => {
    let rightColorInput = document.getElementById('rightColorInput');
    if (rightColorInput != null && rightColorInput.value != '') {
        colorInput.value = rightColorInput.value;
        leftHalf.style.backgroundColor = colorInput.value;
        applyBackgroundColor(document.body, colorInput.value);
        rightHalf.style.backgroundColor = '';
    } else {
        leftHalf.style.backgroundColor = '';
        colorInput.value = '';
        applyBackgroundColor(document.body, '');
    }

    rightHalf.innerHTML = '';
    rightHalf.className = '';
    addColorButton.style.display = 'inherit';

    colorInput.style.position = 'absolute';
    colorInput.style.top = '50%';
    colorInput.style.left = '50%';
    colorInput.style.transform = 'translate(-50%, -50%)';
    hideWelcomeMessage();
});


// Welcome message
const welcomeMessage = document.querySelector(".message");

// Local storage key for color history
const COLOR_HISTORY_KEY = "colorHistory";

// Get color history from local storage
let colorHistoryArray = JSON.parse(localStorage.getItem(COLOR_HISTORY_KEY)) || [];

// Function to hide the welcome message
function hideWelcomeMessage() {
    welcomeMessage.style.display = 'none';
}

// Function to store the color to history
function storeColorToHistory(color1, color2 = null) {
    // Store the color or color pair
    const colorEntry = color2 ? [color1, color2] : [color1];
    colorHistoryArray.unshift(colorEntry);
    // Limit to 50 entries
    if (colorHistoryArray.length > 50) {
        colorHistoryArray.pop();
    }
    // Update local storage
    localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(colorHistoryArray));
    populateColorHistory();  // Update the history display
}

// Function to populate the color history
function populateColorHistory() {
    colorHistory.innerHTML = "";  // Clear previous entries
    colorHistoryArray.forEach(entry => {
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.textContent = entry.join(' | ');
        historyEntry.onclick = () => {
            if (entry[1]) {
                // If there's a second color in the history entry
                const rightInput = document.getElementById('rightColorInput');
                if (rightInput) {
                    rightInput.value = entry[1];
                    applyBackgroundColor(rightHalf, entry[1]);
                } else {
                    // If there's no right input, simulate the add color button click
                    addColorButton.click();
                    document.getElementById('rightColorInput').value = entry[1];
                    applyBackgroundColor(rightHalf, entry[1]);
                }
            } else {
                // If there's no second color in the history entry, check if we need to hide the right side
                const rightInput = document.getElementById('rightColorInput');
                if (rightInput){
                    document.getElementById('clearRight').click();
                }
            }
            colorInput.value = entry[0];
            applyBackgroundColor(leftHalf, entry[0]);
        };
        colorHistory.appendChild(historyEntry);
    });
}

menuButton.addEventListener('click', () => {
    // Toggle the display of the color history
    colorHistory.style.display = colorHistory.style.display === 'none' ? 'block' : 'none';
});

// After setting the background color, store it to history
colorInput.addEventListener('change', (e) => {
    const rightInput = document.getElementById('rightColorInput');
    if (rightInput && rightInput.value) {
        storeColorToHistory(e.target.value, rightInput.value);
    } else {
        storeColorToHistory(e.target.value);
    }
});

// Initial population of the color history on page load
populateColorHistory();