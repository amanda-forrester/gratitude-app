import React, { useState } from 'react';
import validator from 'validator';
import '../App.css';
import { useSearchParams } from "react-router-dom"

function SuccessPage() {
  const [searchParams, /*setSearchParams*/] = useSearchParams();
  const [gratitudeItem, setGratitudeItem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  //const userSub = searchParams.get("sub");
  const userAccessToken = searchParams.get("token");

  const handleSubmit = (event) => {
    event.preventDefault();
    const sanitizedGratitudeItem = validator.stripLow(validator.escape(gratitudeItem));
    if (sanitizedGratitudeItem.length < 1 || sanitizedGratitudeItem.length > 1000) {
      alert('Please enter a gratitude item between 1 and 1000 characters long.');
      return;
    }
    fetch('http://localhost:3005/gratitude/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${userAccessToken}`
      },
      body: JSON.stringify({ gratitude_string: sanitizedGratitudeItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleGratitudeItemChange = (event) => {
    setGratitudeItem(event.target.value);
  };

  const handleReset = () => {
    setGratitudeItem('');
  };

  const combinedFunction = () => {
    setIsSubmitted(false);
    handleReset();
  }

  return (
    <div>
      <h1>Login successful!</h1>
      <p>Welcome to your gratitude page!</p>
      <br></br>
      <br></br>
      {isSubmitted ? (
        <div>
          <p>Gratitude item successfully submitted!</p>
          <button onClick={() => combinedFunction()}>Submit Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} name="gratitudeItems">
          What are you grateful for? <br></br>
          <textarea
            className="input-element"
            type="text"
            name="gratitude"
            value={gratitudeItem}
            onChange={handleGratitudeItemChange}
          ></textarea>
          <br></br>
          <input type="submit" className="submit-button" value="Submit"></input>
        </form>
      )}
    </div>
  );
  

  /*return (
    //old code:
    <div>
      <h1>Login successful!</h1>
      <p>Welcome to your gratitude page!</p>
      <br></br>
      <br></br>
      <form onSubmit={handleSubmit} name="gratitudeItems">
        What are you grateful for? <br></br>
        <textarea
          className="input-element"
          type="text"
          name="gratitude"
          value={gratitudeItem}
          onChange={handleGratitudeItemChange}
        ></textarea>
        <br></br>
        <input type="submit" className="submit-button" value="Submit"></input>
      </form>
    </div>
  );*/
}

export default SuccessPage;


































/*import React from 'react';
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
        <input type="button" className="submit-button" value="Submit">
        </input>
      </form>
    </div>
  );
}

export default SuccessPage;*/