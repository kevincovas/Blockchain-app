import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import Slide from "@material-ui/core/Slide";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <SnackbarProvider
    maxSnack={5}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    TransitionComponent={Slide}
    autoHideDuration={5000}
  >
    <Router>
      <App />
    </Router>
  </SnackbarProvider>,
  document.getElementById("root")
);
