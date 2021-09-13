import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Reservations from "./modules/Reservations.jsx";
import LoginAndRegister from "./modules/LoginAndRegister.jsx";
import Sales from "./modules/NewSale.jsx";
import Home from "./modules/components/HomePage/Home.jsx";
import Navigation from "./modules/components/HomePage/Navigation";

function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  /*return (
    <Router>
      <div className="App">
        <Navigation/>
        <Route
          strict
          path="/reservations"
          render={() =>
            isLoggedIn ? <Reservations /> : <Redirect to="/login" />
          }
        />
        {/*<Route
          strict
          path="/sales"
          render={() => (isLoggedIn ? <Sales /> : <Redirect to="/login" />)}
        />*//*}
        <Route
          strict
          path="/sales"
          render={() => (<Sales />)}
        />
        <Route
          strict
          path="/"
          render={() => (<Home />)}
        />
        <Route
          strict
          path="/registration"
          render={() => (<Registration />)}
        />
        <Route
          strict
          path="/login"
          render={() => <LoginAndRegister onLogin={login} />}
        />
      </div>
    </Router>
  );
}*/

  return (
    <div className="App">
      <Router>
        <Navigation />
          <Route path="/" exact component={() => <Home />} />
          <Route path="/login" exact component={() => <LoginAndRegister onLogin={login} />} />
          <Route path="/register" exact component={() => <LoginAndRegister />} />
          <Route path="/reservations" render={() =>
            isLoggedIn ? <Reservations /> : <Redirect to="/login" />}
          />
          <Route path="/sales" render={() => 
          (isLoggedIn ? <Sales /> : <Redirect to="/login" />)}
        />
      </Router>
    </div>
  );
}


export default App;
