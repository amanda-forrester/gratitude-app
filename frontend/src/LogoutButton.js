import React from 'react';
import { useCookies } from 'react-cookie';
import './LogoutButton.css';
const frontendUrl = "https://gratitude-app.onrender.com";

function LogoutButton() {
  const [cookies, , removeCookie] = useCookies(['session']);

  const handleLogout = () => {
    // Delete session-related cookies
    removeCookie('session');

    // Redirect the user to the desired page (localhost:3000)
    window.location.href = frontendUrl; //this was localhost:3000
  };

  return (
    <div className="navbar">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
