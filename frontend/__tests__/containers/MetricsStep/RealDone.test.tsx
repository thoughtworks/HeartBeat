import { saveCycleTimeSettings } from '@src/context/Metrics/metricsSlice';
import { act, render, waitFor, within } from '@testing-library/react';
import { RealDone } from '@src/containers/MetricsStep/RealDone';
import { ERROR_MESSAGE_TIME_DURATION } from '../../fixtures';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectRealDoneWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}));

const mockTitle = 'RealDone';
const mockLabel = 'Consider as Done';
let store = setupStore();

describe('RealDone', () => {
  describe('when done column with more than one statuses', () => {
    const mockColumnsList = [
      {
        key: 'done',
        value: {
          name: 'Done',
          statuses: ['DONE', 'CANCELLED'],
        },
      },
    ];
    const setup = () =>
      render(
        <Provider store={store}>
          <RealDone columns={mockColumnsList} label={mockLabel} title={mockTitle} />
        </Provider>,
      );

    beforeEach(() => {
      store = setupStore();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should show RealDone when render RealDone component', () => {
      const { getByText } = setup();

      expect(getByText(mockTitle)).toBeInTheDocument();
    });

    it('should show consider as done when initializing', () => {
      const { getByText } = setup();
      const label = getByText(mockLabel);
      const helperText = getByText('consider as Done');

      expect(label).toBeInTheDocument();
      expect(helperText.tagName).toBe('STRONG');
    });

    it('should show detail options when click Consider as Done button', async () => {
      const { getByRole } = setup();
      await act(async () => {
        await userEvent.click(getByRole('combobox', { name: mockLabel }));
      });

      const listBox = within(getByRole('listbox'));
      expect(listBox.getByRole('option', { name: 'All' })).toBeInTheDocument();
      expect(listBox.getByRole('option', { name: 'DONE' })).toBeInTheDocument();
      expect(listBox.getByRole('option', { name: 'CANCELLED' })).toBeInTheDocument();
    });

    it('should show other selections when cancel one option given default all selections in RealDone', async () => {
      const { getByRole, queryByRole } = setup();

      await act(async () => {
        await userEvent.click(getByRole('combobox', { name: mockLabel }));
      });

      const listBox = within(getByRole('listbox'));
      await act(async () => {
        await userEvent.click(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[0] }));
      });

      expect(queryByRole('button', { name: mockColumnsList[0].value.statuses[0] })).toBeInTheDocument();
      expect(queryByRole('button', { name: mockColumnsList[0].value.statuses[1] })).not.toBeInTheDocument();
    });

    it('should clear RealDone data when check all option', async () => {
      const { getByRole, queryByRole } = setup();

      await act(async () => {
        await userEvent.click(getByRole('combobox', { name: mockLabel }));
      });

      const listBox = within(getByRole('listbox'));
      const allOption = listBox.getByRole('option', { name: 'All' });
      await act(async () => {
        await userEvent.click(allOption);
      });

      expect(getByRole('button', { name: mockColumnsList[0].value.statuses[0] })).toBeInTheDocument();
      expect(getByRole('button', { name: mockColumnsList[0].value.statuses[1] })).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(allOption);
      });

      expect(queryByRole('button', { name: mockColumnsList[0].value.statuses[0] })).not.toBeInTheDocument();
      expect(queryByRole('button', { name: mockColumnsList[0].value.statuses[1] })).not.toBeInTheDocument();
    });

    it('should show doing when choose Testing column is Done', async () => {
      await store.dispatch(
        saveCycleTimeSettings([
          { column: 'Done', status: 'DONE', value: 'Done' },
          { column: 'Done', status: 'CANCELLED', value: 'Done' },
        ]),
      );
      const { getByRole } = setup();

      await act(async () => {
        await userEvent.click(getByRole('combobox', { name: mockLabel }));
      });
      const listBox = within(getByRole('listbox'));
      const allOption = listBox.getByRole('option', { name: 'All' });
      await act(async () => {
        await userEvent.click(allOption);
      });

      expect(getByRole('button', { name: 'DONE' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'CANCELLED' })).toBeInTheDocument();
    });

    it('should show warning message when realDone warning message has a value in realDone component', () => {
      const { getByText } = setup();

      expect(getByText('Test warning Message')).toBeInTheDocument();
    });

    it('should clear warning message when realDone warning message has a value after four seconds in realDone component', async () => {
      jest.useFakeTimers();
      const { queryByText } = setup();

      act(() => {
        jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
      });

      await waitFor(() => {
        expect(queryByText('Test warning Message')).not.toBeInTheDocument();
      });
    });
  });

  describe('when done column with only one status', () => {
    it('should not show read done box', async () => {
      const mockColumnsList = [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE'],
          },
        },
      ];

      const { queryByText } = render(
        <Provider store={store}>
          <RealDone columns={mockColumnsList} label={mockLabel} title={mockTitle} />
        </Provider>,
      );

      expect(queryByText(mockTitle)).not.toBeInTheDocument();
      expect(queryByText(mockLabel)).not.toBeInTheDocument();
    });
  });
});
