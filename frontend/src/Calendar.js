import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './GratitudeCalendar.css';

function GratitudeCalendar({ googleId, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gratitudeItems, setGratitudeItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

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
          setGratitudeItems(data.items);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [googleId, selectedDate]);

  const handleClickForward = () => {
    const totalPages = Math.ceil(gratitudeItems.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handleClickBackward = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, gratitudeItems.length);

  const displayedGratitudeItems = gratitudeItems.slice(startIndex - 1, endIndex);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-only">
        <Calendar value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className = "gratitude-list">
      {selectedDate && (
        <>
          {displayedGratitudeItems.length > 0 ? (
            <div>
              <h3>On {moment(selectedDate).format('MMMM D, YYYY')} you were grateful for:</h3>
              <ol>
                {displayedGratitudeItems.map((item, index) => (
                  <li key={startIndex + index}>{item.gratitude_item}</li>
                ))}
              </ol>
              <div className="pagination">
                <button onClick={handleClickBackward} disabled={currentPage === 0}>
                  Previous
                </button>
                <button onClick={handleClickForward} disabled={endIndex >= gratitudeItems.length}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No gratitude items found for this date.</p>
          )}
        </>
      )}
      </div>
    </div>
  );
}

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
