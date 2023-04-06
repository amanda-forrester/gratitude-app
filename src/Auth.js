import React from 'react';
import "./App.css"

function LoginButton() {
    function handleLogin() {
        window.location.href = 'http://localhost:3005/auth/google';
      }

  return (
    <button onClick={handleLogin} className = "google-button">Login with Google</button>
  );
}

export default LoginButton;
