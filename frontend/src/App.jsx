import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Reservations from "./modules/Reservations.jsx";
import Register from "./modules/Register.jsx";
import Login from "./modules/Login.jsx";
import NewSale from "./modules/NewSale.jsx";
import Home from "./modules/components/HomePage/Home.jsx";
import Navigation from "./modules/components/HomePage/Navigation";
import Clients from "./modules/clients";
import SalesList from "./modules/SalesList";
import RememberPassword from "./modules/RememberPassword";

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
	localStorage.removeItem("person");
	localStorage.removeItem("user");	
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
            <Home/>
          }
        />
        <Route
          path="/clients"
          exact
          render={() =>
            isLoggedIn && ( ( localStorage.getItem("person") != null ) && ( JSON.parse(localStorage.getItem("person")).role != "customer" )  ) ? <Clients /> : <Login onLogin={login} />
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
          path="/sales/new-sale/"
          render={() =>
            isLoggedIn ? <NewSale /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/sales/list/"
          render={() =>
            isLoggedIn && ( ( localStorage.getItem("person") != null ) && ( JSON.parse(localStorage.getItem("person")).role != "customer" )  ) ? <SalesList /> : <Login onLogin={login} />
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
