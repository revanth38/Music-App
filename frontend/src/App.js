import React, { useState } from 'react';
import Login from './components/Login';
import Home from './pages/Home';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return <Login onLogin={(tk) => setToken(tk)} />;
  }

  return <Home token={token} />;
}

export default App;
