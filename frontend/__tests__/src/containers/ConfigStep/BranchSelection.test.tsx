import { BranchSelection } from '@src/containers/ConfigStep/BranchSelection';
import { ALL, BRANCH, MOCK_AUTOCOMPLETE_LIST } from '../../fixtures';
import { act, render, screen } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

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
      </Provider>,
    );
  };

  it('should show Branches when render BranchSelection component', () => {
    const { getByText } = setup();

    expect(getByText('Branches')).toBeInTheDocument();
  });

  it('should has Option 2 when render BranchSelection component', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'Option 2' })).toBeVisible();
  });

  it('should show branches selection when getSteps succeed ', async () => {
    setup();

    expect(screen.getByText(BRANCH)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: 'Branches' }));
    });

    const allOption = screen.getByRole('option', { name: ALL });
    await act(async () => {
      await userEvent.click(allOption);
    });

    const optionOne = screen.getByRole('button', { name: 'Option 1' });

    expect(optionOne).toBeVisible();

    await act(async () => {
      await userEvent.click(optionOne);
    });

    expect(onUpdatePipeline).toHaveBeenCalledTimes(1);
  });
});
