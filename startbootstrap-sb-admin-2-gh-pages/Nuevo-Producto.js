
document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // Captura los valores del formulario
    const nuevoProducto = {

        nombre: document.getElementById('nombreProducto').value,
        descripcion: document.getElementById('descripcion').value,
        costo_unitario: parseFloat(document.getElementById('costoUnitario').value.replace(/\$|,/g, '').trim()),
        stock: document.getElementById('stock').value,
        categoria_id: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        estado: 'Disponible'


    };

    // Realiza la solicitud POST
    fetch('https://localhost:7278/api/Articulos/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto) // Convierte el objeto JS en JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Producto Guardado:', data);
            alert('Producto Guardado con Éxito');
            window.location.href = 'Productos.html';
        })
        .catch(error => {
            console.log('Error al Guardar el Producto:', error);
            alert('Ha ocurrido un Error al Guardar el Producto');
        });
});


// Formatea el campo de costo
$('#costoUnitario').on('keyup', function(e) {
    let parts = $(this).val().split(".");
    let v = parts[0].replace(/\D/g, "");
    let dec = parts[1];
    let calc_num = Number((dec !== undefined ? v + "." + dec : v));

    // Formatear el número
    let n = new Intl.NumberFormat('en-US').format(v);
    n = dec !== undefined ? n + "." + dec : n;

    // Añadir el símbolo de moneda
    $(this).val(n ? '$ ' + n : '');
});


// Recupera el nombre del usuario de localStorage y lo muestra en el span
document.addEventListener('DOMContentLoaded', function () {
    // Recupera nombre y apellido del usuario
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const apellidoUsuario = localStorage.getItem('apellidoUsuario');

    // Muestra nombre completo en el span
    if (nombreUsuario && apellidoUsuario) {
        document.getElementById('userNameDisplay').textContent = `${nombreUsuario} ${apellidoUsuario}`;
    }
});
