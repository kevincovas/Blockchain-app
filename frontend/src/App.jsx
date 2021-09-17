import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Reservations from "./modules/Reservations.jsx";
import Register from "./modules/Register.jsx";
import Login from "./modules/Login.jsx";
import Sales from "./modules/NewSale.jsx";
import Home from "./modules/components/HomePage/Home.jsx";
import Navigation from "./modules/components/HomePage/Navigation";
import Clients from "./modules/Clients";
import RememberPassword from "./modules/RememberPassword";
import Context from "../context/context";

function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const login = (token, person, user) => {
    // Only store token if not undefined or null
    localStorage.setItem("token", token);
    localStorage.setItem("person", JSON.stringify(person));
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);  
  };

  const logout = () => {
    console.log("Ha entrado en logout");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Route
          path="/"
          exact
          render={() =>
            isLoggedIn ? <Login onLogin={login} /> : <Home />
          }
        />
        <Route
          path="/clients"
          exact
          render={() =>
            isLoggedIn ? <Clients /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/reservations"
          exact
          render={() =>
            isLoggedIn ? <Reservations /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/login"
          render={() =>
            isLoggedIn ? <Home /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/register"
          render={() =>
            isLoggedIn ? <Home /> : <Register onLogin={login} />
          }
        />
        <Route
          path="/sales"
          render={() =>
            isLoggedIn ? <Sales /> : <Login onLogin={login} />
          }
        />
        <Route
            path="/rememberPassword"
            exact
            render={() =>
              isLoggedIn ? (
                <Home />
              ) : (
                <RememberPassword />
              )
            }
          />

      </Router>
    </div>
  );
}

export default App;
