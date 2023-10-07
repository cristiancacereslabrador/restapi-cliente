import React, { Fragment, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const NuevoCliente = () => {
  const history = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);
  // useEffect para verificar auth.auth y redirigir
  //* EXPERIMENTO
  useEffect(() => {
    if (!auth.auth) {
      history("/iniciar-sesion");
    }
  }, [auth, history]);
  //* EXPERIMENTO
  //cliente = state, guardarCliente = funcion para guardar cliente
  const [cliente, guardarCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  //Leer los datos del formulario
  const actualizarState = (e) => {
    //Almacenar lo q el usuario escribe en el state
    // console.log([e.target.name] + ":", e.target.value);
    guardarCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  // console.log("cliente:", cliente);
  //Añadir en la REST API un cliente nuevo
  const agregarCliente = (e) => {
    e.preventDefault();
    //Enviar peticion
    clienteAxios.post("/clientes", cliente).then((res) => {
      console.log("response", res);
      if (res.data.code === 11000) {
        // console.log("Error de duplicado de Mongo");
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Ese cliente ya esta registrado",
        });
      } else {
        console.log("res.data", res.data);
        Swal.fire("Se agregó el cliente!", res.data.mensaje, "success");
        //Redireccionar
        history("/");
      }
    });
  };

  //Validar el formulario
  const validarCliente = () => {
    //Destructuring
    const { nombre, apellido, empresa, email, telefono } = cliente;
    //Revisar que las propiedades del state tengan contenido
    let valido = !nombre.length || !apellido || !empresa || !email || !telefono;
    //Return true o false
    return valido;
  };

  //Verificar si el usuario esta autenticado o no
  if (!auth.auth && localStorage.getItem("token") === auth.token) {
    history("/iniciar-sesion");
  }

  return (
    <Fragment>
      <h1> Nuevo Cliente</h1>

      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
};

export default NuevoCliente;
