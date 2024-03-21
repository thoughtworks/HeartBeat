import {
  ALL,
  LIST_OPEN,
  REWORK_EXCLUDE_WHICH_STATE,
  REWORK_SETTINGS_TITLE,
  REWORK_TO_WHICH_STATE,
} from '../../fixtures';
import { METRICS_CONSTANTS, REWORK_TIME_LIST } from '@src/constants/resources';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { updateCycleTimeSettings } from '@src/context/Metrics/metricsSlice';
import ReworkSettings from '@src/containers/MetricsStep/ReworkSettings';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

const mockedUseAppDispatch = jest.fn();
jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}));

const store = setupStore();
const mockCycleTimeSettings1 = [
  {
    column: 'TODO',
    status: 'TODO',
    value: 'To do',
  },
  {
    column: 'Doing',
    status: 'DOING',
    value: 'In Dev',
  },
  {
    column: 'Blocked',
    status: 'BLOCKED',
    value: 'Block',
  },
  {
    column: 'Done',
    status: 'DONE',
    value: 'Done',
  },
];
const mockCycleTimeSettings2 = mockCycleTimeSettings1.filter((item) => item.value !== 'Done');

describe('reworkSetting', () => {
  const setup = () =>
    render(
      <Provider store={store}>
        <ReworkSettings />
      </Provider>,
    );

  beforeEach(() => {
    store.dispatch(updateCycleTimeSettings(mockCycleTimeSettings1));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show initial content', () => {
    setup();

    expect(screen.getByText(REWORK_SETTINGS_TITLE)).toBeInTheDocument();
    expect(screen.getByText(REWORK_TO_WHICH_STATE)).toBeInTheDocument();
    expect(screen.getByText(REWORK_EXCLUDE_WHICH_STATE)).toBeInTheDocument();
  });

  it('should get correct rework setting when pick option', async () => {
    const { getByRole, getAllByRole } = setup();
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });
    const stepsListBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox.getByText(METRICS_CONSTANTS.todoValue));
    });
    await waitFor(() => {
      expect(
        (screen.getByTestId('rework-single-selection-rework-to-which-state').querySelector('input') as HTMLInputElement)
          .value,
      ).toBe(METRICS_CONSTANTS.todoValue);
    });
  });

  it('should show dialog when click how to setup', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByTestId('HelpOutlineOutlinedIcon'));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeVisible();
    });
  });

  it('should hidden dialog when handle hiddenReworkDialog', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByTestId('HelpOutlineOutlinedIcon'));
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId('CloseIcon'));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should get correct value when pick all or other value', async () => {
    const { getByRole, getAllByRole, queryByRole } = setup();
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });
    const stepsListBox1 = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox1.getByText(METRICS_CONSTANTS.todoValue));
    });
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });
    const stepsListBox2 = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(ALL));
    });
    await waitFor(async () => {
      [...new Set(mockCycleTimeSettings1.map((item) => item.value))].slice(1).forEach((value) => {
        expect(getByRole('button', { name: value })).toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(ALL));
    });
    await waitFor(() => {
      [...new Set(mockCycleTimeSettings1.map((item) => item.value))].slice(1).forEach((value) => {
        expect(queryByRole('button', { name: value })).not.toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(REWORK_TIME_LIST[3]));
    });
    await waitFor(async () => {
      expect(getByRole('button', { name: REWORK_TIME_LIST[3] })).toBeInTheDocument();
    });
  });

  it('should get correct value when board mappings have not done value', async () => {
    store.dispatch(updateCycleTimeSettings(mockCycleTimeSettings2));
    const { getByRole, getAllByRole } = setup();
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });
    const stepsListBox1 = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox1.getByText(METRICS_CONSTANTS.todoValue));
    });
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });
    const stepsListBox2 = within(getByRole('listbox'));

    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(ALL));
    });
    await waitFor(async () => {
      [...new Set(mockCycleTimeSettings2.map((item) => item.value))].slice(1).forEach((value) => {
        expect(getByRole('button', { name: value })).toBeInTheDocument();
      });
    });
  });
});
