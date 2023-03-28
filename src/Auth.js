import React from 'react';

function LoginButton() {
    function handleLogin() {
        window.location.href = 'http://localhost:3005/auth/google';
      }

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
}

export default LoginButton;
