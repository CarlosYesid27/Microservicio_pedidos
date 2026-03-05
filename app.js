const API = 'http://localhost:8000/api';

const form            = document.getElementById('formPedido');
const cuerpoTabla     = document.getElementById('cuerpoTabla');
const filaVacia       = document.getElementById('filaVacia');
const contadorPedidos = document.getElementById('contadorPedidos');
const btnLimpiar      = document.getElementById('btnLimpiar');
const mensaje         = document.getElementById('mensaje');

const estadoClase = {
  'Pendiente':  'estado-pendiente',
  'Entregado':  'estado-entregado',
  'Cancelado':  'estado-cancelado',
};

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => { mensaje.className = 'mensaje oculto'; }, 3000);
}

function actualizarContador(n) {
  if (!contadorPedidos) return;
  contadorPedidos.textContent = `${n} pedido${n !== 1 ? 's' : ''}`;
}

function renderTabla(pedidos) {
  Array.from(cuerpoTabla.querySelectorAll('tr.fila-pedido')).forEach(f => f.remove());

  if (pedidos.length === 0) {
    filaVacia.style.display = '';
  } else {
    filaVacia.style.display = 'none';
    pedidos.forEach((p) => {
      const tr = document.createElement('tr');
      tr.className = 'fila-pedido';
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.id_usuario}</td>
        <td>${p.id_producto}</td>
        <td>${p.cantidad}</td>
        <td><span class="estado-badge ${estadoClase[p.estado] || ''}">${p.estado}</span></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${p.id})">Eliminar</button>
        </td>
      `;
      cuerpoTabla.appendChild(tr);
    });
  }
  actualizarContador(pedidos.length);
}

async function cargarPedidos() {
  try {
    const res = await fetch(`${API}/pedidos`);
    if (!res.ok) throw new Error();
    const pedidos = await res.json();
    renderTabla(pedidos);
  } catch {
    mostrarMensaje('Error al conectar con el servidor.', 'mensaje-error');
  }
}

async function eliminarPedido(id) {
  try {
    const res = await fetch(`${API}/pedidos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    mostrarMensaje('Pedido eliminado correctamente.', 'mensaje-error');
    cargarPedidos();
  } catch {
    mostrarMensaje('Error al eliminar el pedido.', 'mensaje-error');
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const pedido = {
    id:          parseInt(document.getElementById('id').value),
    id_usuario:  parseInt(document.getElementById('id_usuario').value),
    id_producto: parseInt(document.getElementById('id_producto').value),
    cantidad:    parseInt(document.getElementById('cantidad').value),
    estado:      document.getElementById('estado').value,
  };

  try {
    const res = await fetch(`${API}/pedidos`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(pedido),
    });

    if (res.status === 409) {
      const err = await res.json();
      mostrarMensaje(err.detail, 'mensaje-error');
      return;
    }

    if (!res.ok) throw new Error();

    mostrarMensaje('Pedido agregado exitosamente.', 'mensaje-exito');
    form.reset();
    cargarPedidos();
  } catch {
    mostrarMensaje('Error al guardar el pedido.', 'mensaje-error');
  }
});

btnLimpiar.addEventListener('click', () => form.reset());

cargarPedidos();

