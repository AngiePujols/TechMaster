document.getElementById('vendorForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // Captura los valores del formulario
    const nuevoVendedor = {
        nombre: document.getElementById('nombreVendedor').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        fecha_nacimiento: document.getElementById('fechaNacimiento').value,
        fecha_contratacion: document.getElementById('fechaContratacion').value,
        porcentaje_comision: parseFloat(document.getElementById('porcentajeComision').value),
        estado: 'Activo',
        foto: document.getElementById('foto').files[0] ? document.getElementById('foto').files[0].name : '' // Obtiene solo el nombre del archivo
    };

    // Realiza la solicitud POST
    fetch('https://localhost:7278/api/Vendedores/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoVendedor) // Convierte el objeto JS en JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Vendedor Guardado:', data);
            alert('Vendedor Guardado con Éxito');
            window.location.href = 'Vendedores.html'; // Redirige a la página de vendedores
        })
        .catch(error => {
            console.log('Error al Guardar el Vendedor:', error);
            alert('Ha ocurrido un Error al Guardar el Vendedor');
        });
});


