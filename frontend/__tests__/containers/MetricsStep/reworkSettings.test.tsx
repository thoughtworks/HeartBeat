import {
  ALL,
  LIST_OPEN,
  REWORK_EXCLUDE_WHICH_STATE,
  REWORK_SETTINGS_TITLE,
  REWORK_TO_WHICH_STATE,
} from '../../fixtures';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import ReworkSettings from '@src/containers/MetricsStep/ReworkSettings';
import { CYCLE_TIME_LIST } from '@src/constants/resources';
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
      await userEvent.click(stepsListBox.getByText('----'));
    });
    await waitFor(async () => {
      await expect(
        (screen.getByTestId('rework-single-selection-rework-to-which-state').querySelector('input') as HTMLInputElement)
          .value,
      ).toBe('----');
    });
  });

  it('should get correct value when pick all or other value', async () => {
    const { getByRole, getAllByRole, queryByRole } = setup();
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });
    const stepsListBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox.getByText(ALL));
    });
    await waitFor(async () => {
      CYCLE_TIME_LIST.forEach((value) => {
        expect(getByRole('button', { name: value })).toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox.getByText(ALL));
    });
    await waitFor(() => {
      CYCLE_TIME_LIST.forEach((value) => {
        expect(queryByRole('button', { name: value })).not.toBeInTheDocument();
      });
    });

    await act(async () => {
      await userEvent.click(stepsListBox.getByText(CYCLE_TIME_LIST[0]));
    });
    await waitFor(async () => {
      expect(getByRole('button', { name: CYCLE_TIME_LIST[0] })).toBeInTheDocument();
    });
  });
});
