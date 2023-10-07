import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useHistory } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";

const EditarCliente = (props) => {
  // Obtener el ID
  const { id } = useParams();
  console.log("id", id);
  const history = useNavigate();

  //cliente = state, datosCliente = funcion para datos cliente
  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });
  //Query a la API
  const consultarAPI = async () => {
    const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);
    // console.log(clienteConsulta.data);
    //Colocar de el state
    datosCliente(clienteConsulta.data);
  };

  //useeffect, cuando el componente carga
  useEffect(() => {
    consultarAPI();
  }, []);

  //Leer los datos del formulario
  const actualizarState = (e) => {
    //Almacenar lo q el usuario escribe en el state
    // console.log([e.target.name] + ":", e.target.value);
    datosCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  //Añadir en la REST API un cliente nuevo
  // console.log("cliente:", cliente);

  //Envia una petición por axios para actualizar el cliente
  const actualizarCliente = (e) => {
    e.preventDefault();
    //Enviar petición por axios
    clienteAxios.put(`/clientes/${cliente._id}`, cliente).then((res) => {
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
        Swal.fire("Correcto!", "Se actualizó correctamente!", "success");
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

  return (
    <Fragment>
      <h2> Nuevo Cliente</h2>

      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
};

export default EditarCliente;
