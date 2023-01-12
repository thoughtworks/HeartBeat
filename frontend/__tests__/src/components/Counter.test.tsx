import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Counter } from '@src/components/counter/Counter';
import { Provider } from 'react-redux';
import { counterSlice } from '@src/features/counter/counterSlice';
import { configureStore } from '@reduxjs/toolkit';

describe('render counter component', () => {
  const setupCounterStore = () => {
    return configureStore({
      reducer: {
        [counterSlice.name]: counterSlice.reducer,
      },
    });
  };

  let store = setupCounterStore();
  beforeEach(() => {
    store = setupCounterStore();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );

  it('should show counter elements when render counter component', () => {
    const { getByText } = setup();
    expect(getByText('-')).toBeInTheDocument();
    expect(getByText('+')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
  });

  it('should counter value add 1 when click + button', () => {
    const { getByText } = setup();

    fireEvent.click(getByText('+'));

    expect(getByText('1')).toBeInTheDocument();
  });

  it('should counter value sub 1 when click - button', () => {
    const { getByText } = setup();

    fireEvent.click(getByText('-'));

    expect(getByText('-1')).toBeInTheDocument();
  });
});
