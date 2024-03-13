import {
  ALL,
  LIST_OPEN,
  REWORK_EXCLUDE_WHICH_STATE,
  REWORK_SETTINGS_TITLE,
  REWORK_TO_WHICH_STATE,
} from '../../fixtures';
import { METRICS_CONSTANTS, REWORK_TIME_LIST } from '@src/constants/resources';
import { act, render, screen, waitFor, within } from '@testing-library/react';
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

describe('reworkSetting', () => {
  const setup = () =>
    render(
      <Provider store={store}>
        <ReworkSettings />
      </Provider>,
    );
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
      REWORK_TIME_LIST.slice(1).forEach((value) => {
        expect(getByRole('button', { name: value })).toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(ALL));
    });
    await waitFor(() => {
      REWORK_TIME_LIST.forEach((value) => {
        expect(queryByRole('button', { name: value })).not.toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox2.getByText(REWORK_TIME_LIST[1]));
    });
    await waitFor(async () => {
      expect(getByRole('button', { name: REWORK_TIME_LIST[1] })).toBeInTheDocument();
    });
  });
});
