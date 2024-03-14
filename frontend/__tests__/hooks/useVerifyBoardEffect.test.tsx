import { useVerifyBoardEffect, useVerifyBoardStateInterface } from '@src/hooks/useVerifyBoardEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { FAKE_TOKEN } from '@test/fixtures';
import { HttpStatusCode } from 'axios';

import { InternalServerError } from '@src/errors/InternalServerError';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { UnauthorizedError } from '@src/errors/UnauthorizedError';
import { boardClient } from '@src/clients/board/BoardClient';
import { NotFoundError } from '@src/errors/NotFoundError';
import { TimeoutError } from '@src/errors/TimeoutError';
import { BOARD_TYPES } from '@test/fixtures';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppSelector: () => ({ type: BOARD_TYPES.JIRA }),
  useAppDispatch: jest.fn(() => jest.fn()),
}));

const updateFields = (result: { current: useVerifyBoardStateInterface }) => {
  result.current.updateField('Board Id', '1');
  result.current.updateField('Email', 'fake@qq.com');
  result.current.updateField('Site', 'fake');
  result.current.updateField('Token', FAKE_TOKEN);
};

describe('use verify board state', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('should got initial data state when hook render given none input', async () => {
    const { result } = renderHook(() => useVerifyBoardEffect());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fields.length).toBe(5);
  });

  it('should got email and token fields error message when call verify function given a invalid token', async () => {
    const mockedError = new UnauthorizedError('', HttpStatusCode.Unauthorized, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(async () => {
      await updateFields(result);
      await result.current.verifyJira();
    });

    const emailFiled = result.current.fields.find((field) => field.key === 'Email');
    const tokenField = result.current.fields.find((field) => field.key === 'Token');
    expect(emailFiled?.verifiedError).toBe('Email is incorrect!');
    expect(tokenField?.verifiedError).toBe(
      'Token is invalid, please change your token with correct access permission!',
    );
  });

  it('should clear email validatedError when updateField by Email given fetch error ', async () => {
    const mockedError = new UnauthorizedError('', HttpStatusCode.Unauthorized, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(async () => {
      await updateFields(result);
      await result.current.verifyJira();
    });

    const emailFiled = result.current.fields.find((field) => field.key === 'Email');
    expect(emailFiled?.verifiedError).toBe('Email is incorrect!');

    await act(async () => {
      await result.current.updateField('Email', 'fake@qq.com');
    });
    const emailText = result.current.fields.find((field) => field.key === 'Email');
    expect(emailText?.verifiedError).toBe('');
  });

  it('should got site field error message when call verify function given a invalid site', async () => {
    const mockedError = new NotFoundError('site is incorrect', HttpStatusCode.NotFound, 'site is incorrect');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(async () => {
      await updateFields(result);
      await result.current.verifyJira();
    });

    await waitFor(() => {
      const site = result.current.fields.find((field) => field.key === 'Site');

      expect(site?.verifiedError).toBe('Site is incorrect!');
    });
  });

  it('should got board id field error message when call verify function given a invalid board id', async () => {
    const mockedError = new NotFoundError('boardId is incorrect', HttpStatusCode.NotFound, 'boardId is incorrect');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      updateFields(result);
      result.current.verifyJira();
    });

    await waitFor(() => {
      const boardId = result.current.fields.find((field) => field.key === 'Board Id');
      expect(boardId?.verifiedError).toBe('Board Id is incorrect!');
    });
  });

  it('should got token fields error message when call verify function given a unknown error', async () => {
    const mockedError = new InternalServerError('', HttpStatusCode.ServiceUnavailable, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(async () => {
      await updateFields(result);
      await result.current.verifyJira();
    });

    const tokenField = result.current.fields.find((field) => field.key === 'Token');
    expect(tokenField?.verifiedError).toBe('Unknown error');
  });

  it('should clear all verified error messages when update a verified error field', async () => {
    const mockedError = new UnauthorizedError('', HttpStatusCode.Unauthorized, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      updateFields(result);
      result.current.verifyJira();
    });
    await waitFor(() => {
      result.current.updateField('Token', 'fake-token-new');
    });

    const emailFiled = result.current.fields.find((field) => field.key === 'Email');
    const tokenField = result.current.fields.find((field) => field.key === 'Token');
    expect(emailFiled?.verifiedError).toBe('');
    expect(tokenField?.verifiedError).toBe('');
  });

  it('should set timeout is true given getVerifyBoard api is timeout', async () => {
    const mockedError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      result.current.verifyJira();
    });

    await waitFor(() => {
      const isVerifyTimeOut = result.current.isVerifyTimeOut;
      expect(isVerifyTimeOut).toBe(true);
    });
  });
});
