import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@src/App';
import { Provider } from 'react-redux';
import { store } from '@src/store/store';
import { PROJECT_NAME } from '__tests__/src/fixtures';

describe('render app', () => {
  const setup = () => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };
  it('should show hello World when render app', () => {
    const { getByText } = setup();
    const text = getByText(PROJECT_NAME);

    expect(text).toBeInTheDocument();
  });
});
