import counterReducer, { CounterState, increment, decrement } from '@src/features/counter/counterSlice';

describe('counter reducer', () => {
  const initialState: CounterState = {
    value: 0,
  };

  it('should get 0 when handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
    });
  });

  it('should get 1 when handle increment', () => {
    const actual = counterReducer(initialState, increment());

    expect(actual.value).toEqual(1);
  });

  it('should get -1 when handle decrement', () => {
    const actual = counterReducer(initialState, decrement());

    expect(actual.value).toEqual(-1);
  });
});
