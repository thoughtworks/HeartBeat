import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';
import { Provider } from 'react-redux';
import { index } from '../../src/store';
import React from 'react';

describe('render app', () => {
  test('should show hello World when render app component', () => {
    const { getByText } = render(
      <Provider store={index}>
        <App />
      </Provider>
    );
    const text = getByText('Hello World');
    expect(text).toBeInTheDocument();
  });
});
