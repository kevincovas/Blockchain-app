import React, { useState } from 'react'
import Calendar from './modules/Calendar.jsx'
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
    return <Calendar/>
  }
}

export default App