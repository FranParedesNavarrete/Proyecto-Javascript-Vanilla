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
