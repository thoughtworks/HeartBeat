import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@src/App';
import { Provider } from 'react-redux';
import { store } from '@src/store/store';
import React from 'react';

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
    const text = getByText('Hello World');

    expect(text).toBeInTheDocument();
  });

  it('should show home page when click home page', async () => {
    const { getByText } = setup();
    fireEvent.click(getByText('Home Page'));

    await waitFor(() => {
      expect(getByText('This is Home Page')).toBeInTheDocument();
    });
  });

  it('should show about page when click about page', async () => {
    const { getByText } = setup();
    fireEvent.click(getByText('About Page'));

    await waitFor(() => {
      expect(getByText('This is About Page')).toBeInTheDocument();
    });
  });
});
