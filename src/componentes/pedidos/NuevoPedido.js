import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";

const NuevoPedido = (props) => {
  //Extraer el id del cliente
  const history = useNavigate();
  const { id } = useParams();
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);
  //Obteneer el cliente
  const consultarAPI = async () => {
    //Consultar cliente actual
    const resultado = await clienteAxios.get(`/clientes/${id}`);
    // console.log("resultado.data", resultado.data);
    guardarCliente(resultado.data);
  };
  useEffect(() => {
    //Llamar a la API
    consultarAPI();
    //Actualizar el total a pagar
    actualizarTotal();
  }, [productos]);

  const { _id, nombre, apellido, email, telefono } = cliente;

  // // const buscarProducto = async (e) => {
  // //   e.preventDefault();

  // //   // Validar que haya un término de búsqueda
  // //   if (busqueda.trim() === "") {
  // //     // Mostrar una alerta indicando que el término de búsqueda está vacío
  // //     Swal.fire({
  // //       icon: "error",
  // //       title: "Campo de búsqueda vacío",
  // //       text: "Por favor, ingresa un término de búsqueda.",
  // //     });
  // //     return; // Detener la ejecución de la función
  // //   }

  // //   // Obtener los productos de la búsqueda
  // //   const resultadoBusqueda = await clienteAxios.post(
  // //     `/productos/busqueda/${busqueda}`
  // //   );
  // //   // console.log("resultadoBusqueda", resultadoBusqueda);

  // //   try {
  // //     if (resultadoBusqueda.data) {
  // //       console.log("resultadoBusqueda", resultadoBusqueda.data[0]);
  // //       const productoResultado = resultadoBusqueda.data[0];

  // //       // Verificar si el producto ya existe en el estado
  // //       const productoExistente = productos.find(
  // //         (producto) => producto.producto === productoResultado._id
  // //       );

  // //       if (productoExistente) {
  // //         // Si el producto ya existe, puedes mostrar una alerta o no hacer nada
  // //         Swal.fire({
  // //           icon: "warning",
  // //           title: "Producto duplicado",
  // //           text: "Este producto ya está en la lista.",
  // //         });
  // //       } else {
  // //         // Si el producto no existe, crea una copia del estado actual y agrega el nuevo producto
  // //         guardarProductos((productosActuales) => [
  // //           ...productosActuales,
  // //           { ...productoResultado, cantidad: 0 },
  // //         ]);
  // //       }
  // //     } else {
  // //       // Si no hay resultados
  // //       Swal.fire({
  // //         icon: "error",
  // //         title: "No Resultados",
  // //         text: "No hay resultados",
  // //       });
  // //     }
  // //   } catch (error) {
  // //     console.log("errorcirijillo", error);
  // //     Swal.fire({
  // //       icon: "error",
  // //       title: "Error",
  // //       text: "Hubo un error en la búsqueda.",
  // //     });
  // //   }
  // // };

  //ORIGINAL
  const buscarProducto = async (e) => {
    e.preventDefault();

    // Validar que haya un término de búsqueda
    if (busqueda.trim() === "") {
      // Mostrar una alerta indicando que el término de búsqueda está vacío
      Swal.fire({
        icon: "error",
        title: "Campo de búsqueda vacío",
        text: "Por favor, ingresa un término de búsqueda.",
      });
      return; // Detener la ejecución de la función
    }

    //Obtener los productos de la busqueda
    const resultadoBusqueda = await clienteAxios.post(
      `/productos/busqueda/${busqueda}`
    );
    // console.log("resultadoBusqueda", resultadoBusqueda);
    //Si no hay resultados una alerta, contrago agrego al state
    try {
      if (resultadoBusqueda.data) {
        console.log("resultadoBusqueda", resultadoBusqueda.data[0]);
        let productoResultado = resultadoBusqueda.data[0];
        //Agregar la llave de "producto" (copia del id)
        productoResultado.producto = resultadoBusqueda.data[0]._id;
        productoResultado.cantidad = 0;
        // console.log("productoResultado", productoResultado);
        guardarProductos([...productos, productoResultado]);
      } else {
        //Si no hay resultados
        Swal.fire({
          icon: "error",
          title: "No Resultados",
          text: "No hay resultados",
        });
      }
    } catch (error) {
      console.log("errorcirijillo", error);
      Swal.fire({
        icon: "error",
        title: "No Resultados",
        text: "No hay resultados",
      });
    }
  };
  //ORIGINAL
  //Almacenr una busqueda en el stare
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };
  //Actualizar la cantidad de productos
  const restarProductos = (i) => {
    // console.log("uno menos", i);
    // console.log("productos desde restar;", productos);
    //Copiar el arreglo original de productos
    const todosProductos = [...productos];
    //Validar si esta en 0 no puede ir mas alla
    if (todosProductos[i].cantidad === 0) return;
    //Decremento
    todosProductos[i].cantidad--;
    //Almacenar en el state
    guardarProductos(todosProductos);
  };
  const aumentarProductos = (i) => {
    // console.log("uno mas", i);
    // console.log("productos desde aumentar;", productos);
    //Copiar el arreglo original de productos
    const todosProductos = [...productos];
    //Incremento
    todosProductos[i].cantidad++;
    //Almacenar en el state
    guardarProductos(todosProductos);
  };
  const actualizarTotal = () => {
    //Si el arreglo de productos es igual 0: el costo total es o
    if (productos.length === 0) {
      guardarTotal(0);
      return;
    }
    //Calculo el nuevo total
    let nuevoTotal = 0;
    //Recorrer todos los productos, sus cantidades y precios
    productos.map((producto) => {
      nuevoTotal += producto.cantidad * producto.precio;
    });
    let totalDosDecimales = nuevoTotal.toFixed(2);
    //Almacenar el total
    guardarTotal(totalDosDecimales);
  };

  //Elminina un producto del state
  const eliminarProductoPedido = (id) => {
    // console.log("id desde eliminar", id);
    const todosProductos = productos.filter(
      (producto) => producto.producto !== id
    );
    guardarProductos(todosProductos);
  };
  //Almacenar el pedido en la BD
  const realizarPedido = async (e) => {
    e.preventDefault();
    //Extraer el ID
    //TODO VERIFICAR SI ESTE id ES DEL PEDIDO O DEL CLIENTE DONDE VIENE
    //ESTOY CASI SEGURO Q ES DEL CLIENTE
    // const { id } = props.match.params;
    // console.log("id", id);
    // console.log("total", total);
    // console.log("productos", productos);

    //Construir el objeto
    const pedido = {
      cliente: id,
      pedido: productos,
      total: total,
    };
    // console.log("pedido desde realizarPedido:", pedido);
    //Almacenarlo en la BD
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);
    if (resultado.status === 200) {
      //Alerta de todo bien
      Swal.fire({
        type: "success",
        title: "Correcto",
        text: resultado.data.mensaje,
      });
    } else {
      //Alerta de error
      Swal.fire({
        icon: "error",
        title: "Hubo un Error",
        text: "Vuelva a intentarlo",
      });
    }
    //Redireccionar
    //TODO Corregir la redireccion, debe ser para "/pedidos"
    history("/");
  };

  return (
    <Fragment>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {nombre} {apellido}
        </p>
        <p>
          E-mail: {email}
          {".       "} Telefono: {telefono}
        </p>
      </div>

      {/* <form>
        <legend>Busca un Producto y agrega una cantidad</legend>

        <div className="campo">
          <label>Productos:</label>
          <input type="text" placeholder="Nombre Productos" name="productos" />
        </div> */}
      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />
      <ul className="resumen">
        {productos.map((producto, index) => {
          return (
            <FormCantidadProducto
              key={producto.producto}
              producto={producto}
              restarProductos={restarProductos}
              aumentarProductos={aumentarProductos}
              index={index}
              eliminarProductoPedido={eliminarProductoPedido}
            />
          );
        })}
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
      {/* </form> */}
    </Fragment>
  );
};

export default NuevoPedido;
