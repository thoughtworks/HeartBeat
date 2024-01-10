import { render, RenderResult, waitFor } from '@testing-library/react';
import App from '@src/App';
import { Provider } from 'react-redux';
import { store } from '@src/store';
jest.useFakeTimers();
describe('render app', () => {
  const setup = (): RenderResult =>
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  it('should show hello World when render app', async () => {
    const { container } = setup();

    await waitFor(() => {
      expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
    });
  });
});
