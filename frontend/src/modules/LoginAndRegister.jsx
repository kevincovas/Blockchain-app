import React, { useEffect, useState } from 'react';/*import "./LoginAndRegisterPage.css";*/
import * as api from '../api/LoginAndRegister';
import 'react-day-picker/lib/style.css';
import { useLocation } from 'react-router';
import { useSnackbar } from "notistack";

const LOGIN = "Login";
const REGISTER = "Register";

function LoginAndRegister({ onLogin }) {
  const [mode, setMode] = useState(LOGIN);
  const [name, setName] = useState("");
  const [surname_1, setApellido1] = useState("");
  const [surname_2, setApellido2] = useState("");
  const [gender, setGender] = useState("M");
  const [birth_date, setBirth_date] = useState("0001-01-01");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  //Error control
  const [message, setMessage] = useState({ type: "none" });
  const [name_error, setNameError] = useState("");
  const [surname1_error, setSurname1Error] = useState("");
  const [surname2_error, setSurname2Error] = useState("");
  const [gender_error, setGenderError] = useState("");
  const [userExist_error, setUserExistError] = useState("");
  const [password_error, setPasswordError] = useState("");
  const { enqueueSnackbar } = useSnackbar();


  const register = async (e) => {
    e.preventDefault();
    try {
      var is_wrong =false;
      const userCreated = await api.user_exist({email})
      console.log(`userCreated: ${userCreated.data}`);
      if (!userCreated.data.exists){   
        if(!name){
          setNameError("El campo nombre no puede estar vacío");
          is_wrong = true;
        }
        if(!surname_1){
          setSurname1Error("El campo primero apellido no puede estar vacío");
          is_wrong = true;
        }
        if(!surname_2){
          setSurname2Error("El campo segundo apellido no puede estar vacío");
          is_wrong = true;
        }
        if(!gender){
          setGenderError("Es obligatorio seleccionar un sexo");
          is_wrong = true;
        }
        console.log(`is_wrong: ${is_wrong}`)
        if (!is_wrong) {
          const valPassword = validatePassword(password);
        console.log(`valPassword: ${valPassword}`);
          if(valPassword){
            //console.log("Password válida");
            const result = await api.register({ email, password });
            //console.log(`Result de crear user: ${result.data}`);
            const user_id = result.id;
            console.log(`User id: ${user_id}`);
            //console.log(`Result user: ${JSON.stringify(result)}`);
            const result2 = await api.register_client({ name, surname_1, surname_2, gender, birth_date, phone, user_id});
            console.log(`Result client: ${JSON.stringify(result2)}`);
            setMessage({ type: "success", text: "Usuario y cliente creado" });
          }
        }
      }else {
        setUserExistError("Este correo ya está registrado");
      }
      } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  };

  function validatePassword(p) {
    if ((p.length < 8 || (p.search(/[a-z]/i) < 0) || (p.search(/[0-9]/) < 0))) {
        alert("La contraseña debe tener almenos 8 carácteres, una letra y un número.")
        return false;
    }
    return true;
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      const { error, accessToken } = await api.login({ email, password });
      console.log(`error: ${error}`);
      console.log(`accessToken: ${accessToken}`);
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
      }
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  }

  useEffect(()=> {
    if(location.pathname.includes("login")) {
      setMode(LOGIN);
    }else{
      setMode(REGISTER);
    }
  },[]);

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
      <div>
        <a href="http://localhost:3000/rememberPassword">
          Has olvidado la contraseña? Recordar
        </a>
      </div>
      <p className="error-msg userExist">{userExist_error}</p>
      <div className={`message ${message.type}`}>{message.text}</div>
    </div>
  );
}

export default LoginAndRegister;


