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
import { AXIOS_REQUEST_ERROR_CODE, SOURCE_CONTROL_TYPES } from '@src/constants/resources';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SourceControl } from '@src/containers/ConfigStep/SourceControl';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';
import React from 'react';

export const fillSourceControlFieldsInformation = () => {
  const mockInfo = 'AAAAA_XXXXXX'
    .replace('AAAAA', 'ghpghoghughsghr')
    .replace('XXXXXX', '1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b');
  const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

  fireEvent.change(tokenInput, { target: { value: mockInfo } });

  expect(tokenInput.value).toEqual(mockInfo);
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
  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <SourceControl />
      </Provider>,
    );
  };
  afterEach(() => {
    store = null;
    sourceControlClient.verifyToken = originalVerifyToken;
  });

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

    fillSourceControlFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

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

  it('should enable verify button when all fields checked correctly given disable verify button', () => {
    setup();
    const verifyButton = screen.getByRole('button', { name: VERIFY });

    expect(verifyButton).toBeDisabled();

    fillSourceControlFieldsInformation();

    expect(verifyButton).toBeEnabled();
  });

  it('should show reset button and verified button when verify successfully', async () => {
    setup();
    fillSourceControlFieldsInformation();

    fireEvent.click(screen.getByText(VERIFY));

    await waitFor(() => {
      expect(screen.getByText(RESET)).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText(VERIFIED)).toBeTruthy();
    });
  });

  it('should reload pipeline config when reset fields', async () => {
    setup();
    fillSourceControlFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    fillSourceControlFieldsInformation();

    expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
  });

  it('should show error message and error style when token is empty', () => {
    setup();

    fillSourceControlFieldsInformation();

    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

    fireEvent.change(tokenInput, { target: { value: '' } });

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should not show error message when field does not trigger any event given an empty value', () => {
    setup();

    expect(screen.queryByText(TOKEN_ERROR_MESSAGE[1])).not.toBeInTheDocument();
  });

  it('should show error message when focus on field given an empty value', () => {
    setup();

    fireEvent.focus(screen.getByLabelText('input Token'));

    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[1])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error message and error style when token is invalid', () => {
    setup();
    const mockInfo = 'mockToken';
    const tokenInput = screen.getByTestId('sourceControlTextField').querySelector('input') as HTMLInputElement;

    fireEvent.change(tokenInput, { target: { value: mockInfo } });

    expect(tokenInput.value).toEqual(mockInfo);
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toBeInTheDocument();
    expect(screen.getByText(TOKEN_ERROR_MESSAGE[0])).toHaveStyle(ERROR_MESSAGE_COLOR);
  });

  it('should show error notification when sourceControl verify response status is 401', async () => {
    server.use(
      rest.post(MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))),
    );
    setup();

    fillSourceControlFieldsInformation();

    fireEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(screen.getByText(MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT)).toBeInTheDocument();
    });
  });
});
