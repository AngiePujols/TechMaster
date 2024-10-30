let articuloOptions = []; // Variable global para almacenar las opciones de artículos

document.addEventListener("DOMContentLoaded", function () {
    // Función para poblar selectores desde un endpoint
    function populateSelect(url, selectElement, valueField, textField) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (selectElement) {
                    // Limpia las opciones actuales
                    selectElement.innerHTML = ''; // Asegúrate de que el select esté vacío antes de agregar nuevas opciones

                    // Agrega la opción por defecto
                    const defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.textContent = "Selecciona una opción";
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    selectElement.appendChild(defaultOption);

                    // Llenamos el select actual
                    data.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item[valueField]; // ID como value
                        option.textContent = item[textField]; // Nombre como texto visible
                        selectElement.appendChild(option);
                    });
                }

                // Guardamos los artículos en la variable global para futuros selectores
                if (url.includes('Articulos')) {
                    articuloOptions = data.map(item => {
                        return { value: item[valueField], text: item[textField] };
                    });
                }
            })
            .catch(error => console.error(`Error al cargar ${selectElement.id}:`, error));
    }

    // Poblar selectores iniciales
    populateSelect('https://localhost:7278/api/Vendedores/GetVendedores', document.getElementById('vendedor_id'), 'id', 'nombre');
    populateSelect('https://localhost:7278/api/Customer/GetClientes', document.getElementById('cliente_id'), 'id', 'nombreComercial');
    populateSelect('https://localhost:7278/api/CondicionesPago/GetCondicionesPago', document.getElementById('condicion_pago_id'), 'id', 'descripcion');

    // Llenar el selector de artículos inicial
    populateSelect('https://localhost:7278/api/Articulos/GetArticulos', document.getElementById('articulo_id'), 'id', 'nombre');
});

// Función para añadir una nueva fila de artículo
function addItem(articuloId = "", cantidad = "") {
    const itemGroup = document.createElement('div');
    itemGroup.classList.add('item-group');

    // Crear la estructura de la nueva fila de artículo
    itemGroup.innerHTML = `
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="articulo_id" style="font-weight: bold;">Artículo</label>
                <select class="form-control" name="articulo_id[]" required>
                    <option value="" disabled selected>Selecciona un Artículo</option>
                </select>
            </div>
            <div class="form-group col-md-3">
                <label for="cantidad" style="font-weight: bold;">Cantidad</label>
                <input type="number" class="form-control" name="cantidad[]" placeholder="Ej: 10" value="${cantidad}" required>
            </div>
            <div class="form-group col-md-3">
                <button type="button" class="btn btn-danger mt-4" onclick="removeItem(this)">Eliminar</button>
            </div>
        </div>
    `;

    // Añadir la nueva fila al contenedor de detalles
    document.getElementById('detalleContainer').appendChild(itemGroup);

    // Llenar el nuevo selector de artículo con las opciones guardadas
    const newArticuloSelect = itemGroup.querySelector('select[name="articulo_id[]"]');
    articuloOptions.forEach(optionData => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.text;
        if (optionData.value === articuloId) option.selected = true; // Selecciona el artículo si coincide
        newArticuloSelect.appendChild(option);
    });
}

// Función para eliminar una fila de artículo
function removeItem(button) {
    button.closest('.item-group').remove();
}



document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const facturaId = params.get('id'); // Obtener el ID de la factura desde la URL

    console.log('Factura ID desde la URL:', facturaId);

    if (facturaId) {
        fetch(`https://localhost:7278/api/Facturacion/GetFactura/${facturaId}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener la factura');
                return response.json();
            })
            .then(data => {
                console.log('Factura:', data);
                document.getElementById('id').value = data.id;

                // Asigna el valor seleccionado en los selectores basados en el texto del nombre
                const vendedorSelect = document.getElementById('vendedor_id');
                const clienteSelect = document.getElementById('cliente_id');
                const condicionPagoSelect = document.getElementById('condicion_pago_id');

                [...vendedorSelect.options].forEach(option => {
                    if (option.text === data.vendedorNombre) {
                        option.selected = true;
                    }
                });

                [...clienteSelect.options].forEach(option => {
                    if (option.text === data.clienteNombre) {
                        option.selected = true;
                    }
                });

                [...condicionPagoSelect.options].forEach(option => {
                    if (option.text === data.condicionPagoNombre) {
                        option.selected = true;
                    }
                });

                document.getElementById('fecha').value = data.fecha;


                // Llenar los detalles de la factura
                data.detalles.forEach(detalle => {
                    addItem(detalle.articulo_id, detalle.cantidad);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ha ocurrido un error al cargar los datos de la factura');
            });
    }
});



// Escucha el evento de envío del formulario
document.getElementById('facturaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Captura todos los detalles de la factura en el formato correcto
    const detalle_Factura = [...document.querySelectorAll('.item-group')].map(itemGroup => {
        const articuloSelect = itemGroup.querySelector('select[name="articulo_id[]"]');
        const cantidadInput = itemGroup.querySelector('input[name="cantidad[]"]');

        // Verificar si articuloSelect y cantidadInput no son null
        if (articuloSelect && cantidadInput) {
            return {
                articulo_id: parseInt(articuloSelect.value), // Captura solo el value del select
                cantidad: parseInt(cantidadInput.value) // Captura el valor del input de cantidad
            };
        } else {
            console.warn("Elemento no encontrado en 'item-group'.");
            return null; // Devuelve null si no encuentra el elemento
        }
    }).filter(item => item !== null); // Filtra elementos nulos en caso de que existan

    // Crear el objeto de factura con los datos capturados en el formato que espera la API
    const facturaActualizada = {
        id: parseInt(document.getElementById('id').value),
        vendedor_id: parseInt(document.getElementById('vendedor_id').value),
        cliente_id: parseInt(document.getElementById('cliente_id').value),
        condicion_pago_id: parseInt(document.getElementById('condicion_pago_id').value),
        fecha: document.getElementById('fecha').value,
        detalle_Factura: detalle_Factura // Pasar los detalles con el nombre correcto
    };

    console.log('Factura a enviar:', facturaActualizada);

    // Enviar la factura al endpoint mediante PUT
    fetch('https://localhost:7278/api/Facturacion/Update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(facturaActualizada)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Factura actualizada:', data);
        alert('Factura actualizada con éxito');
        window.location.href = 'index.html'; // Redirigir después de la actualización
    })
    .catch(error => {
        console.error('Error al actualizar la factura:', error);
        alert('Ha ocurrido un error al actualizar la factura');
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
