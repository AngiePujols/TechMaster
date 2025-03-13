document.addEventListener("DOMContentLoaded", function () {
    // Solo permite ingresar números en la cédula y formatea automáticamente
    document.getElementById('cedula').addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 3 && value.length <= 10) {
            e.target.value = `${value.slice(0, 3)}-${value.slice(3, 10)}`;
        } else if (value.length === 11) {
            e.target.value = `${value.slice(0, 3)}-${value.slice(3, 10)}-${value.slice(10, 11)}`;
        }
    });

    // Función de validación de cédula
    function validaCedula() {
        const cedula = document.getElementById('cedula').value.replace(/\D/g, ''); // Elimina los guiones y espacios

        if (cedula.length !== 11) {
            alert('Cédula Incorrecta');
            return false;
        }

        const c = cedula.split('');
        const v = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]; // Secuencia de multiplicadores
        let result = 0;

        for (let i = 0; i < 10; i++) {
            let up = c[i] * v[i];
            let ab = up;
            let oc = ab >= 10 ? ab.toString().split('').map(x => parseInt(x)).reduce((x, y) => x + y) : ab;
            result += oc;
        }

        let dp = result;
        let ac = parseInt(dp.toString().split('')[0] + '0');
        let uj = (ac / 10) * 10;

        if (uj < dp) {
            dp = (uj + 10) - dp;
        }

        if (c[10] == dp) {
            return true; // La cédula es válida
        } else {
            alert('Cédula Incorrecta');
            return false; // La cédula es incorrecta
        }
    }


    // Función para formatear la tarjeta de crédito
    function formatCreditCard(value) {
        let cleaned = value.replace(/\D/g, '').slice(0, 16);
        let formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
        return formatted;
    }

    document.getElementById('noTarjetaCredito').addEventListener('input', function (e) {
        let formattedValue = formatCreditCard(e.target.value);
        e.target.value = formattedValue;
    });

    // Función para formatear el límite de crédito
    function formatCurrency(value) {
        return "RD$ " + parseFloat(value).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    document.getElementById('limiteCredito').addEventListener('input', function (e) {
        let rawValue = e.target.value.replace(/[^0-9.]/g, '');
        if (rawValue === "") return;
        e.target.value = formatCurrency(rawValue);
    });

    // Maneja el evento de envío del formulario
    document.getElementById('customerForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        // Validar cédula antes de enviar el formulario
        if (!validaCedula()) {
            return; // Si la cédula no es válida, no se envía el formulario
        }

        // Captura los valores del formulario
        const nuevoCliente = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            cedula: document.getElementById('cedula').value,
            noTarjetaCredito: document.getElementById('noTarjetaCredito').value.replace(/\D/g, ''), // Elimina caracteres no numéricos
            limiteCredito: parseFloat(document.getElementById('limiteCredito').value.replace(/[^0-9.]/g, '')), // Formatea el límite de crédito
            tipoPersona: document.getElementById('tipoPersona').value,
            estado: 'activo'
        };

        console.log("Datos a enviar:", nuevoCliente); // Verifica los datos antes de enviarlos

        // Realiza la solicitud POST
        fetch('https://localhost:7167/api/Clientes/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCliente) // Convierte el objeto JS en JSON
        })
            .then(response => {
                console.log("Respuesta de la API:", response); // Verifica la respuesta de la API
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Cliente guardado:', data);
                alert('Cliente guardado con éxito');
                // Redirige a la lista de clientes
                window.location.href = 'Clientes.html';
            })
            .catch(error => {
                console.error('Error al guardar cliente:', error);
                alert('Ha ocurrido un error al guardar el cliente');
            });
    });

    // Recupera el nombre del usuario de localStorage y lo muestra en el span
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const apellidoUsuario = localStorage.getItem('apellidoUsuario');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (nombreUsuario && apellidoUsuario && userNameDisplay) {
        userNameDisplay.textContent = `${nombreUsuario} ${apellidoUsuario}`;
    }
});