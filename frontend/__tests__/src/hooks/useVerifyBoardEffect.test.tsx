import { ERROR_MESSAGE_TIME_DURATION, MOCK_BOARD_VERIFY_REQUEST_PARAMS, VERIFY_FAILED } from '../fixtures';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
import { boardClient } from '@src/clients/board/BoardClient';
import { act, renderHook } from '@testing-library/react';
import { HttpStatusCode } from 'axios';

describe('use verify board state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifyBoardEffect());

    expect(result.current.isLoading).toEqual(false);
  });
  it('should set error message when get verify board throw error', async () => {
    jest.useFakeTimers();
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });
    const { result } = renderHook(() => useVerifyBoardEffect());

    expect(result.current.isLoading).toEqual(false);

    act(() => {
      result.current.verifyJira(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    expect(result.current.errorMessage).toEqual('');
  });
  it('should set error message when get verify board response status 500', async () => {
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError);
    });
    const { result } = renderHook(() => useVerifyBoardEffect());

    act(() => {
      result.current.verifyJira(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    });

    expect(result.current.errorMessage).toEqual(
      `${MOCK_BOARD_VERIFY_REQUEST_PARAMS.type} ${VERIFY_FAILED}: error message`,
    );
  });
});
