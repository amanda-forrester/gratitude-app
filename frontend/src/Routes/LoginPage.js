import React from 'react';
import LoginButton from '../Auth.js';

function LoginPage() {
    return (
        <div>
            <h1>Welcome to the Gratitude App! <br></br>We are grateful you are here.</h1>
            {LoginButton()}
        </div>
    )
}


export default LoginPage