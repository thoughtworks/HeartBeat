import {
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  PIPELINE_TOOL_FIELDS,
  PIPELINE_TOOL_TYPES,
  RESET,
  TOKEN_ERROR_MESSAGE,
  VERIFIED,
  VERIFY,
  MOCK_PIPELINE_VERIFY_URL,
  FAKE_PIPELINE_TOKEN,
  REVERIFY,
} from '../../fixtures';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { render, screen, waitFor, within } from '@testing-library/react';
import { PipelineTool } from '@src/containers/ConfigStep/PipelineTool';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

export const fillPipelineToolFieldsInformation = async () => {
  const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
    'input Token',
  ) as HTMLInputElement;
  await userEvent.type(tokenInput, FAKE_PIPELINE_TOKEN);

  expect(tokenInput.value).toEqual(FAKE_PIPELINE_TOKEN);
};

let store = null;

const server = setupServer(rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(204))));

const originalVerify = pipelineToolClient.verify;

describe('PipelineTool', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <PipelineTool />
      </Provider>,
    );
  };
  afterEach(() => {
    store = null;
    pipelineToolClient.verify = originalVerify;
  });

  it('should show pipelineTool title and fields when render pipelineTool component ', () => {
    setup();

    PIPELINE_TOOL_FIELDS.map((field) => {
      expect(screen.getByLabelText(`${field} *`)).toBeInTheDocument();
    });

    expect(screen.getAllByText(CONFIG_TITLE.PIPELINE_TOOL)[0]).toBeInTheDocument();
  });

  it('should show default value buildKite when init pipelineTool component', () => {
    setup();
    const pipelineToolType = screen.getByText(PIPELINE_TOOL_TYPES.BUILD_KITE);

    expect(pipelineToolType).toBeInTheDocument();
  });

  it('should clear all fields information when click reset button', async () => {
    setup();
    const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
      'input Token',
    ) as HTMLInputElement;
    await fillPipelineToolFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    expect(tokenInput.value).toEqual('');
    expect(screen.getByText(PIPELINE_TOOL_TYPES.BUILD_KITE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RESET })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: VERIFY })).toBeDisabled();
  });

  it('should hidden timeout alert when click reset button', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    pipelineToolClient.verify = jest.fn().mockResolvedValue({ code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT });

    await userEvent.click(screen.getByText(VERIFY));

    expect(screen.getByTestId('timeoutAlert')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    expect(screen.queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should hidden timeout alert when the error type of api call becomes other', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    pipelineToolClient.verify = jest.fn().mockResolvedValue({ code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT });

    await userEvent.click(screen.getByText(VERIFY));

    expect(screen.getByTestId('timeoutAlert')).toBeInTheDocument();

    pipelineToolClient.verify = jest.fn().mockResolvedValue({ code: HttpStatusCode.Unauthorized });

    await userEvent.click(screen.getByText(REVERIFY));

    expect(screen.queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should show detail options when click pipelineTool fields', async () => {
    setup();
    await userEvent.click(screen.getByRole('combobox', { name: 'Pipeline Tool' }));
    const listBox = within(screen.getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionValue = options.map((li) => li.getAttribute('data-value'));

    expect(optionValue).toEqual(Object.values(PIPELINE_TOOL_TYPES));
  });

  it('should enabled verify button when all fields checked correctly given disable verify button', async () => {
    setup();
    const verifyButton = screen.getByRole('button', { name: VERIFY });

    expect(verifyButton).toBeDisabled();

    await fillPipelineToolFieldsInformation();

    expect(verifyButton).toBeEnabled();
  });

  it('should show error message and error style when token is empty', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    const mockInfo = 'mockToken';
    const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
      'input Token',
    ) as HTMLInputElement;
    await userEvent.type(tokenInput, mockInfo);
    await userEvent.clear(tokenInput);

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeVisible();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should not show error message when field does not trigger any event given an empty value', () => {
    setup();

    expect(screen.queryByText(TOKEN_ERROR_MESSAGE[1])).not.toBeInTheDocument();
  });

  it('should show error message when focus on field given an empty value', async () => {
    setup();

    await userEvent.click(screen.getByLabelText('input Token'));

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error message and error style when token is invalid', async () => {
    setup();
    const mockInfo = 'mockToken';
    const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
      'input Token',
    ) as HTMLInputElement;
    await userEvent.type(tokenInput, mockInfo);

    expect(tokenInput.value).toEqual(mockInfo);

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show reset button and verified button when verify succeed ', async () => {
    setup();
    await fillPipelineToolFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));
    expect(screen.getByText(RESET)).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText(VERIFIED)).toBeTruthy();
    });
  });

  it('should called verifyPipelineTool method once when click verify button', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('should check loading animation when click verify button', async () => {
    server.use(
      rest.post(MOCK_PIPELINE_VERIFY_URL, (_, res, ctx) => res(ctx.delay(300), ctx.status(HttpStatusCode.Ok))),
    );
    const { container } = setup();
    await fillPipelineToolFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
  });

  it('should check error text appear when pipelineTool verify response status is 401', async () => {
    server.use(rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))));
    const { getByText } = setup();
    await fillPipelineToolFieldsInformation();

    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(getByText('Token is incorrect!')).toBeInTheDocument();
    });
  });
});
