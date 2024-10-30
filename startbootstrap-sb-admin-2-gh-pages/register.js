//Ver Contenido de Contraseña
function togglePasswordVisibility(id) {
    var input = document.getElementById(id);
    var icon = document.getElementById(id === 'contrasena' ? 'icon1' : 'icon2');

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

document.getElementById('user').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Captura los valores del formulario
    const nuevoUser = {
        nombre: document.getElementById('nombre').value, // Cambiado a minúsculas
        apellido: document.getElementById('apellido').value, // Cambiado a minúsculas
        rol: document.getElementById('rol').value, // Cambiado a minúsculas
        username: document.getElementById('usuario').value, // Cambiado a minúsculas
        password: document.getElementById('contrasena').value, // Cambiado a minúsculas
        email: document.getElementById('correo').value, // Cambiado a minúsculas
        fechaRegistro: new Date().toISOString(), // Asegúrate de enviar el formato correcto
        activo: true // Cambiado a booleano
    };

    // Imprime el objeto para verificar su contenido
    console.log('Nuevo usuario:', nuevoUser);

    // Realiza la solicitud POST
    fetch('https://localhost:7278/api/Usuario/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUser) // Convierte el objeto JS en JSON
    })
        .then(response => {
            // Verifica si la respuesta es exitosa
            if (!response.ok) {
                // Si no es exitosa, lanza un error con el estado de la respuesta
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuario guardado:', data);
            alert('Usuario guardado con éxito');
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.log('Error al guardar Usuario:', error);
            alert('Ha ocurrido un error al guardar el Usuario: ' + error.message);
        });
});
