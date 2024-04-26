import {
  BOARD_FIELDS,
  BOARD_TYPES,
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  MOCK_BOARD_URL_FOR_JIRA,
  RESET,
  VERIFIED,
  VERIFY,
  FAKE_TOKEN,
  REVERIFY,
} from '../../fixtures';
import { boardConfigDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { boardConfigSchema } from '@src/containers/ConfigStep/Form/schema';
import { render, screen, waitFor, within } from '@testing-library/react';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { boardClient } from '@src/clients/board/BoardClient';
import { Board } from '@src/containers/ConfigStep/Board';
import { setupStore } from '../../utils/setupStoreUtil';
import { FormProvider } from '@test/utils/FormProvider';
import { TimeoutError } from '@src/errors/TimeoutError';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';

export const fillBoardFieldsInformation = async () => {
  await userEvent.type(screen.getByLabelText(/board id/i), '1');
  await userEvent.type(screen.getByLabelText(/email/i), 'fake@qq.com');
  await userEvent.type(screen.getByLabelText(/site/i), 'fake');
  await userEvent.type(screen.getByLabelText(/token/i), FAKE_TOKEN);
};

let store = null;

const server = setupServer();

const mockVerifySuccess = (delay = 0) => {
  server.use(
    rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) =>
      res(
        ctx.json({
          projectKey: 'FAKE',
        }),
        ctx.delay(delay),
      ),
    ),
  );
};

const originalGetVerifyBoard = boardClient.getVerifyBoard;

describe('Board', () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => server.close());

  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <FormProvider schema={boardConfigSchema} defaultValues={boardConfigDefaultValues}>
          <Board />
        </FormProvider>
      </Provider>,
    );
  };

  afterEach(() => {
    store = null;
    boardClient.getVerifyBoard = originalGetVerifyBoard;
  });

  it('should show board title and fields when render board component ', () => {
    setup();
    BOARD_FIELDS.map((field) => {
      expect(screen.getByLabelText(`${field} *`)).toBeInTheDocument();
    });
    expect(screen.getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
  });

  it('should show default value jira when init board component', () => {
    setup();
    const boardType = screen.getByRole('combobox', {
      name: /board/i,
    });

    expect(boardType).toBeInTheDocument();
  });

  it('should show detail options when click board field', async () => {
    setup();
    await userEvent.click(screen.getByRole('combobox', { name: CONFIG_TITLE.BOARD }));
    const listBox = within(screen.getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionValue = options.map((li) => li.getAttribute('data-value'));

    expect(optionValue).toEqual(Object.values(BOARD_TYPES));
  });

  it('should show board type when select board field value ', async () => {
    setup();
    await userEvent.click(screen.getByRole('combobox', { name: CONFIG_TITLE.BOARD }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /jira/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('option', { name: /jira/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('combobox', {
          name: /board/i,
        }),
      ).toBeInTheDocument();
    });
  });

  it('should show error message when input a wrong type or empty email ', async () => {
    setup();
    const EMAil_INVALID_ERROR_MESSAGE = 'Email is invalid!';
    const emailInput = screen.getByRole('textbox', {
      name: /email/i,
    });

    await userEvent.type(emailInput, 'wrong@email');

    await waitFor(() => {
      expect(screen.getByText(EMAil_INVALID_ERROR_MESSAGE)).toBeVisible();
    });

    expect(screen.getByText(EMAil_INVALID_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR);

    await userEvent.clear(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Email is required!')).toBeVisible();
    });
  });

  it('should clear all fields information when click reset button', async () => {
    setup();
    mockVerifySuccess();
    await fillBoardFieldsInformation();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /verify/i })).not.toBeDisabled();
    });

    await userEvent.click(screen.getByText(/verify/i));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /verified/i })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/board id/i)).not.toHaveValue();
    });
    expect(screen.getByLabelText(/email/i)).not.toHaveValue();
    expect(screen.getByLabelText(/site/i)).not.toHaveValue();
    expect(screen.getByLabelText(/token/i)).not.toHaveValue();

    await userEvent.click(screen.getByRole('combobox', { name: /board/i }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /jira/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('option', { name: /jira/i }));
  });

  it('should hidden timeout alert when click reset button', async () => {
    const { getByTestId, queryByTestId } = setup();
    await fillBoardFieldsInformation();
    const mockedError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    await userEvent.click(screen.getByText(VERIFY));

    expect(getByTestId('timeoutAlert')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: RESET }));

    expect(queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should hidden timeout alert when the error type of api call becomes other', async () => {
    const { getByTestId, queryByTestId } = setup();
    await fillBoardFieldsInformation();
    const timeoutError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(timeoutError));

    await userEvent.click(screen.getByText(VERIFY));

    expect(getByTestId('timeoutAlert')).toBeInTheDocument();

    const mockedError = new TimeoutError('', HttpStatusCode.Unauthorized);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(mockedError));

    await userEvent.click(screen.getByText(REVERIFY));

    expect(queryByTestId('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should show reset button and verified button when verify succeed ', async () => {
    mockVerifySuccess();
    setup();
    await fillBoardFieldsInformation();

    await userEvent.click(screen.getByText(VERIFY));

    await waitFor(() => {
      expect(screen.getByText(RESET)).toBeVisible();
    });

    expect(screen.getByText(VERIFIED)).toBeInTheDocument();
  });

  it('should called verifyBoard method once when click verify button', async () => {
    mockVerifySuccess();
    setup();
    await fillBoardFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  it('should check loading animation when click verify button', async () => {
    mockVerifySuccess(300);
    setup();
    await fillBoardFieldsInformation();
    await userEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  it('should show error message when board verify response status is 401', async () => {
    server.use(rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => res(ctx.status(HttpStatusCode.Unauthorized))));
    setup();
    await fillBoardFieldsInformation();

    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Token is invalid, please change your token with correct access permission!/i),
      ).toBeInTheDocument();
    });
  });

  it('should close alert modal when user manually close the alert', async () => {
    setup();
    await fillBoardFieldsInformation();
    const timeoutError = new TimeoutError('', AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => Promise.reject(timeoutError));

    await userEvent.click(screen.getByText(VERIFY));

    expect(screen.getByTestId('timeoutAlert')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Close'));

    expect(screen.queryByLabelText('timeoutAlert')).not.toBeInTheDocument();
  });

  it('should allow user to re-submit when user interact again with form given form is already submit successfully', async () => {
    setup();
    mockVerifySuccess();
    await fillBoardFieldsInformation();

    expect(screen.getByRole('button', { name: /verify/i })).toBeEnabled();

    await userEvent.click(screen.getByText(/verify/i));

    expect(await screen.findByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /verified/i })).toBeDisabled();

    const emailInput = (await screen.findByRole('textbox', { name: 'Email' })) as HTMLInputElement;
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'other@qq.com');
    const verifyButton = await screen.findByRole('button', { name: /verify/i });

    expect(verifyButton).toBeEnabled();
  });
});
