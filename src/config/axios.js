import axios from "axios";

// Configuración base de Axios (URL base, encabezados comunes, etc.)
const clienteAxios = axios.create({
  // baseURL: "http://127.0.0.1:4000",
  // baseURL: process.env.REACT_APP_BACKEND_URL,
  baseURL: "https://restapi-server.fly.dev",
  // timeout: 5000, // Tiempo máximo de espera para las solicitudes (en milisegundos)
  // headers: {
  //   "Content-Type": "application/json", // Tipo de contenido predeterminado para solicitudes
  //   // Aquí puedes agregar encabezados adicionales si es necesario
  // },
});

// Puedes agregar interceptores si necesitas realizar acciones comunes en las solicitudes o respuestas, por ejemplo, agregar un token de autenticación.
clienteAxios.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar lógica antes de enviar la solicitud, como agregar un token de autenticación.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clienteAxios.interceptors.response.use(
  (response) => {
    // Aquí puedes agregar lógica después de recibir la respuesta.
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default clienteAxios;
