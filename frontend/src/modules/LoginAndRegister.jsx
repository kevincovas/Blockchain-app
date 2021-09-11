import React, { useEffect, useState } from 'react';/*import "./LoginAndRegisterPage.css";*/
import * as api from '../api';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const LOGIN = "Login";
const REGISTER = "Register";

function LoginAndRegister({ onLogin }) {
  const [mode, setMode] = useState(LOGIN);
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "none" });

  const register = async (e) => {
    e.preventDefault();
    try {
      const result = await api.register({ email, password });
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "User created" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const { error, accessToken } = await api.login({ email, password });
      console.log(`error: ${error}`);
      console.log(`accessToken: ${accessToken}`);
      if (error) {
        setMessage({ type: "error", text: error });
      } else {
        onLogin(accessToken);
        console.log(`accessToken de la funcion login ${accessToken}`);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  }

  return (
    <div className="register-page">
      <h1>{mode === LOGIN ? LOGIN : REGISTER}</h1>
      <form onSubmit={mode === LOGIN ? login : register}>
	  
	  {

	  /* Only Register Fields */

		  mode === REGISTER ?
	  
	  <div>
	  
	    <label>
          <div>Nombre</div>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label> 
		
		<label>
          <div>Primer Apellido</div>
          <input type="text" value={apellido1} onChange={(e) => setApellido1(e.target.value)} />
        </label>
    <label>
        <div>Segundo Apellido</div>
        <input type="text" value={apellido2} onChange={(e) => setApellido2(e.target.value)} />
      </label>
    <label>Sexo
        <select>
          <option value="M">Hombre</option>
          <option value="W">Mujer</option>
          <option value="null">Sin expecificar</option>
        </select>
        </label>	
      
      

      <label>
        <div> Fecha de nacimiento</div>
      </label>

		</div>
		
		:  ""
		
	  }
	  
	  
        <label>
          <div>Email</div>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div>
          <input type="submit" value={mode === LOGIN ? LOGIN : REGISTER} />
        </div>
      </form>
      <div>
        <a href="#" onClick={() => setMode(mode === LOGIN ? REGISTER : LOGIN)}>
          {mode === LOGIN ? REGISTER : LOGIN}
        </a>
      </div>
      <div className={`message ${message.type}`}>{message.text}</div>
    </div>
  );
}

export default LoginAndRegister;
