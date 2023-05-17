import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './GratitudeCalendar.css';

function GratitudeCalendar({ googleId, onDateChange }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [gratitudeItems, setGratitudeItems] = useState([]);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    useEffect(() => {
      if (selectedDate !== null) {
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
      }
    }, [googleId, selectedDate]);

  return (
    <div className="calendar-container"> {/* Add a container for positioning */}
      <h2>Calendar</h2>
      <div className="calendar-wrapper"> {/* Wrap the Calendar component */}
        <Calendar value={selectedDate} onChange={handleDateChange} />
      </div>
      {selectedDate && (
        <>
          {gratitudeItems.length > 0 ? (
            <div>
              <h3>On {moment(selectedDate).format('MMMM d, YYYY')} you were grateful for:</h3>
              <ul>
                {gratitudeItems.map((item, index) => (
                  <li key={index}>{item.gratitude_item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No gratitude items found for this date.</p>
          )}
        </>
      )}
    </div>
  )
};

export default GratitudeCalendar;







//this one is close.
/*import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

function GratitudeCalendar({ googleId, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [gratitudeItems, setGratitudeItems] = useState([]);
  const [isTodaySelected, setIsTodaySelected] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsTodaySelected(moment(date).isSame(moment(), 'day'));
  };

  useEffect(() => {
    if (isTodaySelected) {
      fetchGratitudeItems(moment());
    }
  }, [isTodaySelected]);

  const fetchGratitudeItems = async (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    try {
      const response = await fetch(`/gratitude/${googleId}/${formattedDate}`);
      const data = await response.json();
      setGratitudeItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Calendar</h2>
      <Calendar value={selectedDate} onChange={handleDateChange} />
      {selectedDate && (
        <>
          <p>Selected date: {moment(selectedDate).format('YYYY-MM-DD')}</p>
          {gratitudeItems.length > 0 ? (
            <div>
              <h3>Gratitude Items for {moment(selectedDate).format('YYYY-MM-DD')}</h3>
              <ul>
                {gratitudeItems.map((item, index) => (
                  <li key={index}>{item.gratitude_item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No gratitude items found for this date.</p>
          )}
        </>
      )}
    </div>
  );
}

export default GratitudeCalendar;*/











/*import React, { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

function GratitudeCalendar({ googleId, selectedDate, onDateChange, gratitudeItems, setGratitudeItems, combinedFunction }) {
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
  }, [googleId, selectedDate, setGratitudeItems]);

  return (
    <div>
      <h2>Calendar</h2>
      <Calendar value={selectedDate} onChange={onDateChange} />
      <p>Selected date: {moment(selectedDate).format('YYYY-MM-DD')}</p>
      {gratitudeItems.length > 0 && (
        <div>
          <h3>Gratitude Items for {moment(selectedDate).format('YYYY-MM-DD')}</h3>
          <ul>
            {gratitudeItems.map((item, index) => (
              <li key={index}>{item.gratitude_item}</li>
            ))}
          </ul>
        </div>
      )}
      {gratitudeItems.length === 0 && (
        <p>No gratitude items found for this date.</p>
      )}
      <button onClick={combinedFunction}>Submit Another</button>
    </div>
  );
}

export default GratitudeCalendar;*/









/*import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

function GratitudeCalendar({ googleId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gratitudeItems, setGratitudeItems] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

  useEffect(() => {
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
  }, [formattedDate, googleId]);

  return (
    <div>
      <h2>Calendar</h2>
      <Calendar value={selectedDate} onChange={handleDateChange} />
      <p>Selected date: {formattedDate}</p>
      {gratitudeItems.length > 0 && (
        <div>
          <h3>Gratitude Items for {selectedDate.toDateString()}</h3>
          <ul>
            {gratitudeItems.map((item, index) => (
              <li key={index}>{item.gratitude_item}</li>
            ))}
          </ul>
        </div>
      )}
      {gratitudeItems.length === 0 && (
        <p>No gratitude items found for this date.</p>
      )}
    </div>
  );
}

export default GratitudeCalendar;*/
