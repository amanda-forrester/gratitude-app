import React from 'react';
import '../App.css';

function SuccessPage() {
  return (
    <div>
      <h1>Login successful!</h1>
      <p>Welcome to your gratitude page!</p>
      <br></br>
      <br></br>
      <form name="gratitudeItems">
        What are you grateful for? <br></br>
        <textarea className="input-element" type="text" name="gratitude">
        </textarea>
        <br></br>
        <input type="button" name="button" value="Submit">
        </input>
      </form>
    </div>
  );
}

export default SuccessPage;