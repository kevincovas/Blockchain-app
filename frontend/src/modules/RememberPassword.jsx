
import React, { useEffect, useState } from 'react';/*import "./LoginAndRegisterPage.css";*/
import * as api from '../api/LoginAndRegister';
import 'react-day-picker/lib/style.css';
import { useLocation } from 'react-router';
import { useSnackbar } from "notistack";

const LOGIN = "Login";
const REGISTER = "Register";

function RememberPassword(){
    const [email, setEmail] = useState("");
    const [userExist_error, setUserExistError] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const checkPassword = async (e) => {
        e.preventDefault();
        try {
          const { status, result } = await api.rememberPassword({email});
          console.log(`status: ${status}`);
          console.log(`result: ${result}`);
          /*
          if (error) {
             setMessage({ type: "error", text: error });
          } else {
            if(accessToken == undefined){
              enqueueSnackbar(`Usuario o contraseña incorrecta`,{
                variant: "error",
              });
            }else {
            onLogin(accessToken);
            }
          }*/
        } catch (err) {
          setMessage({ type: "error", text: err.toString() });
        }
      }
}



  export default RememberPassword;