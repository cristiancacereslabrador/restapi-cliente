import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";

function Login(props) {
  //Auth y token
  const [auth, guardarAuth] = useContext(CRMContext);
  // console.log("auth desde Login", auth);

  const history = useNavigate();
  //State copn los datos del formulario
  const [credenciales, guardarCredenciales] = useState({});
  //Iniciar sesion en el servidor
  const iniciarSesion = async (e) => {
    e.preventDefault();
    //Autenticar usuario
    try {
      const respuesta = await clienteAxios.post(
        "/iniciar-sesion",
        credenciales
      );
      // console.log("respuesta", respuesta);
      //extraer el token y colocarlo en localstorage
      const { token } = respuesta.data;
      localStorage.setItem("token", token);
      //Coloco en el state
      guardarAuth({
        token,
        auth: true,
      });

      //Alerta
      Swal.fire("Login Correcto!", "Has iniciado sesión!", "success");
      //redireccionar
      history("/");
    } catch (error) {
      // console.log("error", error);
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: error.response.data.mensaje,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Hubo un error",
        });
      }
    }
  };
  //Almacenar lo que el usuario escribe en el state
  const leerDatos = (e) => {
    guardarCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };
  return (
    <div className="login">
      <h2> Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
