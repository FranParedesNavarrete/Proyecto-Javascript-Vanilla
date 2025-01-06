let questionZone = document.getElementById('form');
let questions = document.getElementById('questions');
let table = document.getElementById('table'); 
let returnButton = document.getElementById('return');

let userData = getCookie('users');
let user = getCookie('user');

let rowCont = 0;
let saveCont = 0;

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

function saveQuestion (user, question, answer, score) {
    const userDataJSON = userData ? JSON.parse(userData) : {};

    userDataJSON[user].questions = userDataJSON[user].questions || [];
    userDataJSON[user].questions.push({
        question: question,
        answer: answer,
        score: score,
        status: 'OK',
    });

    setCookie('users', JSON.stringify(userDataJSON), 360);
    userData = getCookie('users');
}

function showQuestions (user, bool = false) {
    const userDataJSON = userData ? JSON.parse(userData) : {};

    let questions = userDataJSON[user].questions;

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
        loadingMessage = document.createElement('div');
        loadingMessage.id = 'loadingMessage';
        loadingMessage.innerHTML = 'Cargando preguntas...';
        table.appendChild(loadingMessage);

        setTimeout(() => showQuestions(user), 5000);
        
    }
}

function showQuestion (user, question, answer, score) {
    let rowId = 'question-' + rowCont++;
    let questionRow = document.createElement('tr');
    questionRow.innerHTML += `<td>${question}</td>`;
    questionRow.innerHTML += `<td>${answer}</td>`;
    questionRow.innerHTML += `<td>${score}</td>`
    questionRow.innerHTML += `<td>Guardando...</td>`;
    questionRow.id = rowId;
    table.appendChild(questionRow);

    returnButton.disabled = true;
    saveCont++;

    setTimeout (() => {
        try {
            saveQuestion(user, question, answer, score);

            let updateRow = document.getElementById(rowId);
            updateRow.innerHTML = `<td>${question}</td>`;
            updateRow.innerHTML += `<td>${answer}</td>`;
            updateRow.innerHTML += `<td>${score}</td>`;
            updateRow.innerHTML += `<td>OK</td>`;
        } catch (error) {
            let updateRow = document.getElementById('statusField');

            updateRow.innerHTML = `<td>${question}</td>`;
            updateRow.innerHTML += `<td>${answer}</td>`;
            updateRow.innerHTML += `<td>${score}</td>`;
            updateRow.innerHTML += `<td>ERROR</td>`;
        } finally {
            saveCont--;

            if (saveCont == 0) {
                returnButton.disabled = false;
            }
        }
       
        }, 5000);
}

if (!user) {
    window.location.href = 'index.html';
} else {
    let regexScore = /^[0-9]{1}$/;
    showQuestions(user, true);

    window.addEventListener('input', checkEmptyInputs);

    document.getElementById('record').addEventListener('click', function (event) {
        let questionField = document.getElementById('question').value;
        let answer = document.querySelector('input[name="answer"]:checked').value;
        let score = document.getElementById('score').value;

        if (regexScore.test(score)) {
            showQuestion(user, questionField, answer, score);
            error.remove();
        } else {
            error.textContent = 'Error: Puntuación inválida.';
            questionZone.appendChild(error);
        }         
        
        document.getElementById('questionsForm').reset();
        document.getElementById('record').disabled = true;
    });
    returnButton.addEventListener('click', function () {
        window.location.href = 'welcome.html';
    });
}
