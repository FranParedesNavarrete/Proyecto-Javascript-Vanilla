let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresion rgeular para comprobar el correo del usuario

// Creacion del elemento label
let userLogin = document.createElement('label');
userLogin.textContent = 'Usuario';

// Creacion del elemento input
let emailInput = document.createElement('input');
emailInput.id = 'email';
emailInput.type = 'text';

error.textContent = 'Error: Introduzca un correo valido. Ej: "caracteres@caracteres.caracteres".';

let show = setTimeout(showLogin, 5000);

// Funcion para mostrar el login
function showLogin () {
    content.innerHTML = '';
    content.appendChild(userLogin);
    content.appendChild(emailInput);
    emailInput.addEventListener('focusout', login);
}

// Funcion para comprobar el correo del usuario
function login () {
    if (regexEmail.test(emailInput.value)) {
        saveUser(emailInput.value.trim());
        clearTimeout(show);
    } else {
        content.appendChild(error);
        emailInput.select();
    }
}

// Funcion para guardar el email del usuario junto con la fecha de la sesion
function saveUser (email) {
    let actualDate = new Date();
    let date = `${actualDate.getDate()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getFullYear()}`;
    let time = `${actualDate.getHours().toString().padStart(2,'0')}:${actualDate.getMinutes().toString().padStart(2,'0')}:${actualDate.getSeconds().toString().padStart(2,'0')}`;

    // Si existe el archivo, se guarda en userDataJSON, si no existe se inicializa
    let userData = getCookie('users');
    const userDataJSON = userData ? JSON.parse(userData) : {};

    // Si ya existe el usuario se actualiza la fecha y hora de la ultima sesion
    if (userDataJSON[email]) {
        userDataJSON[email].lastDate = userDataJSON[email].date || '';
        userDataJSON[email].lastTime = userDataJSON[email].time || '';
    }

    // Se actualiza la fecha y hora de la ultima sesion
    userDataJSON[email] = {
        ...userDataJSON[email],
        date: date,
        time: time
    };

    // Se actualiza el archivo JSON y se guarda el email del usuario
    setCookie('users', JSON.stringify(userDataJSON), 360);
    setCookie('user', email, 360);

    window.location.href = 'welcome.html'; 
}

document.body.addEventListener('keydown', function (event) { 
    if (event.ctrlKey && event.code == 'F10') {
        showLogin();
    }    
});
