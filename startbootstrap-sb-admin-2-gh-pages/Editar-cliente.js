document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id');

    console.log('Cliente ID desde la URL:', clienteId); 



    if (clienteId) {
        fetch(`https://localhost:7278/api/Customer/GetClientes/${clienteId}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener el cliente');
                return response.json();
            })
            .then(
                data => {
                    console.log('Cliente:', data);
                    document.getElementById('id').value = data.id;
                    document.getElementById('nombreComercial').value = data.nombreComercial;
                    document.getElementById('direccion').value = data.direccion;
                    document.getElementById('rncCedula').value = data.cedula;
                    document.getElementById('correo').value = data.correo;
                    document.getElementById('telefono').value = data.telefono;
                    document.getElementById('activo').value = (data.activo.toLowerCase() === 'activo') ? 'Activo' : 'Desactivo';

            })
            .catch(error => {
                console.log('Error:', error);
                alert('Ha ocurrido un error al cargar los datos del cliente');
            });
    }

    document.getElementById('customerForm').addEventListener('submit', function (event) {
        event.preventDefault();
    
        const clienteActualizado = {
            id:document.getElementById('id').value,
            nombreComercial: document.getElementById('nombreComercial').value,
            cedula: document.getElementById('rncCedula').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            activo: document.getElementById('activo').value
        };
    
        fetch('https://localhost:7278/api/Customer/Update', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteActualizado)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Cliente actualizado:', data);
                alert('Cliente actualizado con éxito');
                window.location.href = 'Clientes.html';
            })
            .catch(error => {
                console.error('Error al actualizar cliente:', error);
                alert('Ha ocurrido un error al actualizar el cliente');
            });
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