 // Alterna la visibilidad de la contraseña
 function togglePasswordVisibility() {
    const passwordField = document.getElementById('exampleInputPassword');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

document.querySelector('.user').addEventListener('submit', function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById('exampleInputUsername').value;
    const passwordInput = document.getElementById('exampleInputPassword').value;

    fetch('https://localhost:7278/api/Usuario/GetUsuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(users => {
            const userFound = users.find(user => 
                user.username === usernameInput && user.password === passwordInput
            );

            if (userFound) {
                // Guardamos el nombre y apellido en localStorage
                localStorage.setItem('nombreUsuario', userFound.nombre);
                localStorage.setItem('apellidoUsuario', userFound.apellido);

                window.location.href = 'index.html';
            } else {
                alert('Usuario o contraseña incorrecta');
            }
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
            alert('Ha ocurrido un error al verificar las credenciales.');
        });
});