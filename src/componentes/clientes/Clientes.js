import React, { Fragment, useContext, useEffect, useState } from "react";
//Importar el cliente axios
import clienteAxios from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import Cliente from "./Cliente";
import Spinner from "../layout/Spinner";
//Importar el context
import { CRMContext } from "../../context/CRMContext";

function Clientes() {
  const history = useNavigate();
  //Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  //* EXPERIMENTO
  useEffect(() => {
    if (!auth.auth) {
      history("/iniciar-sesion");
    }
  }, [auth, history]);
  //* EXPERIMENTO

  //Trabajar con el state
  //clientes = state, guardarClientes= funcion para guardar el state
  const [clientes, guardarClientes] = useState([]);
  // console.log("auth desde Clientes", auth);
  //Query a la API
  useEffect(() => {
    if (auth.token !== "") {
      const consultarAPI = async () => {
        try {
          // console.log("consultando ando!");
          const clientesConsulta = await clienteAxios.get("/clientes", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          guardarClientes(clientesConsulta.data);
          // console.log("clientesConsulta", clientesConsulta);
          //colocar el resultado en el state
        } catch (error) {
          //Error con autorizacion
          if ((error.response.status = 500)) {
            history("/iniciar-sesion");
          }
          console.log("error", error);
        }
      };
      consultarAPI();
    } else {
      history("/iniciar-sesion");
    }
  }, [clientes]);
  //Si el state esta como false
  if (!auth) {
    console.log("auth es:", auth);
    history("/iniciar-sesion");
  }
  //Spinner de carga
  if (!clientes.length) return <Spinner />;

  return (
    <Fragment>
      <h2>Clientes</h2>

      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          // Usa paréntesis para devolver elementos JSX dentro del mapeo
          <Cliente key={cliente._id} cliente={cliente} />
        ))}
        {/* {clientes.map((cliente) => {
          <Cliente cliente={cliente} />;
        })} */}
      </ul>
    </Fragment>
  );
}

export default Clientes;

// import React from "react";
// import { Link } from "react-router-dom";

// const Navegacion = () => {
//   return (
//     <aside className="sidebar col-3">
//       <h2>Administración</h2>

//       <nav className="navegacion">
//         <Link to={"/"} className="clientes">
//           Clientes
//         </Link>
//         <Link to={"/productos"} className="productos">
//           Productos
//         </Link>
//         <Link to={"/pedidos"} className="pedidos">
//           Pedidos
//         </Link>
//       </nav>
//     </aside>
//   );
// };

// export default Navegacion;
