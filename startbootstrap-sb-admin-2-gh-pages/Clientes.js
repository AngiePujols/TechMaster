// Obtener los datos de los clientes desde la API
fetch("https://localhost:7167/api/Clientes/GetClientes")
  .then((response) => response.json())
  .then((data) => showData(data))
  .catch((error) => console.log(error));

// Función para mostrar los datos en la tabla
const showData = (data) => {
  let body = "";
  for (let i = 0; i < data.length; i++) {
    body += "<tr>";
    body += "<td>" + data[i].id + "</td>";
    body += "<td>" + data[i].nombre + "</td>"; // Nombre
    body += "<td>" + data[i].apellido + "</td>"; // Apellido
    body += "<td id='cedula" + data[i].id + "'>" + data[i].cedula + "</td>"; // Cédula
    body += "<td>" + data[i].noTarjetaCredito + "</td>"; // Número de Tarjeta de Crédito
    body += "<td>" + data[i].limiteCredito + "</td>"; // Límite de Crédito
    body += "<td>" + data[i].tipoPersona + "</td>"; // Tipo de Persona
    body += "<td>" + data[i].estado + "</td>"; // Estado
    body +=
      "<td>" +
      '<a href="editar-cliente.html?id=' +
      data[i].id +
      '" class="edit" title="Edit">' +
      '<i class="bi bi-vector-pen"></i></a>' +
      '<a href="#" class="delete" data-id="' +
      data[i].id +
      '" title="Delete">' +
      '<i class="bi bi-trash3-fill"></i></a>' +
      "</td>";
    body += "</tr>";
  }
  document.getElementById("tableRows").innerHTML = body;

  // Agregar eventos de eliminar
  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", eliminarCliente);
  });
};

// Función para eliminar un cliente
const eliminarCliente = (event) => {
  event.preventDefault();
  const clienteId = event.target.closest("a").getAttribute("data-id"); // Obtiene el ID del cliente

  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    fetch(`https://localhost:7167/api/Clientes/Delete/${clienteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar el cliente");
        alert("Cliente eliminado con éxito");
        // Refrescar la lista de clientes
        return fetch("https://localhost:7167/api/Clientes/GetClientes")
          .then((response) => response.json())
          .then((data) => showData(data)); // Llama a showData para actualizar la tabla
      })
      .catch((error) => {
        console.log("Error al eliminar el cliente:", error);
        alert("Ha ocurrido un error al eliminar el cliente");
      });
  }
};

// Función para buscar clientes
const search = document.getElementById("search");
search.addEventListener("input", function (e) {
  const value = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const isMatch = Array.from(row.querySelectorAll("td")).some((cell) =>
      cell.textContent.toLowerCase().includes(value)
    );
    row.style.display = isMatch ? "" : "none";
  });
});

// Recupera el nombre del usuario de localStorage y lo muestra en el span
document.addEventListener("DOMContentLoaded", function () {
  // Recupera nombre y apellido del usuario
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const apellidoUsuario = localStorage.getItem("apellidoUsuario");

  // Muestra nombre completo en el span
  if (nombreUsuario && apellidoUsuario) {
    document.getElementById(
      "userNameDisplay"
    ).textContent = `${nombreUsuario} ${apellidoUsuario}`;
  }
}); 