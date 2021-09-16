import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import {withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../css/Navigation.css";


function Navigation(props) {

  const logout = () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">ARKUS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {props.isLoggedIn ? 
            <Nav.Link
            className={`nav-item`}
            onClick={logout}
            >
            Cerrar Sesión
            </Nav.Link>
            : 
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
              Resgistrarse
            </Nav.Link>
            </>
          }
            
            <NavDropdown title="Mi perfil" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/rememberPassword">
                Cambiar contraseña
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              className={`nav-item  ${
                props.location.pathname === "/Reservations" ? "active" : ""
              }`}
              href="/reservations"
            >
              Reservar Cita
            </Nav.Link>
            <Nav.Link
              className={`nav-item  ${
                props.location.pathname === "/clients" ? "active" : ""
              }`}
              href="/clients"
            >
              Clientes
            </Nav.Link>
            <Nav.Link
              className={`nav-item  ${
                props.location.pathname === "/sales" ? "active" : ""
              }`}
              href="/sales"
            >
              Ventas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default withRouter(Navigation);
