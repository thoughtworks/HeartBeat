import { useVerifyBoardEffect, useVerifyBoardStateInterface } from '@src/hooks/useVerifyBoardEffect';
import { MOCK_BOARD_URL_FOR_JIRA, FAKE_TOKEN } from '@test/fixtures';
import { act, renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

import { BOARD_TYPES } from '@test/fixtures';
import { rest } from 'msw';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppSelector: () => ({ type: BOARD_TYPES.JIRA }),
  useAppDispatch: jest.fn(() => jest.fn()),
}));

const server = setupServer();

const updateFields = (result: { current: useVerifyBoardStateInterface }) => {
  result.current.updateField('Board Id', '1');
  result.current.updateField('Email', 'fake@qq.com');
  result.current.updateField('Site', 'fake');
  result.current.updateField('Token', FAKE_TOKEN);
};

describe('use verify board state', () => {
  beforeAll(() => server.listen());
  afterAll(() => {
    jest.clearAllMocks();
    server.close();
  });
  it('should got initial data state when hook render given none input', async () => {
    const { result } = renderHook(() => useVerifyBoardEffect());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fields.length).toBe(5);
  });

  it('should got email and token fields error message when call verify function given a invalid token', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(ctx.status(HttpStatusCode.Unauthorized));
      }),
    );

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      updateFields(result);
      result.current.verifyJira();
    });

    const emailFiled = result.current.fields.find((field) => field.key === 'Email');
    const tokenField = result.current.fields.find((field) => field.key === 'Token');
    expect(emailFiled?.verifiedError).toBe('Email is incorrect!');
    expect(tokenField?.verifiedError).toBe(
      'Token is invalid, please change your token with correct access permission!',
    );
  });

  it('when call verify function given a invalid site then should got site field error message', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(
          ctx.status(HttpStatusCode.NotFound),
          ctx.json({
            message: 'site is incorrect',
          }),
        );
      }),
    );

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      updateFields(result);
      result.current.verifyJira();
    });

    await waitFor(() => {
      const site = result.current.fields.find((field) => field.key === 'Site');

      expect(site?.verifiedError).toBe('Site is incorrect!');
    });
  });

  it('should got board id field error message when call verify function given a invalid board id', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(
          ctx.status(HttpStatusCode.NotFound),
          ctx.json({
            message: 'boardId is incorrect',
          }),
        );
      }),
    );

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
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(ctx.status(HttpStatusCode.ServiceUnavailable));
      }),
    );

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      updateFields(result);
      result.current.verifyJira();
    });

    const tokenField = result.current.fields.find((field) => field.key === 'Token');
    expect(tokenField?.verifiedError).toBe('Unknown error');
  });

  it('should clear all verified error messages when update a verified error field', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(ctx.status(HttpStatusCode.Unauthorized));
      }),
    );

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
});
