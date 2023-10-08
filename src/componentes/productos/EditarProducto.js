import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";

import Spinner from "../layout/Spinner";
import Swal from "sweetalert2";

const EditarProducto = ({ props }) => {
  const history = useNavigate();
  //Obtener el ID
  const { id } = useParams();
  // console.log("id de Producto", id);
  //product=state, y funcion para actualizar
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });

  const [archivo, guardarArchivo] = useState("");
  //Consultar la API para traer el producto a editar
  const constularAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${id}`);
    // console.log("producto.data", productoConsulta.data);
    guardarProducto(productoConsulta.data);
  };
  useEffect(() => {
    constularAPI();
  }, []);

  //Edita un producto en la BD
  const editarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);
    //Almacena en la BD
    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("res? Se agrego?", res);
      if (res.status === 200)
        Swal.fire("Editado Correctamente!", res.data.mensaje, "success");
      history("/productos");
    } catch (error) {
      console.log("error", error);
      //Lanzar alerta
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        text: "Vuelva a intentarlo",
      });
    }
  };

  //Leer los datos del formulario
  const leerInformacionProducto = (e) => {
    guardarProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };
  //Leer los datos del archivo
  const leerArchivo = (e) => {
    console.log("e.target.files", e.target.files[0]);
    guardarArchivo(e.target.files[0]);
  };

  //Extraer los valores del state
  const { nombre, precio, imagen } = producto;
  if (!nombre) return <Spinner />;

  return (
    <Fragment>
      <h2>Editar Producto</h2>

      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            defaultValue={nombre}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={leerInformacionProducto}
            defaultValue={precio}
          />{" "}
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img
              // src={`http://localhost:4000/${imagen}`}
              src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
              alt={`Imagen de ${nombre}`}
              width="300"
            />
          ) : null}
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Producto"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default EditarProducto;
