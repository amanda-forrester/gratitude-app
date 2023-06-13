import React, { useEffect, useState } from 'react';
const backendUrl = "https://gratitude-app-backend.onrender.com";

const GetQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch(`${backendUrl}/quotes`);
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomQuote = data[randomIndex];
      setQuote(randomQuote.quote);
      setAuthor(randomQuote.author);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="quote-container">
      <em>{quote && author && <p>{quote} - {author}</p>} </em>
    </div>
  );
};

export default GetQuote;




