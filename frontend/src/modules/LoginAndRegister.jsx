import React, { useEffect, useState } from 'react';/*import "./LoginAndRegisterPage.css";*/
import * as api from '../api/LoginAndRegister';
import 'react-day-picker/lib/style.css';

const LOGIN = "Login";
const REGISTER = "Register";

function LoginAndRegister({ onLogin }) {
  const [mode, setMode] = useState(LOGIN);
  const [name, setName] = useState("");
  const [surname_1, setApellido1] = useState("");
  const [surname_2, setApellido2] = useState("");
  const [gender, setGender] = useState("M");
  const [birth_date, setBirth_date] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Error control
  const [message, setMessage] = useState({ type: "none" });
  const [name_error, setNameError] = useState("");
  const [surname1_error, setSurname1Error] = useState("");
  const [surname2_error, setSurname2Error] = useState("");
  const [gender_error, setGenderError] = useState("");
  const [userExist_error, setUserExistError] = useState("");
  const [password_error, setPasswordError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      var is_wrong =false;
      const userCreated = await api.user_exist({email})
      if (!userCreated.data.exists){   
        if(!name){
          setNameError("The field name can not be empty");
          is_wrong = true;
        }
        if(!surname_1){
          setSurname1Error("The field fisrt surname can not be empty");
          is_wrong = true;
        }
        if(!surname_2){
          setSurname2Error("The field second surname can not be empty");
          is_wrong = true;
        }
        if(!gender){
          setGenderError("The field gender can not be empty");
          is_wrong = true;
        }
        console.log(`is_wrong: ${is_wrong}`)
        if (!is_wrong) {
          const result = await api.register({ email, password });
          console.log(`Result user: ${JSON.stringify(result)}`);
          const result2 = await api.register_client({ name, surname_1, surname_2, gender, birth_date, phone});
          console.log(`Result client: ${JSON.stringify(result2)}`);
          setMessage({ type: "success", text: "User and client created" });
        }
      }else {
        setUserExistError("This email is already registered");
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
        if(accessToken == undefined){
          setPasswordError("Usuario o contraseña incorrecta");
        }
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label> 
        <p className="error-msg name">{name_error}</p>
		
		<label>
          <div>Primer Apellido</div>
          <input type="text" value={surname_1} onChange={(e) => setApellido1(e.target.value)} />
        </label>
        <p className="error-msg surname1">{surname1_error}</p>
    <label>
        <div>Segundo Apellido</div>
        <input type="text" value={surname_2} onChange={(e) => setApellido2(e.target.value)} />
      </label>
      <p className="error-msg surname2">{surname2_error}</p>
    <label>
      <div>Sexo</div>
      <select
      value={gender}
      onChange={(e) => {
        setGender(e.target.value);
      }}>
          <option type="text" value="M">Hombre</option>
          <option type="text" value="W">Mujer</option>
          <option type="text" value="X">Sin especificar</option>
      </select> 
      </label>
      <p className="error-msg gender">{gender_error}</p>
    <label>
        <div>Teléfono</div>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
    <label>
        <div>Fecha de Nacimiento</div>
        <input type="date" value={birth_date} onChange={(e) => setBirth_date(e.target.value)} />
      </label>
		</div>
		
		:  ""
		
	  }
	  
	  
        <label>
          <div>Correo</div>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div>Contraseña</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div>
          <input type="submit" value={mode === LOGIN ? LOGIN : REGISTER} />
        </div>
      </form>
      <p className="error-msg password">{password_error}</p>
      <div>
        <a href="#" onClick={() => setMode(mode === LOGIN ? REGISTER : LOGIN)}>
          {mode === LOGIN ? REGISTER : LOGIN}
        </a>
      </div>
      <p className="error-msg userExist">{userExist_error}</p>
      <div className={`message ${message.type}`}>{message.text}</div>
    </div>
  );
}

export default LoginAndRegister;


