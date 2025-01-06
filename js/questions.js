// Se guarda obtiene la zona del formulario
let questionZone = document.getElementById('form');

// Se obtienen las preguntas
let questions = document.getElementById('questions');

// Se obtiene la tabla donde se mostraran las preguntas
let table = document.getElementById('table'); 

// Se obtiene el boton para volver a questions.html
let returnButton = document.getElementById('return');

// Se guardan el JSON de las preguntas y el usuario actual
let userData = getCookie('users');
let user = getCookie('user');

// Contadores para el numero de filas y para el saber numero de preguntas que se estan guardando 
let rowCont = 0;
let saveCont = 0;

// Funcion para comprobar si el formualrio esta completo, si lo esta habilita el boton 'Grabar'si no lo esta lo desabilita
function checkEmptyInputs () {
    let questionField = document.getElementById('question').value;
    let answer = document.querySelector('input[name="answer"]:checked');
    let score = document.getElementById('score').value;

    if (answer) {
        answer = answer.value;
    } else {
        answer = '';
    }

    if (!questionField || !score || !answer) {
        document.getElementById('record').disabled = true;
    } else {
        document.getElementById('record').disabled = false;
    }
}

// Funcion para guardar las preguntas en la cookie
async function saveQuestion (user, question, answer, score) {
    const userDataJSON = userData ? JSON.parse(userData) : {};

    userDataJSON[user].questions = userDataJSON[user].questions || [];
    userDataJSON[user].questions.push({
        question: question,
        answer: answer,
        score: score,
        status: 'OK',
    });

    // Intenta guardar la cookie
    try {
        setCookie('users', JSON.stringify(userDataJSON), 360);
    } catch (error) {
        throw new Error();
    }

    // Actualiza el JSON de las preguntas
    userData = getCookie('users');
}

// Funcion para mostrar todas las preguntas guardadas, si bool es true muestra las preguntas de la cookie con un delay de 5s si es false muestra las preguntas de la cookie sin delay
function showQuestions (user, bool = false) {
    const userDataJSON = userData ? JSON.parse(userData) : {};

    let questions = userDataJSON[user].questions;

    loadingMessage = document.createElement('div');

    if (!bool) {
        loadingMessage.remove();
        let questionRow = document.createElement('tr');
        questionRow.innerHTML += '<td> Pregunta </td>';
        questionRow.innerHTML += '<td> Respuesta </td>';
        questionRow.innerHTML += '<td> Puntuación </td>';
        questionRow.innerHTML += '<td> Estado </td>';
        table.appendChild(questionRow);

        if (questions) {
            questions.forEach(question => {
                let questionRow = document.createElement('tr');
                questionRow.innerHTML += `<td>${question.question}</td>`;
                questionRow.innerHTML += `<td>${question.answer}</td>`;
                questionRow.innerHTML += `<td>${question.score}</td>`;
                questionRow.innerHTML += `<td>${question.status}</td>`;
                table.appendChild(questionRow);
            });
        }
    } else {
        // Si bool es true muestra 'Cargando preguntas...' durante 5s y despues muestra las preguntas
        loadingMessage.id = 'loadingMessage';
        loadingMessage.innerHTML = 'Cargando preguntas...';
        table.appendChild(loadingMessage);

        // Se llama a la funcion showQuestions sin pasarle bool para que muestre las preguntas sin delay
        setTimeout(() => showQuestions(user), 5000);
        
    }
}

// Funcion para mostrar y agregar la pregunta recien insertada en la tabla y en la cookie
async function showQuestion (user, question, answer, score) {
    // Crea un id para la nueva fila e inserta la pregunta en la tabla
    let rowId = 'question-' + rowCont++;
    let questionRow = document.createElement('tr');
    questionRow.innerHTML += `<td>${question}</td>`;
    questionRow.innerHTML += `<td>${answer}</td>`;
    questionRow.innerHTML += `<td>${score}</td>`
    questionRow.innerHTML += `<td>Guardando...</td>`;
    questionRow.id = rowId;
    table.appendChild(questionRow);

    // Deshabilita el boton 'Atrás' mientras se guarda la pregunta y suma 1 al contador de preguntas que se estan guardando
    returnButton.disabled = true;
    saveCont++;

    // Se simula el delay de los 5s
    await new Promise (resolve => setTimeout(resolve, 5000));

    try {
        // Se intenta guardar la pregunta en la cookie
        await saveQuestion(user, question, answer, score);

        // Si se guarda correctamente, se actualiza el contenido de la fila
        let updateRow = document.getElementById(rowId);
        updateRow.innerHTML = `<td>${question}</td>`;
        updateRow.innerHTML += `<td>${answer}</td>`;
        updateRow.innerHTML += `<td>${score}</td>`;
        updateRow.innerHTML += `<td>OK</td>`;
    } catch (error) {
        // Si no se guarda correctamente, se actualiza el contenido de la fila con el estado en 'ERROR'
        let updateRow = document.getElementById(rowId);
        updateRow.innerHTML = `<td>${question}</td>`;
        updateRow.innerHTML += `<td>${answer}</td>`;
        updateRow.innerHTML += `<td>${score}</td>`;
        updateRow.innerHTML += `<td>ERROR</td>`;
    } finally {
        // Al finalizar se habilita el boton 'Atrás' y se resta 1 al contador
        saveCont--;

        // Si el contador de preguntas que se estan guardando es un 0, se habilita el boton 'Atrás'
        if (saveCont == 0) {
            returnButton.disabled = false;
        }
    }

}

// Funcion para anadir la pregunta a la cookie y la tabla
function addQuestion () {
    let regexScore = /^[0-9]{1}$/; // Expresion regular para validar que el score sea un solo digito

    let questionField = document.getElementById('question').value;
    let answer = document.querySelector('input[name="answer"]:checked').value;
    let score = document.getElementById('score').value;

    // Comprobacion de que el score sea un solo digito
    if (regexScore.test(score)) {
        showQuestion(user, questionField, answer, score);
        error.remove();
    } else {
        error.textContent = 'Error: Puntuación inválida.';
        questionZone.appendChild(error);
    }         

        // Al terminar de intentar guardar la pregunta se resetea el formulario y se habilita el boton 'Grabar'
        document.getElementById('questionsForm').reset();
        document.getElementById('record').disabled = true;
}

// Si no esta logueado, se redirige a la pagina de inicio
if (!user) {
    window.location.href = 'index.html';
} else {
    showQuestions(user); // Muestra las preguntas del usuario, por defecto no tiene delay
    // showQuestions(user, true) // Muestra las preguntas del usuario con un delay de 5s entre cada pregunta

    // AddEventListener para verificar que no haya campos vacios
    window.addEventListener('input', checkEmptyInputs); 

    // AddEventListener para que al hacer click en el boton 'Grabar' se guarde la pregunta en la cookie y se muestre en la tabla
    document.getElementById('record').addEventListener('click', addQuestion);

    // AddEventListener para que al hacer click en el boton 'Atrás' se redirija a la pagina de bienvenida
    returnButton.addEventListener('click', function () {
        window.location.href = 'welcome.html';
    });
}
