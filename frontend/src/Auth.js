import React from 'react';
import "./Style/App.css"
const backendUrl = "https://gratitude-app-backend.onrender.com";

function LoginButton() {
    function handleLogin() {
        window.location.href = `${backendUrl}/auth/google`; //was http://localhost:3005/auth/google
      }

  return (
    <button onClick={handleLogin} className = "google-button">Login with Google</button>
  );
}

export default LoginButton;
