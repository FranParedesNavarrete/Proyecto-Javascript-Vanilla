// Se guarda el usuario actual en la variable user y se parsea el JSON en userDataJSON
let user = getCookie('user'); 
let userData = getCookie('users');
const userDataJSON = userData ? JSON.parse(userData) : {};

// Si no esta logueado, se redirige a la pagina de inicio
if (!user) {
    window.location.href = 'index.html';
} else {
    // Si esta logueado, se muestra un saludo y la informacion del usuario junto con la fecha y hora del ultimo login
    saludo = document.createElement('div');
    saludo.textContent = 'Hola ' + user;
    welcome.appendChild(saludo);

    lastTime = document.createElement('div');
    lastTime.textContent = 'La última vez que entraste';
    lastTime.appendChild(document.createElement('br'));
    lastTime.appendChild(document.createTextNode(' fue el ' + (userDataJSON[user].lastDate || userDataJSON[user].date)));
    lastTime.appendChild(document.createElement('br'));
    lastTime.appendChild(document.createTextNode(' a las ' + (userDataJSON[user].lastTime || userDataJSON[user].time)));
    welcome.appendChild(lastTime);

    // Creacion del boton para redirigir a la pagina de las preguntas
    questionsButton = document.createElement('div');
    questionsButton.className = 'questions area';
    questionsButton.innerHTML = '<a href="./questions.html">Preguntas</a>';
    questionsButton.id = 'questionsButton';
    welcome.appendChild(questionsButton);
}   
