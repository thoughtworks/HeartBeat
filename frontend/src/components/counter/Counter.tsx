import React from 'react';

import { useAppSelector, useAppDispatch } from '@src/hooks';

import { decrement, increment, selectCount } from '@src/features/counter/counterSlice';

export const Counter = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          -
        </button>
        <span>{count}</span>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
    </div>
  );
};
