import React, { useState, useEffect } from 'react';
import '../App.css';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import GratitudeCalendar from '../Calendar';
import GetQuote from '../GetQuote';
import moment from 'moment';
import validator from 'validator';
import '../SuccessPage.css';
import { useCookies } from 'react-cookie';
import Cookies from 'universal-cookie';
import LogoutButton from '../LogoutButton';

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
  const [cookies, setCookie, removeCookie] = useCookies(['session']);

  useEffect(() => {
    setCookie('session', userAccessToken, { path: '/', maxAge: 30 } );
  }, [userAccessToken, setCookie]);

  //const cookies = new Cookies();
  //cookies.set('session', {key: value}, {path: '/', expires: new Date(Date.now()+2592000)});
  //cookies.set('session', true, {
    //path: '/',
   // maxAge: 172800000,
//});
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
        Authorization: `Bearer ${userAccessToken}`,
        Cookie: cookies.session,
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
        const response = await fetch(`/gratitude/${googleId}/${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
            Cookie: cookies.session,
          },
        });
        const data = await response.json();
        setGratitudeItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [googleId, selectedDate, userAccessToken, cookies.session]);

  return (
    <div>
      {<LogoutButton/>}
      <h1>Welcome, {firstName}, to your gratitude page!</h1>
      < GetQuote /> 
      <br />
      <br />
      <div className="SuccessPage">
        <div className="form-container">
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
        <div className="calendar-container">
          <GratitudeCalendar
            googleId={googleId}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            gratitudeItems={gratitudeItems}
            setGratitudeItems={setGratitudeItems}
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;











