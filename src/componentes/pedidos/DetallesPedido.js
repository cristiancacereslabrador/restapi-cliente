import React, { Fragment } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

function DetallesPedido({ pedido }) {
  const { cliente } = pedido;
  // console.log("pedido", pedido);
  // console.log("cliente", cliente);
  // console.log("pedido.producto", pedido.producto);
  const eliminarPedido = (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Un pedido eliminado no se puede recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, elimínalo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // llamado a axios
        clienteAxios.delete(`/pedidos/${id}`).then((res) => {
          console.log("res de eliminarPedido", res);
          Swal.fire("Eliminado!", res.data.mensaje, "success");
        });
      }
    });
  };

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido._id}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}{" "}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          {/* <ul>
            {pedido.pedido.map((articulos) =>
              console.log(" articulos.producto:", articulos.cantidad)
            )}
          </ul> */}
          <ul>
            {pedido.pedido.map((articulos) => (
              <li key={pedido._id + articulos.producto._id}>
                <p>
                  {articulos.producto
                    ? articulos.producto.nombre
                    : "Nombre no disponible"}
                </p>
                <p>
                  Precio: $
                  {articulos.producto
                    ? articulos.producto.precio
                    : "Precio no disponible"}
                </p>
                <p>Cantidad: {articulos.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="total">Total: ${pedido.total} </p>
      </div>
      <div className="acciones">
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarPedido(pedido._id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
}

export default DetallesPedido;
