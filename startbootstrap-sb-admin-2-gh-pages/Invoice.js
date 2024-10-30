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

                // Asignar el número de factura
                const invoiceNumber = document.getElementById('invoice-number');
                if (invoiceNumber) {
                    invoiceNumber.textContent = data.id; // Número de factura
                }

                // Vendedor y Cliente
                const vendedorElem = document.getElementById('vendedor-name');
                const clienteElem = document.getElementById('cliente-name');
                if (vendedorElem) vendedorElem.innerHTML = `${data.vendedorNombre}`;
                if (clienteElem) clienteElem.innerHTML = `${data.clienteNombre}`;

                // Condición de Pago y Fecha
                const condicionPagoElem = document.getElementById('condicion-pago');
                const fechaElem = document.getElementById('fecha');
                if (condicionPagoElem) condicionPagoElem.innerHTML = `${data.condicionPagoNombre}`;
                if (fechaElem) fechaElem.innerHTML = `${formatDate(data.fecha)}`;

                // Llenar los detalles de la factura
                populateInvoiceDetails(data.detalles);

                // Mostrar totales
                displayTotals(data.subtotal, data.itbis, data.total, data.vendedorComision);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ha ocurrido un error al cargar los datos de la factura');
            });
    }

    // Función para formatear la fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    // Función para formatear números con comas y decimales
    function formatNumber(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Función para llenar los detalles de la factura
    function populateInvoiceDetails(detalles) {
        const detailsContainer = document.getElementById('invoice-details'); // Asume que hay un contenedor para los detalles
        if (detailsContainer) {
            detailsContainer.innerHTML = ''; // Limpiar contenido previo

            detalles.forEach(detalle => {
                const row = document.createElement('tr');
                const totalItem = detalle.cantidad * detalle.precio_unitario; // Total por item
                row.innerHTML = `
                    <td>${detalle.articuloNombre}</td>
                    <td>${detalle.cantidad}</td>
                    <td>RD$ ${formatNumber(detalle.precio_unitario)}</td>
                    <td>RD$ ${formatNumber(totalItem)}</td>
                `;
                detailsContainer.appendChild(row);
            });
        }
    }

    // Función para mostrar los totales
    function displayTotals(subtotal, itbis, total, vendedorComision) {
        const comisionElem = document.getElementById('comision-vendedor');
        if (comisionElem) {
            comisionElem.textContent = `RD$ ${formatNumber(vendedorComision * subtotal / 100)}`; // Comisión del Vendedor
        }

        const subtotalElem = document.getElementById('subtotal');
        if (subtotalElem) {
            subtotalElem.textContent = formatNumber(subtotal); // Subtotal
        }

        const itbisElem = document.getElementById('itbis');
        if (itbisElem) {
            itbisElem.textContent = formatNumber(itbis); // ITBIS
        }

        const totalElem = document.getElementById('total');
        if (totalElem) {
            totalElem.textContent = formatNumber(total); // Total
        }
    }
});
