import './App.css';
import Users from './Gratitude.js';

function App() {
  return (
  
    <div className="App">
      <header className="App-header">
        <Users />
        <label for="gratitude">What are you grateful for?</label>
        <br></br>
        <textarea id="gratitude" name="gratitude" rows="4" cols="50"></textarea>
        <br></br>
        <button>Submit</button>
      </header>
    </div>
  );
}

export default App;
