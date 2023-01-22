import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PROJECT_NAME } from '../fixtures';
import Home from '@src/pages/Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home', () => {
  it('should render home page', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(getByText(PROJECT_NAME)).toBeInTheDocument();
  });
});
