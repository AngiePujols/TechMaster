fetch("https://localhost:7278/api/Customer/GetClientes")
    .then(response => response.json())
    .then(data => showdata(data))
    .catch(error => console.log(error))

const showdata = (data) => {
    let body = '';
    for (let i = 0; i < data.length; i++) {
        body += '<tr>';
        body += '<td>' + data[i].id + '</td>';
        body += '<td>' + data[i].nombreComercial + '</td>';
        body += '<td>' + data[i].cedula + '</td>';
        body += '<td>' + data[i].direccion + '</td>';
        body += '<td>' + data[i].telefono + '</td>';
        body += '<td>' + data[i].correo + '</td>';
        body += '<td>' + data[i].activo + '</td>';
        body += '<td>' +
            '<a href="editar-cliente.html?id=' + data[i].id + '" class="edit" title="Edit">' +
            '<i class="bi bi-vector-pen"></i></a>' +
            '<a href="#" class="delete" data-id="' + data[i].id + '" title="Delete">' +
            '<i class="bi bi-trash3-fill"></i></a>' +
            '</td>';
        body += '</tr>';

        body += '</tr>';

    }
    document.getElementById('tableRows').innerHTML = body;

    // Agregar eventos de eliminar
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', eliminarCliente);
    });

};


const eliminarCliente = (event) => {
    event.preventDefault();
    const clienteId = event.target.closest('a').getAttribute('data-id');

    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        fetch(`https://localhost:7278/api/Customer/Delete/${clienteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar cliente');
                alert('Cliente eliminado con éxito');
                // Refrescar la lista de clientes
                return fetch("https://localhost:7278/api/Customer/GetClientes")
                    .then(response => response.json())
                    .then(data => showdata(data));
            })
            .catch(error => {
                console.log('Error al eliminar cliente:', error);
                alert('Ha ocurrido un error al eliminar el cliente');
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