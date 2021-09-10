import React, { useState } from 'react'
import Reservations from './modules/Reservations.jsx'
import LoginAndRegister from './modules/LoginAndRegister.jsx'

function App() {
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  }
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <LoginAndRegister onLogin={login} />;
  } else {
    return <Reservations/>
  }
}

export default App