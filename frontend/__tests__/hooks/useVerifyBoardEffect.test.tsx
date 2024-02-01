import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
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
}));

const server = setupServer();

const mockConfig = {
  type: 'jira',
  boardId: '1',
  site: 'fake',
  email: 'fake@fake.com',
  token: FAKE_TOKEN,
  startTime: null,
  endTime: null,
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
    expect(result.current.formFields.length).toBe(5);
  });

  it('should got success callback when call verify function given success call', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(ctx.status(HttpStatusCode.Ok), ctx.json({ projectKey: 'FAKE' }));
      }),
    );

    const { result } = renderHook(() => useVerifyBoardEffect());
    const { verifyJira } = result.current;

    const callback = await verifyJira(mockConfig);

    await waitFor(() => {
      expect(callback.response.projectKey).toEqual('FAKE');
    });
  });

  it('should got email and token fields error message when call verify function given a invalid token', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => {
        return res(ctx.status(HttpStatusCode.Unauthorized));
      }),
    );

    const { result } = renderHook(() => useVerifyBoardEffect());
    await act(() => {
      result.current.verifyJira(mockConfig);
    });

    await waitFor(() => {
      const emailFiled = result.current.formFields.find((field) => field.name === 'email');
      expect(emailFiled?.errorMessage).toBe('Email is incorrect!');
    });
    const tokenField = result.current.formFields.find((field) => field.name === 'token');
    expect(tokenField?.errorMessage).toBe('Token is invalid, please change your token with correct access permission!');
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
      result.current.verifyJira(mockConfig);
    });

    await waitFor(() => {
      const site = result.current.formFields.find((field) => field.name === 'site');

      expect(site?.errorMessage).toBe('Site is incorrect!');
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
      result.current.verifyJira(mockConfig);
    });

    await waitFor(() => {
      const boardId = result.current.formFields.find((field) => field.name === 'boardId');

      expect(boardId?.errorMessage).toBe('Board Id is incorrect!');
    });
  });
});
