document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const vendedorID = params.get('id');

    console.log('Vendedor ID desde la URL:', vendedorID);

    if (vendedorID) {
        fetch(`https://localhost:7278/api/Vendedores/GetVendedor/${vendedorID}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener el vendedor');
                return response.json();
            })
            .then(data => {
                console.log('Vendedor:', data);
                document.getElementById('id').value = data.id;
                document.getElementById('nombreVendedor').value = data.nombre;
                document.getElementById('direccion').value = data.direccion;
                document.getElementById('telefono').value = data.telefono;
                document.getElementById('email').value = data.email;
                document.getElementById('porcentajeComision').value = data.porcentaje_comision;
                 // Convierte las fechas a tipo Date
                 const fechaNacimiento = new Date(data.fecha_nacimiento);
                 const fechaContratacion = new Date(data.fecha_contratacion);
 
                 // Establece las fechas en el formato "yyyy-MM-dd"
                 document.getElementById('fechaNacimiento').value = fechaNacimiento.toISOString().split('T')[0];
                 document.getElementById('fechaContratacion').value = fechaContratacion.toISOString().split('T')[0];

                const fotoPreview = document.getElementById('fotoPreview');
                fotoPreview.src = `img/${data.foto}`; // Asegúrate de que la ruta sea correcta
                fotoPreview.style.display = 'block'; // Muestra la imagen

                document.getElementById('estado').value = (data.estado.toLowerCase() === 'activo') ? 'Activo' : 'Inactivo'; 
            })

            .catch(error => {
                console.log('Error:', error);
                alert('Ha ocurrido un error al cargar los datos del vendedor');
            });
    }

    document.getElementById('vendorForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const vendedorActualizado = {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombreVendedor').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            fecha_nacimiento: document.getElementById('fechaNacimiento').value,
            fecha_contratacion: document.getElementById('fechaContratacion').value,
            porcentaje_comision: parseFloat(document.getElementById('porcentajeComision').value),
            foto: document.getElementById('nuevaFoto').files[0] ? document.getElementById('nuevaFoto').files[0].name : '',
            estado: document.getElementById('estado').value
        };

        fetch('https://localhost:7278/api/Vendedores/Update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vendedorActualizado)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Vendedor actualizado:', data);
                alert('Vendedor actualizado con éxito');
                window.location.href = 'Vendedores.html';
            })
            .catch(error => {
                console.error('Error al actualizar vendedor:', error);
                alert('Ha ocurrido un error al actualizar el vendedor');
            });
    });
});


