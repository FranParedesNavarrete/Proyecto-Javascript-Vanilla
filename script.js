let content = document.getElementById('content');
let welcome = document.getElementById('welcome');
let questions = document.getElementById('questions');
let table = document.getElementById('table');

let error = document.createElement('div');
error.className = 'error';


function setCookie(cname, cvalue, exdays) {  
    let d = new Date(); 
    d.setTime(d.getTime() + (exdays*24*60*60*1000)); 
    var expires = "expires="+d.toUTCString(); 
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; 
} 

function getCookie(cname) { 
    var name = cname + "="; 
    var ca = document.cookie.split(';'); 
    for(var i = 0; i < ca.length; i++) { 
        var c = ca[i]; 
        while (c.charAt(0) == ' ') { 
            c = c.substring(1); 
        } 
        if (c.indexOf(name) == 0) { 
            return c.substring(name.length, c.length); 
        } 
    } 
    return ""; 
    } 

function deleteCookie(cname) { 
    document.cookie = cname+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'; 
}

if (content) {
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let userLogin = document.createElement('label');
    userLogin.textContent = 'Usuario';
    let emailInput = document.createElement('input');
    emailInput.id = 'email';
    emailInput.type = 'text';

    error.textContent = 'Error: Introduzca un correo valido. Ej: "caracteres@caracteres.caracteres".';
    
    let show = setTimeout(showLogin, 5000);
    
    function showLogin () {
        content.innerHTML = '';
        content.appendChild(userLogin);
        content.appendChild(emailInput);
        emailInput.addEventListener('focusout', login);
    }

    function login () {
        if (regexEmail.test(emailInput.value)) {
            saveUser(emailInput.value.trim());
            clearTimeout(show);
        } else {
            content.appendChild(error);
            emailInput.select();
        }
    }

    function saveUser (email) {
        let actualDate = new Date();
        let date = `${actualDate.getDate()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getFullYear()}`;
        let time = `${actualDate.getHours().toString().padStart(2,'0')}:${actualDate.getMinutes().toString().padStart(2,'0')}:${actualDate.getSeconds().toString().padStart(2,'0')}`;
    
        let userData = getCookie('users');
        const userDataJSON = userData ? JSON.parse(userData) : {};

        if (userDataJSON[email]) {
            userDataJSON[email].lastDate = userDataJSON[email].date || '';
            userDataJSON[email].lastTime = userDataJSON[email].time || '';
        }

        userDataJSON[email] = {
            ...userDataJSON[email],
            date: date,
            time: time
        };

        setCookie('users', JSON.stringify(userDataJSON), 360);
        setCookie('user', email, 360);

        window.location.href = 'welcome.html'; 
    }

    document.body.addEventListener('keydown', function (event) { 
        if (event.ctrlKey && event.code == 'F10') {
            showLogin();
        }    
    });
}

if (welcome) {
    let userData = getCookie('users');
    const userDataJSON = userData ? JSON.parse(userData) : {};
    let email = getCookie('user'); 

    if (!email) {
        window.location.href = 'index.html';
    } else {
        saludo = document.createElement('div');
        saludo.textContent = 'Hola ' + email;
        welcome.appendChild(saludo);
    
        lastTime = document.createElement('div');
        lastTime.textContent = 'La última vez que entraste';
        lastTime.appendChild(document.createElement('br'));
        lastTime.appendChild(document.createTextNode(' fue el ' + (userDataJSON[email].lastDate || userDataJSON[email].date)));
        lastTime.appendChild(document.createElement('br'));
        lastTime.appendChild(document.createTextNode(' a las ' + (userDataJSON[email].lastTime || userDataJSON[email].time)));
        welcome.appendChild(lastTime);
    
        questionsButton = document.createElement('div');
        questionsButton.className = 'questions area';
        questionsButton.innerHTML = '<a href="./questions.html">Preguntas</a>';
        questionsButton.id = 'questionsButton';
        welcome.appendChild(questionsButton);
    }   
}

function saveQuestion (user, question, answer, score) {
    let userData = getCookie('users');
    const userDataJSON = userData ? JSON.parse(userData) : {};

    userDataJSON[user].questions = userDataJSON[user].questions || [];
    userDataJSON[user].questions.push({
        question: question,
        answer: answer,
        score: score,
        status: 'OK',
    });

    setCookie('users', JSON.stringify(userDataJSON), 360);

}

function showQuestions (user, bool = false) {
    const userData = getCookie('users');
    const userDataJSON = userData ? JSON.parse(userData) : {};

    let questions = userDataJSON[user].questions;

    if (!bool) {
        loadingMessage.remove();
        questionRow = document.createElement('tr');
        questionRow.innerHTML += '<td>' + 'Pregunta' + '</td>';
        questionRow.innerHTML += '<td>' + 'Respuesta' + '</td>';
        questionRow.innerHTML += '<td>' + 'Puntuación' + '</td>';
        questionRow.innerHTML += '<td>' + 'Estado' + '</td>';
        table.appendChild(questionRow);

        if (questions) {
            loadingMessage.remove();
            questions.forEach(question => {
                questionRow = document.createElement('tr');
                questionRow.innerHTML += '<td>' + question.question + '</td>';
                questionRow.innerHTML += '<td>' + question.answer + '</td>';
                questionRow.innerHTML += '<td>' + question.score + '</td>';
                questionRow.innerHTML += '<td>' + question.status + '</td>';
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
    questionRow = document.createElement('tr');
    questionRow.innerHTML += `<td>${question}</td>`;
    questionRow.innerHTML += `<td>${answer}</td>`;
    questionRow.innerHTML += `<td>${score}</td>`
    questionRow.innerHTML += `<td>Guardando...</td>`;
    table.appendChild(questionRow);

    setTimeout (() => {
        const userData = getCookie('users');
        const userDataJSON = userData ? JSON.parse(userData) : {};
    
        let lastQuestion = userDataJSON[user].questions;
        lastQuestion = lastQuestion[lastQuestion.length - 1]; 

        try {
            saveQuestion(user, question, answer, score);
        } catch (error) {
            lastQuestion.status = 'ERROR';
            table.innerHTML = '';
            showQuestions(user);
        }
       
        loadingMessage.remove();
        table.innerHTML = '';
        showQuestions(user);
        }, 5000);
}

if (questions) {
    let email = getCookie('user');
    if (!email) {
        window.location.href = 'index.html';
    } else {
        let regexScore = /^[0-9]{1}$/;
        showQuestions(email, true);

        document.addEventListener('DOMContentLoaded', function () {
            let questionField = document.getElementById('question').value;
            let answer = document.querySelector('input[name="answer"]');
            let score = document.getElementById('score').value;
            let empty = false;

            if (answer) {
                answer = answer.value;
            } else {
                answer = '';
            }

            if (questionField == '' || score == '' || !answer) {
                document.getElementById('record').disabled = true;
            } else {
                document.getElementById('record').disabled = false;
            }

        });

        document.getElementById('record').addEventListener('click', function (event) {
            let questionField = document.getElementById('question').value;
            let answer = document.querySelector('input[name="answer"]:checked').value;
            let score = document.getElementById('score').value;
            if (questionField !=='' && score !== '') {
                if (regexScore.test(document.getElementById('score').value)) {
                    showQuestion(email, questionField, answer, score);
                    error.remove();
                } else {
                    error.textContent = 'Error: Puntuación inválida.';
                    question.appendChild(error);
                } 
            } else {
                error.textContent = 'Error: Todos los campos tienen que estar rellenados.';
                document.getElementById('form').appendChild(error);
            } 
            
            document.getElementById('questionsForm').reset();
        });

    }

}

