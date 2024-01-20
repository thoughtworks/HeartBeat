import {
  MOCK_BOARD_URL_FOR_CLASSIC_JIRA,
  MOCK_BOARD_URL_FOR_JIRA,
  MOCK_BOARD_VERIFY_REQUEST_PARAMS,
  MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS,
  VERIFY_ERROR_MESSAGE,
} from '../fixtures';
import { boardClient } from '@src/clients/board/BoardClient';
import { AXIOS_ERROR_MESSAGE } from '../../src/fixtures';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const server = setupServer(
  rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
  rest.post(MOCK_BOARD_URL_FOR_CLASSIC_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
);

describe('verify board request', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it('should isBoardVerify is true when board verify response status 200', async () => {
    const result = await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);

    expect(result.isBoardVerify).toEqual(true);
  });

  it('should isBoardVerify is true when select classic jira and board verify response status 200', async () => {
    const result = await boardClient.getVerifyBoard(MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS);

    expect(result.isBoardVerify).toEqual(true);
  });

  it('should isNoDoneCard is true when board verify response status 204', async () => {
    server.use(rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))));

    const result = await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);

    expect(result.haveDoneCard).toEqual(false);
    expect(result.isBoardVerify).toEqual(false);
  });

  it('should throw error when board verify response status 400', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.BadRequest), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.BAD_REQUEST })),
      ),
    );

    boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toMatch(VERIFY_ERROR_MESSAGE.BAD_REQUEST);
    });
  });

  it('should throw error when board verify response status 401', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Unauthorized), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.UNAUTHORIZED })),
      ),
    );

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should throw error when board verify response status 500', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.InternalServerError),
          ctx.json({
            hintInfo: VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          }),
        ),
      ),
    );

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  });

  it('should throw error when board verify response status 503', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(
          ctx.status(HttpStatusCode.ServiceUnavailable),
          ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.REQUEST_TIMEOUT }),
        ),
      ),
    );

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.REQUEST_TIMEOUT);
  });

  it('should throw error when board verify response status 300', async () => {
    server.use(rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.MultipleChoices))));

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    }).rejects.toThrow(VERIFY_ERROR_MESSAGE.UNKNOWN);
  });

  it('should throw `Network Error` when board verify encountered netwrok error', async () => {
    server.use(rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res) => res.networkError('Network Error')));

    await expect(async () => {
      await boardClient.getVerifyBoard(MOCK_BOARD_VERIFY_REQUEST_PARAMS);
    }).rejects.toThrow(AXIOS_ERROR_MESSAGE.ERR_NETWORK);
  });
});
