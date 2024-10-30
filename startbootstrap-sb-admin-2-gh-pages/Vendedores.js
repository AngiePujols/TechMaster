fetch("https://localhost:7278/api/Vendedores/GetVendedores")
    .then(response => response.json())
    .then(data => showdata(data))
    .catch(error => console.log(error));

const showdata = (data) => {
    let body = '';
    for (let i = 0; i < data.length; i++) {
        body += '<tr>';
        body += '<td>' + data[i].id + '</td>';
        body += '<td>' + '<img src="./img/' + data[i].foto + '" width="80" height="80">' + '</td>';
        body += '<td>' + data[i].nombre + '</td>';
        body += '<td>' + data[i].direccion + '</td>';
        body += '<td>' + data[i].telefono + '</td>';
        body += '<td>' + data[i].email + '</td>';
        
        // Formatear fechas
        body += '<td>' + formatDate(data[i].fecha_nacimiento) + '</td>';
        body += '<td>' + formatDate(data[i].fecha_contratacion) + '</td>';
        
        body += '<td>' + data[i].porcentaje_comision + '%' + '</td>';
        body += '<td>' + data[i].estado + '</td>';
        body += '<td>' +
            '<a href="Editar-Vendedor.html?id=' + data[i].id + '" class="edit" title="Edit">' +
            '<i class="bi bi-vector-pen"></i></a>' +
            '<a href="#" class="delete" data-id="' + data[i].id + '" title="Delete">' +
            '<i class="bi bi-trash3-fill"></i></a>' +
            '</td>';
        body += '</tr>';  

    }

    document.getElementById('tableRows').innerHTML = body;
    
// Agregar eventos de eliminar
document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', eliminarVendedor);
});
};

const eliminarVendedor = (event) => {
    event.preventDefault();
    // Obtener el ID del vendedor desde el atributo data-id
    const vendedorId = event.target.closest('a').getAttribute('data-id');

    if (confirm('¿Estás seguro de que deseas eliminar este vendedor?')) {
        fetch(`https://localhost:7278/api/Vendedores/Delete/${vendedorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al Eliminar el Vendedor');
            alert('Vendedor eliminado con éxito');
            // Refrescar la lista de vendedores
            return fetch("https://localhost:7278/api/Vendedores/GetVendedores")
                .then(response => response.json())
                .then(data => showdata(data));
        })
        .catch(error => {
            console.log('Error al Eliminar el Vendedor:', error);
            alert('Ha ocurrido un Error al Eliminar el Vendedor');
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


// Función para formatear la fecha
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString); // Convierte la cadena de fecha a un objeto Date
    return date.toLocaleDateString('es-DO', options); // Formato 'DD/MM/YYYY'
}

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







