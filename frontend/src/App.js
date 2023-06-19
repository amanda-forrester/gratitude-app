import './App.css';
import LoginPage from './Routes/LoginPage';
import SuccessPage from './Routes/SuccessPage';
import TestPage from './Routes/TestPage';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
const frontendUrl = 'https://gratitude-app.onrender.com/';

function App() {
  return (
    <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={ <LoginPage /> } />
              <Route path="/success" element={ <SuccessPage />} />
              <Route path="/test" element={ <TestPage />} />
            </Routes>
          </BrowserRouter>
        </header>
    </div>
  );
}

export default App;
