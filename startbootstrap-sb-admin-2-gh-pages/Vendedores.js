fetch("https://localhost:7278/api/Vendedores/GetVendedores")
.then(response => response.json())
.then(data => showdata(data))
.catch(error => console.log(error))

const showdata = (data) => {
    let body='';
    for (let i = 0; i < data.length; i++) {
        body += '<tr>';
        body += '<td>' + data[i].id + '</td>';
        body += '<td>' + data[i].foto + '</td>';
        body += '<td>' + data[i].nombre + '</td>';
        body += '<td>' + data[i].direccion + '</td>';
        body += '<td>' + data[i].telefono + '</td>';
        body += '<td>' + data[i].email + '</td>';
        body += '<td>' + data[i].fecha_nacimiento + '</td>';
        body += '<td>' + data[i].fecha_contratacion + '</td>';
        body += '<td>' + data[i].porcentaje_comision + '</td>';
        body += '<td>' + data[i].estado + '</td>';
        body += '<td>' + '<a href="#" class="edit" title="Edit" data-toggle="tooltip">'+
        '<i class="bi bi-vector-pen">'+'</i>'+'</a>' + '<a href="#" class="delete" title="Delete" data-toggle="tooltip">'+ 
        '<i class="bi bi-trash3-fill">'+'</i>'+'</a>' + '</td>';

        body += '</tr>';
    
    }
    document.getElementById('tableRows').innerHTML = body;
}

