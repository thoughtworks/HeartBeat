import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@src/layouts/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
  it('should show project name', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(getByText('Heartbeat')).toBeInTheDocument();
  });
});
