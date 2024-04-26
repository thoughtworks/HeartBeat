import { boardConfigDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { boardConfigSchema } from '@src/containers/ConfigStep/Form/schema';
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
import { InternalServerError } from '@src/errors/InternalServerError';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { UnauthorizedError } from '@src/errors/UnauthorizedError';
import { boardClient } from '@src/clients/board/BoardClient';
import { NotFoundError } from '@src/errors/NotFoundError';
import { TimeoutError } from '@src/errors/TimeoutError';
import { FormProvider } from '@test/utils/FormProvider';
import { setupStore } from '../utils/setupStoreUtil';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';
import { ReactNode } from 'react';

const setErrorSpy = jest.fn();
const resetSpy = jest.fn();

jest.mock('react-hook-form', () => {
  return {
    ...jest.requireActual('react-hook-form'),
    useFormContext: () => {
      const { useFormContext } = jest.requireActual('react-hook-form');
      const originals = useFormContext();
      return {
        ...originals,
        setError: (...args: [string, { message: string }]) => setErrorSpy(...args),
        reset: (...args: [string, { message: string }]) => resetSpy(...args),
      };
    },
  };
});

const HookWrapper = ({ children }: { children: ReactNode }) => {
  const store = setupStore();
  return (
    <Provider store={store}>
      <FormProvider defaultValues={boardConfigDefaultValues} schema={boardConfigSchema}>
        {children}
      </FormProvider>
    </Provider>
  );
};

const setup = () => {
  const { result } = renderHook(useVerifyBoardEffect, { wrapper: HookWrapper });

  return { result };
};

describe('use verify board state', () => {
  beforeEach(() => {
    setErrorSpy.mockClear();
    resetSpy.mockClear();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('should got initial data state when hook render given none input', async () => {
    const { result } = setup();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fields.length).toBe(5);
  });

  it('should keep verified values when call verify function given a valid token', async () => {
    const mockedOkResponse = {
      response: 'ok',
    };
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.resolve(mockedOkResponse));

    const { result } = setup();
    await result.current.verifyJira();

    expect(resetSpy).toHaveBeenCalledWith(
      {
        type: 'Jira',
        boardId: '',
        email: '',
        site: '',
        token: '',
      },
      { keepValues: true },
    );
  });

  it('should got email and token fields error message when call verify function given a invalid token', async () => {
    const mockedError = new UnauthorizedError('', HttpStatusCode.Unauthorized, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = setup();
    await result.current.verifyJira();

    expect(setErrorSpy).toHaveBeenCalledWith('email', { message: 'Email is incorrect!' });
    expect(setErrorSpy).toHaveBeenCalledWith('token', {
      message: 'Token is invalid, please change your token with correct access permission!',
    });
  });

  it('should got site field error message when call verify function given a invalid site', async () => {
    const mockedError = new NotFoundError('site is incorrect', HttpStatusCode.NotFound, 'site is incorrect');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = setup();
    await result.current.verifyJira();

    expect(setErrorSpy).toHaveBeenCalledWith('site', { message: 'Site is incorrect!' });
  });

  it('should got board id field error message when call verify function given a invalid board id', async () => {
    const mockedError = new NotFoundError('boardId is incorrect', HttpStatusCode.NotFound, 'boardId is incorrect');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = setup();
    await result.current.verifyJira();

    expect(setErrorSpy).toHaveBeenCalledWith('boardId', { message: 'Board Id is incorrect!' });
  });

  it('should got token fields error message when call verify function given a unknown error', async () => {
    const mockedError = new InternalServerError('', HttpStatusCode.ServiceUnavailable, '');
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = setup();
    await result.current.verifyJira();

    expect(setErrorSpy).toHaveBeenCalledWith('token', { message: 'Unknown error' });
  });

  it('should set timeout is true given getVerifyBoard api is timeout', async () => {
    const mockedError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    const { result } = setup();
    await result.current.verifyJira();

    expect(setErrorSpy).toHaveBeenCalledWith('token', { message: 'Timeout!' });
  });

  it('should clear all verified error messages when call resetFeilds', async () => {
    const { result } = setup();

    result.current.resetFields();

    expect(resetSpy).toHaveBeenCalledWith({
      type: 'Jira',
      boardId: '',
      email: '',
      site: '',
      token: '',
    });
  });
});
