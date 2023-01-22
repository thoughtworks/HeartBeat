import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
