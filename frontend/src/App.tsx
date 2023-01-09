import { Button } from '@mui/material';
import './App.css';
import { BrowserRouter, Link } from 'react-router-dom';
import Router from './router';
import { Counter } from './components/counter/Counter';
function App() {
  return (
    <div className="App">
      <p>Hello World</p>
      <Button variant="contained">Import Project</Button>
      <hr />
      <BrowserRouter>
        <Link to="/">Home Page</Link>
        <br />
        <Link to="/about">About Page</Link>
        <Router />
      </BrowserRouter>
      <hr />
      <Counter />
    </div>
  );
}

export default App;
