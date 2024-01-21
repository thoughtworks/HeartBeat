import {
  BOARD_FIELDS,
  BOARD_TYPES,
  CONFIG_TITLE,
  ERROR_MESSAGE_COLOR,
  MOCK_BOARD_URL_FOR_JIRA,
  NO_CARD_ERROR_MESSAGE,
  RESET,
  VERIFIED,
  VERIFY,
  VERIFY_ERROR_MESSAGE,
  VERIFY_FAILED,
} from '../../fixtures';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Board } from '@src/containers/ConfigStep/Board';
import { setupStore } from '../../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';
import React from 'react';

export const fillBoardFieldsInformation = () => {
  const fields = ['Board Id', 'Email', 'Project Key', 'Site', 'Token'];
  const mockInfo = ['2', 'mockEmail@qq.com', 'mockKey', '1', 'mockToken'];
  const fieldInputs = fields.map((label) => screen.getByTestId(label).querySelector('input') as HTMLInputElement);
  fieldInputs.map((input, index) => {
    fireEvent.change(input, { target: { value: mockInfo[index] } });
  });
  fieldInputs.map((input, index) => {
    expect(input.value).toEqual(mockInfo[index]);
  });
};

let store = null;

const server = setupServer(rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(200))));

describe('Board', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  store = setupStore();
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <Board />
      </Provider>,
    );
  };

  afterEach(() => {
    store = null;
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
    const boardType = screen.getByText(BOARD_TYPES.JIRA);

    expect(boardType).toBeInTheDocument();

    const option = screen.queryByText(BOARD_TYPES.CLASSIC_JIRA);
    expect(option).not.toBeTruthy();
  });

  it('should show detail options when click board field', () => {
    setup();
    fireEvent.mouseDown(screen.getByRole('button', { name: CONFIG_TITLE.BOARD }));
    const listBox = within(screen.getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionValue = options.map((li) => li.getAttribute('data-value'));

    expect(optionValue).toEqual(Object.values(BOARD_TYPES));
  });

  it('should show board type when select board field value ', async () => {
    setup();

    fireEvent.mouseDown(screen.getByRole('button', { name: CONFIG_TITLE.BOARD }));
    fireEvent.click(screen.getByText(BOARD_TYPES.CLASSIC_JIRA));

    await waitFor(() => {
      expect(screen.getByText(BOARD_TYPES.CLASSIC_JIRA)).toBeInTheDocument();
    });
  });

  it('should show error message when input a wrong type or empty email ', async () => {
    setup();
    const EMAil_INVALID_ERROR_MESSAGE = 'Email is invalid';
    const emailInput = screen.getByTestId('Email').querySelector('input') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'wrong type email' } });

    expect(screen.getByText(EMAil_INVALID_ERROR_MESSAGE)).toBeVisible();
    expect(screen.getByText(EMAil_INVALID_ERROR_MESSAGE)).toHaveStyle(ERROR_MESSAGE_COLOR);

    fireEvent.change(emailInput, { target: { value: '' } });

    const EMAIL_REQUIRE_ERROR_MESSAGE = 'Email is required';
    expect(screen.getByText(EMAIL_REQUIRE_ERROR_MESSAGE)).toBeVisible();
  });

  it('should clear other fields information when change board field selection', () => {
    setup();
    const boardIdInput = screen.getByRole('textbox', {
      name: 'Board Id',
    }) as HTMLInputElement;
    const emailInput = screen.getByRole('textbox', {
      name: 'Email',
    }) as HTMLInputElement;

    fireEvent.change(boardIdInput, { target: { value: 2 } });
    fireEvent.change(emailInput, { target: { value: 'mockEmail@qq.com' } });
    fireEvent.mouseDown(screen.getByRole('button', { name: CONFIG_TITLE.BOARD }));
    fireEvent.click(screen.getByText(BOARD_TYPES.CLASSIC_JIRA));

    expect(emailInput.value).toEqual('');
    expect(boardIdInput.value).toEqual('');
  });

  it('should clear all fields information when click reset button', async () => {
    setup();
    const fieldInputs = BOARD_FIELDS.slice(1, 5).map(
      (label) =>
        screen.getByRole('textbox', {
          name: label,
          hidden: true,
        }) as HTMLInputElement,
    );
    fillBoardFieldsInformation();

    fireEvent.click(screen.getByText(VERIFY));
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: RESET }));
    });

    fieldInputs.map((input) => {
      expect(input.value).toEqual('');
    });
    expect(screen.getByText(BOARD_TYPES.JIRA)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: RESET })).not.toBeTruthy();
    expect(screen.queryByRole('button', { name: VERIFY })).toBeDisabled();
  });

  it('should enabled verify button when all fields checked correctly given disable verify button', () => {
    setup();
    const verifyButton = screen.getByRole('button', { name: VERIFY });

    expect(verifyButton).toBeDisabled();

    fillBoardFieldsInformation();

    expect(verifyButton).toBeEnabled();
  });

  it('should show reset button and verified button when verify succeed ', async () => {
    setup();
    fillBoardFieldsInformation();

    fireEvent.click(screen.getByText(VERIFY));

    await waitFor(() => {
      expect(screen.getByText(RESET)).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.getByText(VERIFIED)).toBeTruthy();
    });
  });

  it('should called verifyBoard method once when click verify button', async () => {
    setup();
    fillBoardFieldsInformation();
    fireEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  it('should check loading animation when click verify button', async () => {
    const { container } = setup();
    fillBoardFieldsInformation();
    fireEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
    });
  });

  it('should check noCardPop show and disappear when board verify response status is 204', async () => {
    server.use(rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))));
    setup();
    fillBoardFieldsInformation();

    fireEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(screen.getByText(NO_CARD_ERROR_MESSAGE)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ok' }));
    expect(screen.getByText(NO_CARD_ERROR_MESSAGE)).not.toBeVisible();
  });

  it('should check error notification show and disappear when board verify response status is 401', async () => {
    server.use(
      rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
        res(ctx.status(HttpStatusCode.Unauthorized), ctx.json({ hintInfo: VERIFY_ERROR_MESSAGE.UNAUTHORIZED })),
      ),
    );
    setup();
    fillBoardFieldsInformation();

    fireEvent.click(screen.getByRole('button', { name: VERIFY }));

    await waitFor(() => {
      expect(
        screen.getByText(`${BOARD_TYPES.JIRA} ${VERIFY_FAILED}: ${VERIFY_ERROR_MESSAGE.UNAUTHORIZED}`),
      ).toBeInTheDocument();
    });
  });
});
