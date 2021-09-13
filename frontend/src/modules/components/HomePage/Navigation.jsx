import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand" to="/">
            Peluquería ARKUS
          </Link>

          <div>
            <ul class="navbar-nav ml-auto">
                <li
                class={`nav-item  ${
                  props.location.pathname === "/login" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/login">
                  Iniciar sesión
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/register" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/register">
                  Registrarse
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Reservations" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/reservations">
                  Reservas
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/sales" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/sales">
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