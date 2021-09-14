import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {SnackbarProvider} from 'notistack';
import Slide from "@material-ui/core/Slide";

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider 
      maxSnack={5} 
      anchorOrigin={{
        vertical: "top",
        horizontal: "center", 
      }} 
      TransitionComponent={Slide}
      autoHideDuration={5000}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
