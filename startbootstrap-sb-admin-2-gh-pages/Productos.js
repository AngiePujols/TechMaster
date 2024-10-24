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
        body += '<td>' + data[i].costo_unitario + '</td>';
        body += '<td>' + data[i].precio_unitario + '</td>';
        body += '<td>' + data[i].stock + '</td>';
        body += '<td>' + data[i].categoria_id + '</td>';
        body += '<td>' + data[i].marca + '</td>';
        body += '<td>' + data[i].estado + '</td>';
        body += '<td>' + '<a href="#" class="edit" title="Edit" data-toggle="tooltip">' +
            '<i class="bi bi-vector-pen">' + '</i>' + '</a>' + '<a href="#" class="delete" title="Delete" data-toggle="tooltip">' +
            '<i class="bi bi-trash3-fill">' + '</i>' + '</a>' + '</td>';

        body += '</tr>';

    }
    document.getElementById('tableRows').innerHTML = body;
}


