import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/Navigation.css";

function Navigation(props) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="logo" href="/">
        ARKUS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="element-right" id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            className={`nav-item  ${
              props.location.pathname === "/reservations" ? "active" : ""
            }`}
            href="/reservations"
          >
            Reservar Cita
          </Nav.Link>

          {localStorage.getItem("person") != null &&
          JSON.parse(localStorage.getItem("person")).role != "customer" ? (
            <>
              <Nav.Link
                className={`nav-item  ${
                  props.location.pathname === "/clients" ? "active" : ""
                }`}
                href="/clients"
              >
                Clientes
              </Nav.Link>

              <NavDropdown
                title="Ventas"
                id="collasible-nav-dropdown"
                className={`nav-item  ${
                  props.location.pathname.includes("/sales/") ? "active" : ""
                }`}
              >
                <NavDropdown.Item href="/sales/new-sale/">
                  Nueva Venta
                </NavDropdown.Item>
                <NavDropdown.Item href="/sales/list/">
                  Historial
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <></>
          )}
        </Nav>
        <Nav>
          {props.isLoggedIn ? (
            localStorage.getItem("token") ? (
              <NavDropdown
                title="Mi perfil"
                id="collasible-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={props.openDialog}>
                  Cambiar contraseña
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={props.onLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <></>
            )
          ) : (
            <>
              <Nav.Link
                className={`nav-item  ${
                  props.location.pathname === "/login" ? "active" : ""
                }`}
                href="/login"
              >
                Inicio Sesión
              </Nav.Link>
              <Nav.Link
                className={`nav-item  ${
                  props.location.pathname === "/register" ? "active" : ""
                }`}
                href="/register"
              >
                Registrarse
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default withRouter(Navigation);
