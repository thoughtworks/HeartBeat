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
  PIPELINE_TOOL_TOKEN_INPUT_LABEL,
  TIMEOUT_ALERT_ARIA_LABEL,
} from '../../fixtures';
import { pipelineToolDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { pipelineToolSchema } from '@src/containers/ConfigStep/Form/schema';
import { render, screen, waitFor, within } from '@testing-library/react';
import { PipelineTool } from '@src/containers/ConfigStep/PipelineTool';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { setupStore } from '../../utils/setupStoreUtil';
import { FormProvider } from '@test/utils/FormProvider';
import { TimeoutError } from '@src/errors/TimeoutError';
import userEvent from '@testing-library/user-event';
import { HttpResponse, delay, http } from 'msw';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';

export const fillPipelineToolFieldsInformation = async () => {
  const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
    PIPELINE_TOOL_TOKEN_INPUT_LABEL,
  ) as HTMLInputElement;
  await userEvent.type(tokenInput, FAKE_PIPELINE_TOKEN);

  expect(tokenInput.value).toEqual(FAKE_PIPELINE_TOKEN);
};

let store = null;

const server = setupServer(
  http.post(MOCK_PIPELINE_VERIFY_URL, () => {
    return new HttpResponse(null, {
      status: HttpStatusCode.NoContent,
    });
  }),
);

const originalVerify = pipelineToolClient.verify;

describe('PipelineTool', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => {
    store = null;
    pipelineToolClient.verify = originalVerify;
  });

  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <FormProvider schema={pipelineToolSchema} defaultValues={pipelineToolDefaultValues}>
          <PipelineTool />
        </FormProvider>
      </Provider>,
    );
  };

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
      PIPELINE_TOOL_TOKEN_INPUT_LABEL,
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

    expect(screen.getByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    expect(screen.queryByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).not.toBeInTheDocument();
  });

  it('should hidden timeout alert when the error type of api call becomes other', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    pipelineToolClient.verify = jest.fn().mockResolvedValue({ code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT });

    await userEvent.click(screen.getByText(VERIFY));

    expect(screen.getByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).toBeInTheDocument();

    pipelineToolClient.verify = jest.fn().mockResolvedValue({ code: HttpStatusCode.Unauthorized });

    await userEvent.click(screen.getByText(REVERIFY));

    expect(screen.queryByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).not.toBeInTheDocument();
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
      PIPELINE_TOOL_TOKEN_INPUT_LABEL,
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

    await userEvent.click(screen.getByLabelText(PIPELINE_TOOL_TOKEN_INPUT_LABEL));

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error message and error style when token is invalid', async () => {
    setup();
    const mockInfo = 'mockToken';
    const tokenInput = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
      PIPELINE_TOOL_TOKEN_INPUT_LABEL,
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
      http.post(MOCK_PIPELINE_VERIFY_URL, async () => {
        await delay(300);
        return new HttpResponse(null, {
          status: HttpStatusCode.Ok,
        });
      }),
    );
    const { container } = setup();
    await fillPipelineToolFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
  });

  it('should check error text appear when pipelineTool verify response status is 401', async () => {
    server.use(
      http.post(MOCK_PIPELINE_VERIFY_URL, () => {
        return new HttpResponse(null, {
          status: HttpStatusCode.Unauthorized,
        });
      }),
    );
    const { getByText } = setup();
    await fillPipelineToolFieldsInformation();

    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(getByText('Token is incorrect!')).toBeInTheDocument();
    });
  });

  it('should close alert modal when user manually close the alert', async () => {
    setup();
    await fillPipelineToolFieldsInformation();
    const timeoutError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    pipelineToolClient.verify = jest.fn().mockImplementation(() => Promise.resolve(timeoutError));

    await userEvent.click(screen.getByText(VERIFY));

    expect(await screen.getByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Close'));

    expect(screen.queryByLabelText(TIMEOUT_ALERT_ARIA_LABEL)).not.toBeInTheDocument();
  });

  it('should allow user to re-submit when user interact again with form given form is already submit successfully', async () => {
    server.use(
      http.post(MOCK_PIPELINE_VERIFY_URL, async () => {
        await delay(100);
        return new HttpResponse(null, {
          status: HttpStatusCode.NoContent,
        });
      }),
    );
    setup();
    await fillPipelineToolFieldsInformation();

    expect(screen.getByRole('button', { name: /verify/i })).toBeEnabled();

    await userEvent.click(screen.getByText(/verify/i));

    expect(await screen.findByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /verified/i })).toBeDisabled();

    const tokenInput = (await screen.findByLabelText('Token *')) as HTMLInputElement;
    await userEvent.clear(tokenInput);
    await userEvent.type(tokenInput, FAKE_PIPELINE_TOKEN);
    const verifyButton = await screen.findByRole('button', { name: /verify/i });

    expect(verifyButton).toBeEnabled();
  });
});
