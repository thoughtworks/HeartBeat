import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import styled from '@emotion/styled';

const AppContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

function App() {
  return (
    <AppContainer>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
