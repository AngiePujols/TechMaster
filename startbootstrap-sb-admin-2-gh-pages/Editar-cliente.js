document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id');

    if (clienteId) {
        fetch(`https://localhost:7167/api/Clientes/GetCliente/${clienteId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('id').value = data.id;
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('apellido').value = data.apellido;
                document.getElementById('cedula').value = data.cedula;
                document.getElementById('noTarjetaCredito').value = formatCreditCard(data.noTarjetaCredito);
                document.getElementById('limiteCredito').value = formatCurrency(data.limiteCredito);
                document.getElementById('tipoPersona').value = data.tipoPersona;
                document.getElementById('estado').value = data.estado;
            })
            .catch(() => alert('Error al cargar cliente'));
    }

    // Solo permite ingresar números en la cédula
    document.getElementById('cedula').addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 3 && value.length <= 10) {
            e.target.value = `${value.slice(0, 3)}-${value.slice(3, 10)}`;
        } else if (value.length === 11) {
            e.target.value = `${value.slice(0, 3)}-${value.slice(3, 10)}-${value.slice(10, 11)}`;
        }
    });

    // Función de validación de cédula
    function validaCedula() {
        const cedula = document.getElementById('cedula').value.replace(/\D/g, ''); // Elimina los guiones y espacios

        if (cedula.length !== 11) {
            alert('Cédula Incorrecta');
            return false;
        }

        const c = cedula.split('');
        const v = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]; // Secuencia de multiplicadores
        let result = 0;

        for (let i = 0; i < 10; i++) {
            let up = c[i] * v[i];
            let ab = up;
            let oc = ab >= 10 ? ab.toString().split('').map(x => parseInt(x)).reduce((x, y) => x + y) : ab;
            result += oc;
        }

        let dp = result;
        let ac = parseInt(dp.toString().split('')[0] + '0');
        let uj = (ac / 10) * 10;

        if (uj < dp) {
            dp = (uj + 10) - dp;
        }

        if (c[10] == dp) {
            return true; // La cédula es válida
        } else {
            alert('Cédula Incorrecta');
            return false; // La cédula es incorrecta
        }
    }

    // Validación de cédula al perder el foco o al presionar "Enter"
    document.getElementById('cedula').addEventListener('blur', validaCedula);
    document.getElementById('cedula').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validaCedula();
        }
    });

    // Función de validación de tarjeta
    function validarTarjeta() {
        const numeroTarjeta = document.getElementById('noTarjetaCredito').value.replace(/\D/g, '');
        const tipoTarjeta = document.getElementById('tipoTarjeta');

        if (/^4/.test(numeroTarjeta)) {
            tipoTarjeta.textContent = "Visa 🟦";
        } else if (/^5[1-5]/.test(numeroTarjeta)) {
            tipoTarjeta.textContent = "Mastercard 🟥";
        } else {
            tipoTarjeta.textContent = "";
        }
    }

    // Función para formatear la tarjeta de crédito
    function formatCreditCard(value) {
        let cleaned = value.replace(/\D/g, '').slice(0, 16);
        let formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
        return formatted;
    }

    document.getElementById('noTarjetaCredito').addEventListener('input', function (e) {
        let formattedValue = formatCreditCard(e.target.value);
        e.target.value = formattedValue;
        validarTarjeta();
    });

    // Función para formatear el límite de crédito
    function formatCurrency(value) {
        return "RD$ " + parseFloat(value).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    document.getElementById('limiteCredito').addEventListener('input', function (e) {
        let rawValue = e.target.value.replace(/[^0-9.]/g, '');
        if (rawValue === "") return;
        e.target.value = formatCurrency(rawValue);
    });

    // Envío del formulario (botón "Guardar")
    document.getElementById('customerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Validar cédula antes de enviar el formulario
        if (!validaCedula()) {
            return; // Si la cédula no es válida, no se envía el formulario
        }

        const clienteActualizado = {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            cedula: document.getElementById('cedula').value,
            noTarjetaCredito: document.getElementById('noTarjetaCredito').value.replace(/\D/g, ''),
            limiteCredito: parseFloat(document.getElementById('limiteCredito').value.replace(/[RD$\s,]/g, '')),
            tipoPersona: document.getElementById('tipoPersona').value,
            estado: document.getElementById('estado').value
        };

        fetch('https://localhost:7167/api/Clientes/Update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteActualizado)
        })
            .then(response => response.json())
            .then(() => {
                alert('Cliente actualizado con éxito');
                window.location.href = 'Clientes.html';
            })
            .catch(() => alert('Error al actualizar cliente'));
    });

    // Función para limpiar el formulario sin borrar el id
    function limpiarFormulario() {
        const idValue = document.getElementById('id').value; // Guarda el valor de id
        document.getElementById('customerForm').reset(); // Resetea todo
        document.getElementById('id').value = idValue; // Restaura el id
        document.getElementById('tipoTarjeta').textContent = ""; // Limpia el tipo de tarjeta
    }

    // Evento para limpiar el formulario
    document.getElementById('limpiarBtn').addEventListener('click', limpiarFormulario);
});
