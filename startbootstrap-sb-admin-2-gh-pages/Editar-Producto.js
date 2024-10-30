document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productoID = params.get('id');

    console.log('Producto ID desde la URL:', productoID);

    if (productoID) {
        fetch(`https://localhost:7278/api/Articulos/GetArticulo/${productoID}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener el producto');
                return response.json();
            })
            .then(data => {
                console.log('Producto:', data);
                document.getElementById('id').value = data.id;
                document.getElementById('nombreProducto').value = data.nombre;
                document.getElementById('descripcion').value = data.descripcion;
                document.getElementById('costoUnitario').value = data.costo_unitario;
                document.getElementById('stock').value = data.stock;
                document.getElementById('categoria').value = data.categoria_id; 
                document.getElementById('marca').value = data.marca;
                document.getElementById('estado').value = (data.estado.toLowerCase() === 'disponible') ? 'Disponible' : 'Descontinuado'; // Verifica el nombre de la propiedad
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Ha ocurrido un error al cargar los datos del producto');
            });
    }


document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault(); 
    
    const productoActualizado = {
        id: document.getElementById('id').value,
        nombre: document.getElementById('nombreProducto').value,
        descripcion: document.getElementById('descripcion').value,
        costo_unitario: parseFloat(document.getElementById('costoUnitario').value.replace(/\$|,/g, '').trim()),
        stock: document.getElementById('stock').value,
        categoria_id: document.getElementById('categoria').value, 
        marca: document.getElementById('marca').value,
        estado: document.getElementById('estado').value
    };

    fetch('https://localhost:7278/api/Articulos/Update', {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoActualizado)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto actualizado:', data);
            alert('Producto actualizado con éxito');
            window.location.href = 'Productos.html'; // Redirige a la página de productos
        })
        .catch(error => {
            console.error('Error al actualizar producto:', error);
            alert('Ha ocurrido un error al actualizar el producto');
        });
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
