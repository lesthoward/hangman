// Seleccionar todos los recuerodos del DOM
const wordHTML = document.querySelector('.hangman__word');
const wrongHTML = document.querySelector('.hangman__wrong');
const popupContainer = document.querySelector('.hangman__popup');
const popupMessage = document.querySelector('.hanngman__status');
const notification = document.querySelector('.hangman__notification')
const playAgain = document.querySelector('.hangman__again');
const figureParts = document.querySelectorAll('.hangman__parts');

// Las palabras disponibles y una predeterminada aleatoriamente
const words = ['hire', 'developer', 'web', 'design', 'guess', 'welcome', '']
let selectedWord = words[Math.floor(Math.random() * words.length)]

// Arreglo de las correctas e incorrectas letras. Si existe la letra se pinta algo
const correctWords = []
const wrongWords = []

// Cada que se presiona una tecla se acciona esta función y además comprueba si el arreglo de parabra esté completo
const displayWord = () => {
    // El HTML del contenedor de las letras, se genera un split convertir en arreglo y poder recorrer cada letra por si sola. Luego se utiliza map donde si existe la letra en "correctWord" entonces cambiarás el HTML con esa letra, de otro modo su textContent será vacío, por último join para convertir en string
    wordHTML.innerHTML = `
    ${selectedWord
    .split('')
    .map(
        letter => `
            <span class="hangman__letters">
                ${correctWords.includes(letter) ? letter : ''}
            </span>
        `
    ).join('')

    }
    `
    // Cuando se utiliza map y luego join se crea un tipo de salto de línea, se formatea la palabra para poder comparar con la correcta
    const formattedWord = wordHTML.innerText.replace(/\n/g, '').toLowerCase()
    // Si la última tecla presionada coincide con la palabra elegida para adivinar entonces, el juego habrá terminado
    if (formattedWord === selectedWord) {
        popupContainer.classList.add('hangman__popup--show')
        popupMessage.innerHTML = 'You have won! 😃'
    }
}

// Mostrar notificaciones, tanto de perder el juego como de ganar.
const showNotification = () => {
    notification.classList.add('hangman__notification--show')
    setTimeout(function() {
        notification.classList.remove('hangman__notification--show')
    }, 2000);
}

// Actualizar las palabras que están incorrectas de acuerdo al arreglo de wrongWord
const updateWrongLetters = () => {
    // El contenedor de las letras incorrectas quiero cambiar su innerHTML
    // Si existe más de una palabra incorrecta genera un único párrafo con la palabra wrong, de otro modo genera un span por cada palabra incorrecta de acuerdo al arreglo de palabras incorrectas
    wrongHTML.innerHTML = ` 
        ${wrongWords.length > 0 ? `
            <p class="hangman__wrongparagraph">Wrong</p>` : ''
        }
        ${wrongWords.map(letter => `
            <span class="hangman__wrongletters">${letter}</span>`
        )}
    `
    // Se toma la cantidad de errores como referencia y se hace un forEach por cada uno de las partes de la figura para tomar su index. Mientras sea menor al arreglo se va mostrar, por lo tanto, los erroes se van calculando del arreglo cada vez que se presiona una tecla
    const errorLength = wrongWords.length
    figureParts.forEach((part, partIndex) => {
        
        if (partIndex < errorLength) {
            part.classList.add('hangman__parts--show')
        } else { 
            part.classList.remove('hangman__parts--show')
        }
    })
    // Verificar si todas las partes del cuerpo estan completas de acuerdo a sus cantidades de arreglo, significa que el juego terminó y por lo tanto habrá perdido
    if (errorLength === figureParts.length) {
        popupContainer.classList.add('hangman__popup--show')
        popupMessage.innerText = 'Game Over!'
        popupMessage.innerHTML += `<p class="hangman__selected">${selectedWord}</p>`
    }

}

// Evento de tecla presionada en "window" para tomar los eventos, para las teclas que se encuentra en el abecedario van desde código 65 a 90 y convertir a minúsculas, porque no importa si es mayúscula o minúscula
window.addEventListener('keydown', (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key.toLowerCase()
        // Si la palabra elegida incluye la tecla presionada
        if (selectedWord.includes(letter)) {
            // Si el arreglo de palabras correctas no incluye la letra
            if(!correctWords.includes(letter)) {
                // Insertar en el arreglo y llamar la función genérica para mostrar la letra
                correctWords.push(letter)
                displayWord()
            } else {
                // Si la palabra existe en el arreglo, mostrar una notificación para no repetir las mismas palabras (no cuenta, no es la intención del ahorcado)
                showNotification()
            }
        } else {
            // Si la letra no coincide con ninguna de la palabra elegida y mientras que no se haya presionado la misma tecla dos veces
            if (!wrongWords.includes(letter)) {
                wrongWords.push(letter)
                updateWrongLetters()
            } else {
                // Si existe en arreglo de palabras incorrectas mostrar notificación para hacer saber al usuario 
                showNotification()
            }
        }
    }
})

// El botón de play again, se utiliza splice para modificar el arreglo desde la raíz (mutable)
playAgain.addEventListener('click', () => {
    correctWords.splice(0)
    wrongWords.splice(0)
    // Generar una palabra elegida diferente, no va ser la misma
    selectedWord = words[Math.floor(Math.random() * words.length)]
    // Remover la notificación
    popupContainer.classList.remove('hangman__popup--show')
    // Luego de limpiar los arreglos, llamar a las funciones que interáctuaban con los mismo.
    updateWrongLetters()
    displayWord()
})

// Se ejecuta por primera vez para cargar las letras sin contenido
displayWord()