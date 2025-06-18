const terms = [
    { word: "PROGRAMA", description: "Conjunto de instrucciones que una computadora sigue para realizar una tarea." },
    { word: "CODIGO", description: "Instrucciones escritas en un lenguaje que la computadora puede entender y ejecutar." },
    { word: "ALGORITMO", description: "Secuencia de pasos lógicos y precisos para resolver un problema o realizar una tarea." }
];

let currentWordIndex = 0;
let correctGuesses = [];
let incorrectGuesses = 0;
let maxGuesses = 6;
let completedTerms = 0;

function initGame() {
    const term = terms[Math.floor(Math.random() * terms.length)];
    document.getElementById('descripcion').textContent = term.description;
    currentWordIndex = terms.indexOf(term);
    correctGuesses = [];
    incorrectGuesses = 0;
    document.getElementById('word').innerHTML = '_ '.repeat(term.word.length).trim();
    document.getElementById('keyboard').innerHTML = '';
    drawBaseAndRope(); // Dibuja la base y la cuerda por defecto al iniciar el juego

    document.getElementById('completionMessageContainer').style.display = 'none';
    document.getElementById('allTermsCompletedContainer').style.display = 'none';
    document.getElementById('hangmanCanvas').style.display = 'block';
    document.getElementById('keyboard').style.display = 'block';

    // Crear teclado
    for (let i = 65; i <= 90; i++) {
        const key = document.createElement('div');
        key.textContent = String.fromCharCode(i);
        key.classList.add('key');
        key.addEventListener('click', () => handleGuess(key));
        document.getElementById('keyboard').appendChild(key);
    }
}

function handleGuess(key) {
    const letter = key.textContent;
    const term = terms[currentWordIndex].word;
    if (term.includes(letter)) {
        correctGuesses.push(letter);
        updateWord();
    } else {
        incorrectGuesses++;
        drawHangman();  // Dibuja una nueva parte del cuerpo
    }
    key.classList.add('disabled');
    key.removeEventListener('click', () => handleGuess(key));
    checkGameOver();
}

function updateWord() {
    const term = terms[currentWordIndex].word;
    let displayWord = '';
    for (const letter of term) {
        displayWord += correctGuesses.includes(letter) ? letter : '_';
        displayWord += ' ';
    }
    document.getElementById('word').textContent = displayWord.trim();
}

function drawBaseAndRope() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    ctx.strokeStyle = '#f7b612';
    ctx.lineWidth = 3;

    // Dibujar la base y la cuerda al iniciar el juego
    ctx.beginPath();
    ctx.moveTo(10, 180); ctx.lineTo(100, 180);  // Base
    ctx.moveTo(50, 180); ctx.lineTo(50, 30);    // Palo vertical
    ctx.moveTo(50, 30);  ctx.lineTo(100, 30);   // Palo horizontal
    ctx.moveTo(100, 30); ctx.lineTo(100, 50);   // Cuerda
    ctx.stroke();
}

function drawHangman() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#f7b612';
    ctx.lineWidth = 3;

    // Dibujar las partes del cuerpo en orden
    const hangmanStages = [
        () => { ctx.arc(100, 60, 10, 0, Math.PI * 2); },   // Cabeza
        () => { ctx.moveTo(100, 70); ctx.lineTo(100, 120); }, // Cuerpo
        () => { ctx.moveTo(100, 80); ctx.lineTo(80, 100); },  // Brazo izquierdo
        () => { ctx.moveTo(100, 80); ctx.lineTo(120, 100); }, // Brazo derecho
        () => { ctx.moveTo(100, 120); ctx.lineTo(80, 150); }, // Pierna izquierda
        () => { ctx.moveTo(100, 120); ctx.lineTo(120, 150); } // Pierna derecha (último intento)
    ];

    // Dibuja la parte correspondiente al número de errores
    if (incorrectGuesses <= hangmanStages.length) {
        ctx.beginPath();
        hangmanStages[incorrectGuesses - 1]();
        ctx.stroke();
    }
}

function checkGameOver() {
    const term = terms[currentWordIndex].word;
    const currentWord = document.getElementById('word').textContent.replace(/\s+/g, '');

    if (currentWord === term) {
        setTimeout(() => {
            completedTerms++; // Incrementamos el contador de términos completados
            showCompletionMessage(); // Mostramos el mensaje de término completado
        }, 500);
    } else if (incorrectGuesses >= maxGuesses) {
        setTimeout(() => {
            // Mostrar el mensaje de error al agotar los intentos
            showErrorMessage(term);
        }, 500);
    }
}

function showCompletionMessage() {
    document.getElementById('keyboard').style.display = 'none';
    document.getElementById('hangmanCanvas').style.display = 'none';
    document.getElementById('completionMessageContainer').style.display = 'block';
}

function cycleNextTerm() {
    terms.splice(currentWordIndex, 1);
    if (terms.length > 0) {
        initGame();
    } else {
        showAllTermsCompletedMessage(); // Mostramos el mensaje final y el botón "Avanzar"
    }
}

function showAllTermsCompletedMessage() {
    document.getElementById('keyboard').style.display = 'none';
    document.getElementById('hangmanCanvas').style.display = 'none';
    document.getElementById('completionMessageContainer').style.display = 'none';
    document.getElementById('allTermsCompletedContainer').style.display = 'block';
    document.getElementById('nextButton').style.display = 'block';
}

// Mostrar el mensaje de error al perder el juego
function showErrorMessage(term) {
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    errorMessageContainer.style.display = 'block';
    errorMessageContainer.innerHTML = `
        <p>Has perdido. La palabra era "${term}".</p>
        <button onclick="retryGuess()">Intentar de nuevo</button>
    `;
}

// Función para ocultar el mensaje de error y reiniciar el juego
function retryGuess() {
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    errorMessageContainer.style.display = 'none';
    initGame(); // Reiniciamos el juego
}

// Inicializamos el juego al cargar la página
initGame();