
document.getElementById('customerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se env�e de manera tradicional

    // Captura los valores del formulario
    const nuevoCliente = {

        nombreComercial: document.getElementById('nombreComercial').value,
        cedula: document.getElementById('rncCedula').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
         activo : 'activo'
    };

    // Realiza la solicitud POST
    fetch('https://localhost:7278/api/Customer/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente) // Convierte el objeto JS en JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Cliente guardado:', data);
            alert('Cliente guardado con éxito');
            // Redirige a la lista de clientes
            window.location.href = 'Clientes.html';
        })
        .catch(error => {
            console.log('Error al guardar cliente:', error);
            alert('Ha ocurrido un error al guardar el cliente');
        });
});

// Formatea el campo de telefono
document.getElementById('telefono').addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');  // Remove all non-digit characters
    var formattedValue = '';

    if (value.length <= 3) {
        formattedValue = value;
    } else if (value.length <= 6) {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length <= 10) {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }

    e.target.value = formattedValue; // Set the formatted value back to the input field
});

// Formatea el campo de cedula
document.getElementById('rncCedula').addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');  // Remove all non-digit characters
    var formattedValue = '';

    if (value.length <= 3) {
        formattedValue = value;
    } else if (value.length <= 10) {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3, 10);
    } else {
        formattedValue = value.slice(0, 3) + '-' + value.slice(3, 10) + '-' + value.slice(10, 11);
    }

    e.target.value = formattedValue; 
});