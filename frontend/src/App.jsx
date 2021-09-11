import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";
import "./App.css";

import Reservations from "./modules/Reservations.jsx";
import LoginAndRegister from "./modules/LoginAndRegister.jsx";
import Sales from "./modules/Sales.jsx";

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

  return (
    <Router>
      <div className="App">
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
        />*/}
        <Route
          strict
          path="/sales"
          render={() => (<Sales />)}
        />
        <Route
          strict
          path="/login"
          render={() => <LoginAndRegister onLogin={login} />}
        />
      </div>
    </Router>
  );
}

export default App;
