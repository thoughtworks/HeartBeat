import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Metrics from '@src/pages/Metrics';
import { Provider } from 'react-redux';
import { store } from '@src/store';

describe('Metrics', () => {
  it('should render Metrics page', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Metrics />
        </MemoryRouter>
      </Provider>,
    );
    const steps = ['Config', 'Metrics', 'Report'];

    steps.map((label) => {
      expect(getByText(label)).toBeVisible();
    });
  });
});
