import { MOCK_PIPELINE_VERIFY_REQUEST_PARAMS, MOCK_PIPELINE_VERIFY_URL } from '../fixtures';
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const server = setupServer(
  rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => {
    return res(ctx.status(HttpStatusCode.NoContent));
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('use verify pipelineTool state', () => {
  it('should return empty error message when call verify feature given client returns 204', async () => {
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('');
      expect(result.current.isLoading).toEqual(false);
    });
  });

  it('should set error message when verifying pipeline given response status 401', async () => {
    server.use(rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))));
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual(`Token is incorrect!`);
    });
  });

  it('should clear error message when explicitly call clear function given error message exists', async () => {
    server.use(rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Forbidden))));
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual(
        'Forbidden request, please change your token with correct access permission.',
      );
    });

    result.current.clearErrorMessage();

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('');
    });
  });
});
