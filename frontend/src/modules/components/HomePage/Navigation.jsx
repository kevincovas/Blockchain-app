import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Peluquería ARKUS
          </Link>

          <div>
            <ul className="navbar-nav ml-auto">
                <li
                className={`nav-item  ${
                  props.location.pathname === "/login" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/login">
                  Iniciar sesión
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/register" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/register">
                  Registrarse
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/clients" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/clients">
                  Clientes
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/Reservations" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/reservations">
                  Reservas
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/sales" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/sales">
                  Ventas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);