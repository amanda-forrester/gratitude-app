import React, { useState, useEffect } from 'react';
import '../App.css';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import GratitudeCalendar from '../Calendar';
import moment from 'moment';
import validator from 'validator';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [gratitudeItem, setGratitudeItem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const userAccessToken = searchParams.get('token');
  const decodedToken = jwt_decode(userAccessToken);
  const googleId = decodedToken.sub;
  const firstName = decodedToken.given_name;
  const [gratitudeItems, setGratitudeItems] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
        Authorization: `Bearer: ${userAccessToken}`,
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

  const combinedFunction = () => {
    setIsSubmitted(false);
    setGratitudeItem('');
  };

  useEffect(() => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/gratitude/${googleId}/${formattedDate}`);
        const data = await response.json();
        setGratitudeItems(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [googleId, selectedDate]);

  return (
    <div>
      <h1>Welcome, {firstName}, to your gratitude page!</h1>
      <p>Add additional details here...</p>
      <br />
      <br />
      <GratitudeCalendar
        googleId={googleId}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        gratitudeItems={gratitudeItems}
        setGratitudeItems={setGratitudeItems}
      />
      {isSubmitted ? (
        <div>
          <p>Gratitude item successfully submitted!</p>
          <button onClick={combinedFunction}>Submit Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} name="gratitudeItems">
          <div>
            What are you grateful for?
            <br />
            <textarea
              className="input-element"
              type="text"
              name="gratitude"
              value={gratitudeItem}
              onChange={handleGratitudeItemChange}
            />
          </div>
          <br />
          <input type="submit" className="submit-button" value="Submit" />
        </form>
      )}
    </div>
  );
}

export default SuccessPage;











/*import React, { useState, useEffect } from 'react';
import validator from 'validator';
import '../App.css';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import GratitudeCalendar from '../Calendar';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [gratitudeItem, setGratitudeItem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const userAccessToken = searchParams.get('token');
  const decodedToken = jwt_decode(userAccessToken);
  const googleId = decodedToken.sub;
  const firstName = decodedToken.given_name;
  const [gratitudeItems, setGratitudeItems] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
        Authorization: `Bearer: ${userAccessToken}`,
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      try {
        const response = await fetch(`/gratitude/${googleId}/${formattedDate}`);
        const data = await response.json();
        setGratitudeItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [googleId, selectedDate]);

  return (
    <div>
      <h1>Welcome, {firstName}, to your gratitude page!</h1>
      <p>Add additional details here...</p>
      <br />
      <br />
      <GratitudeCalendar
        googleId={googleId}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        gratitudeItems={gratitudeItems}
        setGratitudeItems={setGratitudeItems}
        combinedFunction={combinedFunction}
      />
      {isSubmitted ? (
        <div>
          <p>Gratitude item successfully submitted!</p>
          <button onClick={combinedFunction}>Submit Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} name="gratitudeItems">
          <div>
            What are you grateful for?
            <br />
            <textarea
              className="input-element"
              type="text"
              name="gratitude"
              value={gratitudeItem}
              onChange={handleGratitudeItemChange}
            />
          </div>
          <br />
          <input type="submit" className="submit-button" value="Submit" />
        </form>
      )}
    </div>
  );
}

export default SuccessPage;*/


/*import React, { useState } from 'react';
import validator from 'validator';
import '../App.css';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import GratitudeCalendar from '../Calendar';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [gratitudeItem, setGratitudeItem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userAccessToken = searchParams.get('token');
  const decodedToken = jwt_decode(userAccessToken);
  const googleId = decodedToken.sub;
  const firstName = decodedToken.given_name;

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
        Authorization: `Bearer: ${userAccessToken}`,
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
  };

  return (
    <div>
      <h1>Welcome, {firstName}, to your gratitude page!</h1>
      <p>Add additional details here...</p>
      <br />
      <br />
      <GratitudeCalendar googleId={googleId} />
      {isSubmitted ? (
        <div>
          <p>Gratitude item successfully submitted!</p>
          <button onClick={() => combinedFunction()}>Submit Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} name="gratitudeItems">
          <div>
            What are you grateful for?
            <br />
            <textarea
              className="input-element"
              type="text"
              name="gratitude"
              value={gratitudeItem}
              onChange={handleGratitudeItemChange}
            />
          </div>
          <br />
          <input type="submit" className="submit-button" value="Submit" />
        </form>
      )}
    </div>
  );
}*/
