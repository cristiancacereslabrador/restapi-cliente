import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const Producto = ({ producto }) => {
  const { _id, nombre, precio, imagen } = producto;
  // console.log("producto???", producto);

  //Eliminar Producto
  const eliminarProducto = (idProducto) => {
    // console.log("eliminando", id);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Un producto eliminado no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //Llamado a axios
        clienteAxios.delete(`/productos/${idProducto}`).then((res) => {
          console.log("res", res);
          Swal.fire("Eliminado", res.data.mensaje, "success");
        });
      }
    });
  };

  return (
    <Fragment>
      <li className="producto">
        <div className="info-producto">
          <p className="nombre">{nombre}</p>
          <p className="precio">$ {precio}</p>
          {imagen ? (
            <img
              src={`http://localhost:4000/${imagen}`}
              alt={`Imagen de ${nombre}`}
            />
          ) : null}
        </div>
        <div className="acciones">
          <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
            <i className="fas fa-pen-alt"></i>
            Editar Producto
          </Link>

          <button
            type="button"
            className="btn btn-rojo btn-eliminar"
            onClick={() => eliminarProducto(_id)}
          >
            <i className="fas fa-times"></i>
            Eliminar Producto
          </button>
        </div>
      </li>
    </Fragment>
  );
};

export default Producto;
