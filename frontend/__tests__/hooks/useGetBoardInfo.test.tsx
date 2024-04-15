import { MOCK_BOARD_INFO_URL, FAKE_TOKEN, FAKE_DATE_EARLIER, FAKE_DATE_LATER } from '@test/fixtures';
import { useGetBoardInfoEffect } from '@src/hooks/useGetBoardInfo';
import { renderHook, act, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const server = setupServer();

const mockBoardConfig = {
  type: 'jira',
  boardId: '1',
  projectKey: 'FAKE',
  site: 'fake',
  email: 'fake@fake.com',
  token: FAKE_TOKEN,
  dateRanges: [
    {
      startDate: FAKE_DATE_LATER.startDate,
      endDate: FAKE_DATE_LATER.endDate,
    },
    {
      startDate: FAKE_DATE_EARLIER.startDate,
      endDate: FAKE_DATE_EARLIER.endDate,
    },
  ],
};

describe('use get board info', () => {
  beforeAll(() => server.listen());
  afterAll(() => {
    jest.clearAllMocks();
    server.close();
  });
  it('should got init data when hook render', () => {
    const { result } = renderHook(() => useGetBoardInfoEffect());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toMatchObject({});
  });

  it.each([
    [
      HttpStatusCode.NoContent,
      'No card within selected date range!',
      'Please go back to the previous page and change your collection date, or check your board info!',
    ],
    [
      HttpStatusCode.BadRequest,
      'Failed to get the board configuration!',
      'Please go back to the previous page to check your board info, or change your time range!',
    ],
    [
      HttpStatusCode.Unauthorized,
      'Failed to get the board configuration!',
      'Please go back to the previous page to check your board info, or change your time range!',
    ],
    [
      HttpStatusCode.Forbidden,
      'Failed to get the board configuration!',
      'Please go back to the previous page to check your board info, or change your time range!',
    ],
    [
      HttpStatusCode.NotFound,
      'Failed to get the board configuration!',
      'Please go back to the previous page to check your board info, or change your time range!',
    ],
  ])('should got error message when got code is %s', async (code, title, message) => {
    server.use(
      rest.post(MOCK_BOARD_INFO_URL, (_, res, ctx) => {
        return res(ctx.status(code));
      }),
    );

    const { result } = renderHook(() => useGetBoardInfoEffect());
    await act(() => {
      result.current.getBoardInfo(mockBoardConfig);
    });

    await waitFor(() => {
      expect(result.current.errorMessage.title).toEqual(title);
    });
    expect(result.current.errorMessage.message).toEqual(message);
  });
});
