import React, { useState, useEffect } from 'react';
import validator from 'validator';
import '../App.css';
import axios from 'axios';


function SuccessPage() {
  
  const [gratitudeItem, setGratitudeItem] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3005/gratitude');
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);


  /*useEffect(() => {
    alert('Login successful!');
  }, []);*/

  const handleSubmit = (event) => {
    event.preventDefault();
    const sanitizedGratitudeItem = validator.stripLow(validator.escape(gratitudeItem));
    //stripLow removes characters with ASCII value < 32 i.e. tabs, line breaks etc
    //escape escapes any HTML entities that may be in the input
    if (sanitizedGratitudeItem.length < 1 || sanitizedGratitudeItem.length > 1000) {
      alert('Please enter a gratitude item between 1 and 1000 characters long.');
      return;
    }
    fetch('http://localhost:3005/gratitude/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_id: user.id,
        name: user.firstName,
        gratitude_item: sanitizedGratitudeItem
       }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleGratitudeItemChange = (event) => {
    setGratitudeItem(event.target.value);
  }; 


  return (
    <div>
      <h1>Welcome to your gratitude page!</h1>
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
  );
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