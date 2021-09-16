import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Reservations from "./modules/Reservations.jsx";
import LoginAndRegister from "./modules/LoginAndRegister.jsx";
import Sales from "./modules/NewSale.jsx";
import Home from "./modules/components/HomePage/Home.jsx";
import Navigation from "./modules/components/HomePage/Navigation";
import Clients from "./modules/clients";
import RememberPassword from "./modules/RememberPassword";
import Context from "../context/context";

const initialContext = {
  saleProducts: [],
};

function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const login = (token) => {
	
	// Only store token if not undefined or null
	if(token != null)
	{		
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
	}
	
  };
  const logout = () => {
    console.log("Ha entrado en logout");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Context.Provider value={initialContext}>
      <div className="App">
        <Router>
          <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/clients" exact component={() => <Clients />} />
          <Route
            path="/reservations"
            exact
            render={() =>
              isLoggedIn ? (
                <Reservations />
              ) : (
                <LoginAndRegister onLogin={login} />
              )
            }
          />
          <Route
            path="/login"
            render={() =>
              isLoggedIn ? <Home /> : <LoginAndRegister onLogin={login}/>
            }
          />
          <Route
            path="/register"
            render={() =>
              isLoggedIn ? <Home /> : <LoginAndRegister onLogin={login}/>
            }
          />
          <Route
            path="/sales"
            render={() =>
              isLoggedIn ? <Sales /> : <LoginAndRegister onLogin={login} />
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
    </Context.Provider>
  );
}

export default App;
