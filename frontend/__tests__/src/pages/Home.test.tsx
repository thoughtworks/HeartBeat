import { setupStore } from '../utils/setupStoreUtil';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PROJECT_NAME } from '../fixtures';
import { Provider } from 'react-redux';
import Home from '@src/pages/Home';

const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>,
  );
};
let store = null;

describe('Home', () => {
  it('should render home page', () => {
    const { getByText } = setup();

    expect(getByText(PROJECT_NAME)).toBeInTheDocument();
  });
});
