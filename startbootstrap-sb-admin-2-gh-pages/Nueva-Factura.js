let articuloOptions = [];  // Variable global para almacenar las opciones de artículos

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
function addItem() {
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
                <input type="number" class="form-control" name="cantidad[]" placeholder="Ej: 10" required>
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
        option.value = optionData.value; // Asegúrate de que aquí el value es correcto
        option.textContent = optionData.text;
        newArticuloSelect.appendChild(option);
    });
}

// Función para eliminar una fila de artículo
function removeItem(button) {
    button.closest('.item-group').remove();
}

// Evento para guardar la factura
document.getElementById('facturaForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Captura los valores del formulario
    const facturaData = {
        vendedor_id: document.getElementById('vendedor_id').value,
        cliente_id: document.getElementById('cliente_id').value,
        condicion_pago_id: document.getElementById('condicion_pago_id').value,
        fecha: new Date().toISOString(), // Usa la fecha actual en formato ISO
        detalle_Factura: [] // Para almacenar los detalles de los artículos
    };

    // Captura los detalles de los artículos
    const itemGroups = document.querySelectorAll('.item-group');
    itemGroups.forEach(group => {
        const articuloSelect = group.querySelector('select[name="articulo_id[]"]');
        const cantidadInput = group.querySelector('input[name="cantidad[]"]');
        const articulo_id = articuloSelect.value;

        if (articulo_id && cantidadInput.value) {
            facturaData.detalle_Factura.push({
                articulo_id: articulo_id,
                cantidad: parseInt(cantidadInput.value, 10) // Asegúrate de que la cantidad sea un número
            });
        }
    });

    // Realiza la solicitud POST
    console.log(facturaData); // Para depuración
    fetch('https://localhost:7278/api/Facturacion/Save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(facturaData) // Convierte el objeto JS en JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Factura guardada:', data);
            alert('Factura guardada con éxito');
            // Redirige a la lista de facturas o a donde desees
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.log('Error al guardar factura:', error);
            alert('Ha ocurrido un error al guardar la factura: ' + error.message);
        });
});
