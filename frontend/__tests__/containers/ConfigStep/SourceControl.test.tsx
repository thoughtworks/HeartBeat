import {
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT,
  MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL,
  RESET,
  REVERIFY,
  SOURCE_CONTROL_FIELDS,
  TOKEN_ERROR_MESSAGE,
  VERIFIED,
  VERIFY,
} from '../../fixtures';
import { sourceControlDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { AXIOS_REQUEST_ERROR_CODE, SOURCE_CONTROL_TYPES } from '@src/constants/resources';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { sourceControlSchema } from '@src/containers/ConfigStep/Form/schema';
import { SourceControl } from '@src/containers/ConfigStep/SourceControl';
import { render, screen, act, waitFor } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import { FormProvider } from '@test/utils/FormProvider';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';
import React from 'react';

const mockValidFormtToken = 'AAAAA_XXXXXX'
  .replace('AAAAA', 'ghpghoghughsghr')
  .replace('XXXXXX', '1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b');

export const fillSourceControlFieldsInformation = async () => {
  const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

  await userEvent.type(tokenInput, mockValidFormtToken);

  expect(tokenInput.value).toEqual(mockValidFormtToken);
};

let store = null;

const server = setupServer(rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) => res(ctx.status(204))));

const originalVerifyToken = sourceControlClient.verifyToken;

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  updateShouldGetPipelineConfig: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_PIPELINE_CONFIG' }),
  initDeploymentFrequencySettings: jest.fn().mockReturnValue({ type: 'INIT_DEPLOYMENT_SETTINGS' }),
}));

describe('SourceControl', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => {
    store = null;
    sourceControlClient.verifyToken = originalVerifyToken;
  });

  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <FormProvider schema={sourceControlSchema} defaultValues={sourceControlDefaultValues}>
          <SourceControl />
        </FormProvider>
      </Provider>,
    );
  };

  it('should show sourceControl title and fields when render sourceControl component', () => {
    setup();

    expect(screen.getAllByText(CONFIG_TITLE.SOURCE_CONTROL)[0]).toBeInTheDocument();
    SOURCE_CONTROL_FIELDS.map((field) => {
      expect(screen.getByLabelText(`${field} *`)).toBeInTheDocument();
    });
  });

  it('should show default value gitHub when init sourceControl component', () => {
    setup();
    const sourceControlType = screen.getByText(SOURCE_CONTROL_TYPES.GITHUB);

    expect(sourceControlType).toBeInTheDocument();
  });

  it('should clear all fields information when click reset button', async () => {
    setup();
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

    await fillSourceControlFieldsInformation();

    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(async () => {
      expect(screen.getByRole('button', { name: RESET })).toBeTruthy();
      await userEvent.click(screen.getByRole('button', { name: RESET }));
    });

    expect(tokenInput.value).toEqual('');
    expect(screen.getByText(SOURCE_CONTROL_TYPES.GITHUB)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RESET })).not.toBeTruthy();
    expect(screen.getByRole('button', { name: VERIFY })).toBeDisabled();
  });

  it('should hidden timeout alert when click reset button', async () => {
    const { getByTestId, queryByTestId } = setup();
    await fillSourceControlFieldsInformation();
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT,
    });

    await userEvent.click(screen.getByText(VERIFY));
    expect(getByTestId('timeoutAlert')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    expect(queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should hidden timeout alert when the error type of api call becomes other', async () => {
    const { getByTestId, queryByTestId } = setup();
    await fillSourceControlFieldsInformation();
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT,
    });

    await userEvent.click(screen.getByText(VERIFY));

    expect(getByTestId('timeoutAlert')).toBeInTheDocument();

    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: HttpStatusCode.Unauthorized,
    });

    await userEvent.click(screen.getByText(REVERIFY));

    expect(queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should enable verify button when all fields checked correctly given disable verify button', async () => {
    setup();
    const verifyButton = screen.getByRole('button', { name: VERIFY });

    expect(verifyButton).toBeDisabled();

    await fillSourceControlFieldsInformation();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: VERIFY })).toBeEnabled();
    });
  });

  it('should show reset button and verified button when verify successfully', async () => {
    setup();
    await fillSourceControlFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

    await waitFor(() => {
      expect(screen.getByText(RESET)).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText(VERIFIED)).toBeTruthy();
    });
  });

  it('should reload pipeline config when reset fields', async () => {
    setup();
    await fillSourceControlFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    await fillSourceControlFieldsInformation();

    expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
  });

  it('should show error message and error style when token is empty', async () => {
    setup();

    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;
    act(() => {
      tokenInput.focus();
    });

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should not show error message when field does not trigger any event given an empty value', () => {
    setup();

    expect(screen.queryByText(TOKEN_ERROR_MESSAGE[1])).not.toBeInTheDocument();
  });

  it('should show error message when focus on field given an empty value', async () => {
    setup();

    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;
    act(() => {
      tokenInput.focus();
    });

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error message and error style when token is invalid', async () => {
    setup();
    const mockInfo = 'mockToken';
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

    await userEvent.type(tokenInput, mockInfo);

    expect(tokenInput.value).toEqual(mockInfo);
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error notification when sourceControl verify response status is 401', async () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))),
    );
    setup();

    await fillSourceControlFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    expect(screen.getByText(MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT)).toBeInTheDocument();
  });

  it('should close alert modal when user manually close the alert', async () => {
    setup();
    await fillSourceControlFieldsInformation();
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: AXIOS_REQUEST_ERROR_CODE.TIMEOUT,
    });

    await userEvent.click(screen.getByText(VERIFY));

    expect(await screen.getByTestId('timeoutAlert')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Close'));

    expect(screen.queryByLabelText('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should allow user to re-submit when user interact again with form given form is already submit successfully', async () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) =>
        res(ctx.delay(100), ctx.status(HttpStatusCode.NoContent)),
      ),
    );
    setup();
    await fillSourceControlFieldsInformation();

    expect(screen.getByRole('button', { name: /verify/i })).toBeEnabled();

    await userEvent.click(screen.getByText(/verify/i));

    expect(await screen.findByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /verified/i })).toBeDisabled();

    const tokenInput = (await screen.findByLabelText('Token *')) as HTMLInputElement;
    await userEvent.clear(tokenInput);
    await userEvent.type(tokenInput, mockValidFormtToken);
    const verifyButton = await screen.findByRole('button', { name: /verify/i });

    expect(verifyButton).toBeEnabled();
  });
});
