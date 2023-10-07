import React, { Fragment, useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import Producto from "./Producto";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

function Productos() {
  const history = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);

  const [productos, guardarProductos] = useState([]);
  //useEffect para consultar la API cuando cargue
  useEffect(() => {
    if (auth.token !== "") {
      const consultaAPI = async () => {
        try {
          //Query a la api
          const productosConsulta = await clienteAxios.get("/productos", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          guardarProductos(productosConsulta.data);
          // console.log("productosConsulta.data", productosConsulta.data);
          // console.log("productosConsulta", productosConsulta);
        } catch (error) {
          //Error con autorizacion
          if ((error.response.status = 500)) {
            history("/iniciar-sesion");
          }
          console.log("error", error);
        }
      };
      //Llamado a la API
      consultaAPI();
    } else {
      history("/iniciar-sesion");
    }
  }, [productos]);
  // console.log("productossss", productos);
  //Si el state esta como false
  if (!auth.auth) {
    history("/iniciar-sesion");
  }
  //Spinner de carga
  if (!productos.length) return <Spinner />;

  return (
    <Fragment>
      <h2>Productos</h2>

      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((producto) => {
          // console.log("productoss._id", producto._id);
          return <Producto key={producto._id} producto={producto} />;
        })}
      </ul>
    </Fragment>
  );
}

export default Productos;
