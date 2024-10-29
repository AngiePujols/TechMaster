fetch("https://localhost:7278/api/Facturacion/GetFacturas")
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
    for (let factura of data) {
        body += '<tr>';
        body += '<td>' + factura.id + '</td>';
        body += '<td>' + (factura.clienteNombre) + '</td>'; // Nombre del cliente
        body += '<td>' + formatDate(factura.fecha) + '</td>'; // Formato de fecha
        body += '<td>' + (factura.condicionPagoNombre) + '</td>'; // Condición de pago
        body += '<td>' + formatCurrency(factura.total) + '</td>'; // Mostrar el total con formato
        body += '<td>' + (factura.vendedorNombre) + '</td>'; // Nombre del vendedor

        // Calcular la comisión
        const comisionMonto = (factura.total * (factura.vendedorComision / 100)).toFixed(2); // Calcular el monto de la comisión
        body += '<td>' + formatCurrency(comisionMonto) + '</td>'; // Mostrar el monto de la comisión

        // Botones de editar y eliminar
        body += '<td>' +
            '<a href="#" class="view" title="View" data-toggle="tooltip">' +
            '<i class="bi bi-eye-fill"></i>' +
            '</a>' +
            '<a href="editar-factura.html?id=' + factura.id + '" class="edit" title="Edit">' +
            '<i class="bi bi-vector-pen"></i>' +
            '</a>' +
            '<a href="#" class="delete" data-id="' + factura.id + '" title="Delete">' +
            '<i class="bi bi-trash3-fill"></i>' +
            '</a>' +
            '</td>';
        body += '</tr>';
    }

    document.getElementById('tableRows').innerHTML = body;

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