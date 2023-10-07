import React, { useState, useEffect, Fragment } from "react";
import clienteAxios from "../../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";
import Swal from "sweetalert2";

function NuevoPedido(props) {
  const { id } = useParams();
  const history = useNavigate();

  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);

  useEffect(() => {
    const consultarAPI = async () => {
      const resultado = await clienteAxios.get(`/clientes/${id}`);
      guardarCliente(resultado.data);
    };

    consultarAPI();
    actualizarTotal();
  }, [productos]);

  const buscarProducto = async (e) => {
    e.preventDefault();
    const resultadoBusqueda = await clienteAxios.post(
      `/productos/busqueda/${busqueda}`
    );

    if (resultadoBusqueda.data[0]) {
      let productoResultado = resultadoBusqueda.data[0];
      productoResultado.producto = resultadoBusqueda.data[0]._id;
      productoResultado.cantidad = 0;
      guardarProductos([...productos, productoResultado]);
    } else {
      Swal.fire({
        icon: "error",
        title: "No Resultados",
        text: "No hay resultados",
      });
    }
  };

  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };

  const restarProductos = (i) => {
    const todosProductos = [...productos];
    if (todosProductos[i].cantidad === 0) return;
    todosProductos[i].cantidad--;
    guardarProductos(todosProductos);
  };

  const aumentarProductos = (i) => {
    const todosProductos = [...productos];
    todosProductos[i].cantidad++;
    guardarProductos(todosProductos);
  };

  const eliminarProductoPedido = (id) => {
    const todosProductos = productos.filter(
      (producto) => producto.producto !== id
    );
    guardarProductos(todosProductos);
  };

  const actualizarTotal = () => {
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }

    let nuevoTotal = 0;
    productos.map(
      (producto) => (nuevoTotal += producto.cantidad * producto.precio)
    );
    guardarTotal(nuevoTotal);
  };

  const realizarPedido = async (e) => {
    e.preventDefault();
    const pedido = {
      cliente: id,
      pedido: productos,
      total: total,
    };
    // const pedido = {
    //   cliente: "id--------------",
    //   pedido: "productos",
    //   total: "total",
    // };

    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

    if (resultado.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Correcto",
        text: resultado.data.mensaje,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un Error",
        text: "Vuelva a intentarlo",
      });
    }

    history("/pedidos");
  };

  return (
    <Fragment>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Teléfono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            eliminarProductoPedido={eliminarProductoPedido}
            index={index}
          />
        ))}
      </ul>

      <p className="total">
        Total a Pagar: <span>$ {total}</span>{" "}
      </p>

      {total > 0 ? (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      ) : null}
    </Fragment>
  );
}

export default NuevoPedido;
