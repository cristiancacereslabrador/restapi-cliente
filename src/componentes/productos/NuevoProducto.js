import React, { Fragment, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";

const NuevoProducto = () => {
  const history = useNavigate();
  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
  });
  //Archivo = state, guardarArchivo = setState
  //Archivo = state, guardarArchivo = setState
  const [archivo, guardarArchivo] = useState("");
  //Almacena el nuevo producto en la base de datos
  const agregarProducto = async (e) => {
    e.preventDefault();
    //Crear un form-data
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);
    //Almacena en la BD
    try {
      const res = await clienteAxios.post("/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("res? Se agrego?", res);
      if (res.status === 200)
        Swal.fire("Agregado Correctamente!", res.data.mensaje, "success");
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

  return (
    <Fragment>
      <h1>Nuevo Producto</h1>

      <form onSubmit={agregarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
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
          />{" "}
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default NuevoProducto;
