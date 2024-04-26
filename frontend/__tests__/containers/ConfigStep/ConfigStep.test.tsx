// TODO: refactor case, replace fireEvent use userEvent. @Kai Zhou
import {
  CHINA_CALENDAR,
  CONFIG_TITLE,
  DEPLOYMENT_FREQUENCY,
  ERROR_MESSAGE_TIME_DURATION,
  FAKE_PIPELINE_TOKEN,
  MOCK_BOARD_URL_FOR_JIRA,
  MOCK_PIPELINE_VERIFY_URL,
  PROJECT_NAME_LABEL,
  REGULAR_CALENDAR,
  REQUIRED_DATA,
  RESET,
  TEST_PROJECT_NAME,
  VELOCITY,
  VERIFIED,
  VERIFY,
  ALL,
  FAKE_TOKEN,
  PIPELINE_TOOL_TOKEN_INPUT_LABEL,
} from '../../fixtures';
import {
  basicInfoSchema,
  boardConfigSchema,
  pipelineToolSchema,
  sourceControlSchema,
  IBasicInfoData,
  IBoardConfigData,
  IPipelineToolData,
  ISourceControlData,
} from '@src/containers/ConfigStep/Form/schema';
import {
  basicInfoDefaultValues,
  boardConfigDefaultValues,
  pipelineToolDefaultValues,
  sourceControlDefaultValues,
} from '@src/containers/ConfigStep/Form/useDefaultValues';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import { yupResolver } from '@hookform/resolvers/yup';
import userEvent from '@testing-library/user-event';
import ConfigStep from '@src/containers/ConfigStep';
import { closeMuiModal } from '@test/testUtils';
import { useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import dayjs from 'dayjs';

const server = setupServer(
  rest.post(MOCK_PIPELINE_VERIFY_URL, (_, res, ctx) => res(ctx.status(204))),
  rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        projectKey: 'FAKE',
      }),
    ),
  ),
);

export const fillBoardFieldsInformation = async () => {
  await userEvent.type(screen.getByLabelText(/board id/i), '1');
  await userEvent.type(screen.getByLabelText(/email/i), 'fake@qq.com');
  await userEvent.type(screen.getByLabelText(/site/i), 'fake');
  await userEvent.type(screen.getByLabelText(/token/i), FAKE_TOKEN);
};

let store = null;
jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}));

const ConfigStepWithFormInstances = () => {
  const basicInfoMethods = useForm<IBasicInfoData>({
    defaultValues: basicInfoDefaultValues,
    resolver: yupResolver(basicInfoSchema),
    mode: 'onChange',
  });

  const boardConfigMethods = useForm<IBoardConfigData>({
    defaultValues: boardConfigDefaultValues,
    resolver: yupResolver(boardConfigSchema),
    mode: 'onChange',
  });

  const pipelineToolMethods = useForm<IPipelineToolData>({
    defaultValues: pipelineToolDefaultValues,
    resolver: yupResolver(pipelineToolSchema),
    mode: 'onChange',
  });

  const sourceControlMethods = useForm<ISourceControlData>({
    defaultValues: sourceControlDefaultValues,
    resolver: yupResolver(sourceControlSchema),
    mode: 'onChange',
  });
  return (
    <ConfigStep
      basicInfoMethods={basicInfoMethods}
      boardConfigMethods={boardConfigMethods}
      pipelineToolMethods={pipelineToolMethods}
      sourceControlMethods={sourceControlMethods}
    />
  );
};

describe('ConfigStep', () => {
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <ConfigStepWithFormInstances />
      </Provider>,
    );
  };

  beforeAll(() => server.listen());

  afterEach(() => {
    store = null;
    jest.clearAllMocks();
  });

  afterAll(() => server.close());

  it('should show project name when render configStep', () => {
    setup();

    expect(screen.getByText(PROJECT_NAME_LABEL)).toBeInTheDocument();
  });

  it('should show project name when input some letters', async () => {
    setup();

    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });
    await waitFor(() => {
      expect(input).toBeInTheDocument();
    });

    await userEvent.type(input, TEST_PROJECT_NAME);

    await waitFor(() => {
      expect(input).toHaveValue(TEST_PROJECT_NAME);
    });
  });

  it('should show error message when project name is Empty', async () => {
    setup();

    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });
    await userEvent.type(input, TEST_PROJECT_NAME);

    await waitFor(() => {
      expect(input).toHaveValue(TEST_PROJECT_NAME);
    });

    await userEvent.clear(input);

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  it('should show error message when click project name input with no letter', async () => {
    setup();
    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });

    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument();
    });
  });

  it('should select Regular calendar by default when rendering the radioGroup', () => {
    setup();

    const defaultValue = screen.getByRole('radio', { name: REGULAR_CALENDAR });
    const chinaCalendar = screen.getByRole('radio', { name: CHINA_CALENDAR });
    expect(defaultValue).toBeChecked();
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should switch the radio when any radioLabel is selected', async () => {
    setup();

    const chinaCalendar = screen.getByRole('radio', { name: CHINA_CALENDAR });
    const regularCalendar = screen.getByRole('radio', { name: REGULAR_CALENDAR });
    await userEvent.click(chinaCalendar);

    await waitFor(() => {
      expect(chinaCalendar).toBeChecked();
    });
    expect(regularCalendar).not.toBeChecked();

    await userEvent.click(regularCalendar);

    await waitFor(() => {
      expect(regularCalendar).toBeChecked();
    });
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should not show board component when init ConfigStep component ', async () => {
    setup();

    await waitFor(() => {
      expect(screen.queryByText(CONFIG_TITLE.BOARD)).toBeNull();
    });
  });

  it('should show board component when MetricsTypeCheckbox select Velocity,Cycle time', async () => {
    setup();

    await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const requireDateSelection = within(screen.getByRole('listbox'));
    await userEvent.click(requireDateSelection.getByRole('option', { name: /velocity/i }));
    await userEvent.click(requireDateSelection.getByRole('option', { name: /cycle time/i }));

    await waitFor(() => {
      expect(screen.getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
    });
  });

  it('should show board component when MetricsTypeCheckbox select  Classification, ', async () => {
    setup();

    await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const requireDateSelection = within(screen.getByRole('listbox'));
    await userEvent.click(requireDateSelection.getByRole('option', { name: 'Classification' }));

    await waitFor(() => {
      expect(screen.getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
    });
  });

  it('should show warning message when selectWarningMessage has a value', async () => {
    setup();

    expect(screen.getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message When selectWarningMessage has a value after two seconds', async () => {
    jest.useFakeTimers();
    setup();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test warning Message')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should no need verify again when date picker is changed given board fields are filled and verified', async () => {
    const today = dayjs().format('MM/DD/YYYY');
    setup();

    await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));
    const requireDateSelection = within(screen.getByRole('listbox'));
    await userEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    await closeMuiModal(userEvent);
    await fillBoardFieldsInformation();
    await userEvent.click(screen.getByText(VERIFY));
    const startDateInput = screen.getByLabelText('From *');
    await userEvent.type(startDateInput, today);

    await waitFor(() => {
      expect(screen.queryByText(VERIFY)).toBeNull();
    });
    expect(screen.queryByText(VERIFIED)).toBeVisible();
    expect(screen.queryByText(RESET)).toBeVisible();
  });

  it('should no need verify again when collection-date or date-picker is changed given pipeline token is filled and verified', async () => {
    const today = dayjs().format('MM/DD/YYYY');
    setup();

    const requiredMetricsField = screen.getByRole('combobox', { name: REQUIRED_DATA });
    await userEvent.click(requiredMetricsField);
    const requireDateSelection = within(screen.getByRole('listbox'));
    await userEvent.click(requireDateSelection.getByRole('option', { name: DEPLOYMENT_FREQUENCY }));
    await closeMuiModal(userEvent);
    const tokenNode = within(screen.getByTestId('pipelineToolTextField')).getByLabelText(
      PIPELINE_TOOL_TOKEN_INPUT_LABEL,
    );
    await userEvent.type(tokenNode, FAKE_PIPELINE_TOKEN);
    const submitButton = screen.getByText(VERIFY);
    await userEvent.click(submitButton);
    const startDateInput = screen.getByLabelText('From *');
    await userEvent.type(startDateInput, today);

    await waitFor(() => {
      expect(screen.queryByText(VERIFY)).toBeNull();
    });
    expect(screen.queryByText(VERIFIED)).toBeVisible();
    expect(screen.queryByText(RESET)).toBeVisible();
  });

  it('should show all forms given all metrics selected', async () => {
    setup();

    const requiredMetricsField = screen.getByRole('combobox', { name: REQUIRED_DATA });
    await userEvent.click(requiredMetricsField);
    const requireDateSelection = within(screen.getByRole('listbox'));
    await userEvent.click(requireDateSelection.getByRole('option', { name: ALL }));
    await closeMuiModal(userEvent);

    expect(screen.getByLabelText('Board Config')).toBeInTheDocument();
    expect(screen.getByLabelText('Pipeline Tool Config')).toBeInTheDocument();
    expect(screen.getByLabelText('Source Control Config')).toBeInTheDocument();
  });
});
