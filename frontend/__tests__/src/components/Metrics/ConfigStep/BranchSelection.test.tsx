import { act, render } from '@testing-library/react';
import { BranchSelection } from '@src/components/Metrics/ConfigStep/BranchSelection';
import { ALL, BRANCH, MOCK_AUTOCOMPLETE_LIST } from '../../../fixtures';
import { setupStore } from '../../../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

describe('BranchSelection', () => {
  let store = null;
  const onUpdatePipeline = jest.fn();
  const setup = () => {
    store = setupStore();

    const pipelineSetting = {
      id: 2,
      organization: 'Test',
      pipelineName: 'Test',
      step: 1,
      branches: MOCK_AUTOCOMPLETE_LIST,
    };
    return render(
      <Provider store={store}>
        <BranchSelection {...pipelineSetting} onUpdatePipeline={onUpdatePipeline} />
      </Provider>
    );
  };

  it('should show Branches when render BranchSelection component', () => {
    const { getByText } = setup();

    expect(getByText('Branches')).toBeInTheDocument();
  });

  it('should has Option 2 when render BranchSelection component', async () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'Option 2' })).toBeVisible();
  });

  it('should show branches selection when getSteps succeed ', async () => {
    const { getByRole, getByText } = setup();

    expect(getByText(BRANCH)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: 'Branches' }));
    });

    const allOption = getByRole('option', { name: ALL });
    await act(async () => {
      await userEvent.click(allOption);
    });

    const optionOne = getByRole('button', { name: 'Option 1' });

    expect(optionOne).toBeVisible();

    await act(async () => {
      await userEvent.click(optionOne);
    });

    expect(onUpdatePipeline).toHaveBeenCalledTimes(1);
  });
});
