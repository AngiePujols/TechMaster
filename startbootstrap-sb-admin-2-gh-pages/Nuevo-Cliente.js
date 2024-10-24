document.getElementById('customerForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const nuevoCliente = {
       
        nombreComercial: document.getElementById('nombreComercial').value,
        cedula: document.getElementById('cedula').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        activo: document.getElementById('estado').value
    };

 
    fetch('https://localhost:7278/api/Customer/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente) 
        .then(response => response.json())
        .then(data => {
            console.log('Cliente guardado:', data);
            alert('Cliente guardado con éxito');
        })
        .catch(error => {
            console.log('Error al guardar cliente:', error);
            alert('Ocurrió un error al guardar el cliente');
        });
});


