fetch("https://localhost:7167/api/Vehiculo/GetVehiculos")
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener las facturas');
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data); // Verificar los datos
        showdata(data);
    })
    .catch(error => console.error('Error:', error));


const showdata = (data) => {
    let body = '';
    for (let vehiculo of data) {
        body += '<tr>';
        body += '<td>' + vehiculo.id + '</td>'; // ID del vehículo
        body += '<td>' + (vehiculo.tipoVehiculoNombre) + '</td>'; // Tipo de vehículo
        body += '<td>' + (vehiculo.marcaNombre) + '</td>'; // Marca del vehículo
        body += '<td>' + (vehiculo.modeloNombre) + '</td>'; // Modelo del vehículo
        body += '<td>' + (vehiculo.tipoCombustibleNombre) + '</td>'; // Tipo de combustible
        body += '<td>' + vehiculo.placa + '</td>'; // Placa del vehículo
        body += '<td>' + vehiculo.estado + '</td>'; // Estado del vehículo

        // Botones de acciones
        body += '<td>' +
            '<a href="detalle-vehiculo.html?id=' + vehiculo.id + '" class="view" title="View">' +
            '<i class="bi bi-eye-fill"></i>' +
            '</a>' +
            '<a href="editar-vehiculo.html?id=' + vehiculo.id + '" class="edit" title="Edit">' +
            '<i class="bi bi-vector-pen"></i>' +
            '</a>' +
            '<a href="#" class="delete" data-id="' + vehiculo.id + '" title="Delete">' +
            '<i class="bi bi-trash3-fill"></i>' +
            '</a>' +
            '</td>';
        body += '</tr>';
    }
    document.getElementById('tableRows').innerHTML = body; // Insertar las filas en la tabla

    // Agregar eventos de eliminar
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', eliminarFactura);
    });
};

// Función para formatear la fecha a dd-mm-yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son indexados desde 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Función para formatear el valor monetario
function formatCurrency(value) {
    return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


const eliminarFactura = (event) => {
    event.preventDefault();
    const facturaId = event.target.closest('a').getAttribute('data-id'); // Obtiene el ID de la factura

    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
        fetch(`https://localhost:7278/api/Facturacion/Delete/${facturaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar la factura');
                alert('Factura eliminada con éxito');
                // Refrescar la lista de facturas
                return fetch("https://localhost:7278/api/Facturacion/GetFacturas")
                    .then(response => response.json())
                    .then(data => showdata(data)); // Asegúrate de tener la función showdata para mostrar los datos
            })
            .catch(error => {
                console.log('Error al eliminar la factura:', error);
                alert('Ha ocurrido un error al eliminar la factura');
            });
    }
};

// Agregar evento de búsqueda
var searchButton = document.querySelector('.search-button');
var search = document.getElementById('search');

search.addEventListener('click', function (e) {
    var value = e.target.value.toLowerCase();
    var rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {

        var isMatch = Array.from(row.querySelectorAll('td')).some(cell =>
            cell.textContent.toLowerCase().includes(value)
        );
        row.style.display = isMatch ? '' : 'none';
    });
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

