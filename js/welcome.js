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
