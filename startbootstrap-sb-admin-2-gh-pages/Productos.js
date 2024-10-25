fetch("https://localhost:7278/api/Articulos/GetArticulos")
    .then(response => response.json())
    .then(data => showdata(data))
    .catch(error => console.log(error))

const showdata = (data) => {
    let body = '';
    for (let i = 0; i < data.length; i++) {
        body += '<tr>';
        body += '<td>' + data[i].id + '</td>';
        body += '<td>' + data[i].nombre + '</td>';
        body += '<td>' + data[i].descripcion + '</td>';
        body += '<td>' + '$' + data[i].costo_unitario.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
        body += '<td>' + '$' + data[i].precio_unitario.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")  + '</td>';
        body += '<td>' + data[i].stock + '</td>';
        body += '<td>' + data[i].categoria_id + '</td>';
        body += '<td>' + data[i].marca + '</td>';
        body += '<td>' + data[i].estado + '</td>';
        body += '<td>' +
            '<a href="Editar-Producto.html?id=' + data[i].id + '" class="edit" title="Edit">' +
            '<i class="bi bi-vector-pen"></i></a>' +
            '<a href="#" class="delete" data-id="' + data[i].id + '" title="Delete">' +
            '<i class="bi bi-trash3-fill"></i></a>' +
            '</td>';
        body += '</tr>';

    }
    document.getElementById('tableRows').innerHTML = body;

    // Agregar eventos de eliminar
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', eliminarProducto);
    });
};

const eliminarProducto = (event) => {
    event.preventDefault();
    const ProductoId = event.target.closest('a').getAttribute('data-id');

    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`https://localhost:7278/api/Articulos/Delete/${ProductoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al Eliminar el Producto');
                alert('Producto eliminado con éxito');
                // Refrescar la lista de productos
                return fetch("https://localhost:7278/api/Articulos/GetArticulos")
                    .then(response => response.json())
                    .then(data => showdata(data));
            })
            .catch(error => {
                console.log('Error al Eliminar el Producto:', error);
                alert('Ha ocurrido un Error al Eliminar el Producto');
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
