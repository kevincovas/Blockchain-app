import React, { useEffect, useState } from 'react';/*import "./LoginAndRegisterPage.css";*/
import * as api from '../api';

const LOGIN = "Login";
const REGISTER = "Register";

function LoginAndRegister({ onLogin }) {
  const [mode, setMode] = useState(LOGIN);
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
      if (error) {
        setMessage({ type: "error", text: error });
      } else {
        onLogin(accessToken);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  }

  return (
    <div className="register-page">
      <h1>{mode === LOGIN ? LOGIN : REGISTER}</h1>
      <form onSubmit={mode === LOGIN ? login : register}>
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