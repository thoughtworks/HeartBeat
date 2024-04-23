import {
  BRANCH,
  ERROR_MESSAGE_TIME_DURATION,
  LIST_OPEN,
  MOCK_SOURCE_CONTROL_VERIFY_BRANCH_URL,
  ORGANIZATION,
  PIPELINE_NAME,
  PIPELINE_SETTING_TYPES,
  REMOVE_BUTTON,
  STEP,
} from '@test/fixtures';
import { PipelineMetricSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection';
import { IPipelineConfig, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { metricsClient } from '@src/clients/MetricsClient';
import { setupStore } from '@test/utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(rest.post(MOCK_SOURCE_CONTROL_VERIFY_BRANCH_URL, (req, res, ctx) => res(ctx.status(204))));

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  deleteADeploymentFrequencySetting: jest.fn().mockReturnValue({ type: 'DELETE_DEPLOYMENT_FREQUENCY_SETTING' }),
  selectOrganizationWarningMessage: jest.fn().mockReturnValue('Test organization warning message'),
  selectPipelineNameWarningMessage: jest.fn().mockReturnValue('Test pipelineName warning message'),
  selectStepWarningMessage: jest.fn().mockReturnValue('Test step warning message'),
}));

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName', 'mockOrgName2']),
  selectPipelineNames: jest.fn().mockReturnValue(['mockName', 'mockName2']),
  selectSteps: jest.fn().mockReturnValue(['step1', 'step2']),
  selectBranches: jest.fn().mockReturnValue(['branch1', 'branch2']),
  selectStepsParams: jest.fn().mockReturnValue({
    buildId: '',
    organizationId: '',
    params: [
      {
        endTime: 1681747200000,
        orgName: '',
        pipelineName: '',
        repository: '',
        startTime: 1680537600000,
      },
    ],
    pipelineType: 'BuildKite',
    token: '',
  }),
  updatePipelineToolVerifyResponseSteps: jest
    .fn()
    .mockReturnValue({ type: 'UPDATE_PIPELINE_TOOL_VERIFY_RESPONSE_STEPS' }),
  selectPipelineList: jest.fn().mockReturnValue([
    {
      id: 'mockPipelineId',
      name: 'mockName',
      orgId: 'mockOrgId',
      orgName: 'mockOrgName',
      repository: 'git@github.com:au-heartbeat/Heartbeat.git',
      branches: ['branch1', 'branch2', 'branch3'],
    },
    {
      id: 'mockPipelineId2',
      name: 'mockName2',
      orgId: 'mockOrgId2',
      orgName: 'mockOrgName2',
      repository: 'git@github.com:au-heartbeat/Heartbeat.git',
      branches: ['branch1', 'branch2', 'branch3', 'branch4'],
    },
  ]),
}));

const store = setupStore();

describe('PipelineMetricSelection', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  const mockId = 0;
  const deploymentFrequencySetting = {
    id: 0,
    organization: '',
    pipelineName: '',
    step: '',
    branches: [],
  };
  const mockHandleClickRemoveButton = jest.fn();
  const mockUpdatePipeline = jest.fn();
  const mockSetLoadingCompletedNumber = jest.fn();

  const setup = async (
    deploymentFrequencySetting: IPipelineConfig,
    isShowRemoveButton: boolean,
    isDuplicated: boolean,
  ) => {
    store.dispatch(updateShouldGetPipelineConfig(true));
    return render(
      <Provider store={store}>
        <PipelineMetricSelection
          type={PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={isShowRemoveButton}
          onRemovePipeline={mockHandleClickRemoveButton}
          onUpdatePipeline={mockUpdatePipeline}
          isDuplicated={isDuplicated}
          isInfoLoading={false}
          totalPipelineNumber={2}
          setLoadingCompletedNumber={mockSetLoadingCompletedNumber}
        />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PipelineMetricSelection when isShowRemoveButton is true', async () => {
    await setup(deploymentFrequencySetting, true, false);

    expect(screen.getByText(REMOVE_BUTTON)).toBeInTheDocument();
    expect(screen.getByText(ORGANIZATION)).toBeInTheDocument();
  });

  it('should render PipelineMetricSelection when isShowRemoveButton is false', async () => {
    const { getByText, queryByText } = await setup(deploymentFrequencySetting, false, false);

    expect(queryByText(REMOVE_BUTTON)).not.toBeInTheDocument();
    expect(getByText(ORGANIZATION)).toBeInTheDocument();
  });

  it('should call deleteADeploymentFrequencySetting function when click remove this pipeline button', async () => {
    const { getByRole } = await setup(deploymentFrequencySetting, true, false);

    await act(async () => {
      await userEvent.click(getByRole('button', { name: REMOVE_BUTTON }));
    });

    expect(mockHandleClickRemoveButton).toHaveBeenCalledTimes(1);
    expect(mockHandleClickRemoveButton).toHaveBeenCalledWith(mockId);
  });

  it('should show pipelineName selection when select organization', async () => {
    const { getByText } = await setup({ ...deploymentFrequencySetting, organization: 'mockOrgName' }, false, false);

    expect(getByText(ORGANIZATION)).toBeInTheDocument();
    expect(getByText(PIPELINE_NAME)).toBeInTheDocument();
  });

  it('should show step selection when select organization and pipelineName', async () => {
    const { getByText } = await setup(
      { ...deploymentFrequencySetting, organization: 'mockOrgName', pipelineName: 'mockName' },
      false,
      false,
    );

    expect(getByText(ORGANIZATION)).toBeInTheDocument();
    expect(getByText(PIPELINE_NAME)).toBeInTheDocument();
    expect(getByText(BRANCH)).toBeInTheDocument();
    expect(getByText(STEP)).toBeInTheDocument();
  });

  it('should show error message pop when getSteps failed', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => {
      return Promise.reject('error');
    });
    const { getByText, getByRole, getAllByRole } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '', branches: [] },
      false,
      false,
    );
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });

    const listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('mockName2'));
    });

    await waitFor(() => {
      expect(getByText('Failed to get BuildKite steps')).toBeInTheDocument();
    });
    expect(mockUpdatePipeline).toHaveBeenCalledTimes(3);
  });
  it('should show no steps warning message when getSteps succeed but get no steps', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: [], haveStep: false, pipelineCrews: [], branches: [] });
    const { getByText, getByRole, getAllByRole } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '', branches: [] },
      false,
      false,
    );
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });

    const listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('mockName2'));
    });

    await waitFor(() => {
      expect(
        getByText(
          'There is no step during these periods for this pipeline! Please change the search time in the Config page!',
        ),
      ).toBeInTheDocument();

      expect(getByText('No steps for this pipeline!')).toBeInTheDocument();
    });
  });

  it('should show no steps warning message when getSteps succeed but get no steps and isShowRemoveButton is true', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: [], haveStep: false, pipelineCrews: [], branches: [] });
    const { getByRole, getAllByRole } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '', branches: [] },
      true,
      false,
    );
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });

    const listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('mockName2'));
    });

    await waitFor(() => {
      expect(mockHandleClickRemoveButton).toHaveBeenCalledTimes(2);
    });
  });

  it('should show steps selection when getSteps succeed ', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: ['steps'], haveStep: true, pipelineCrews: [], branches: [] });
    const { getByRole, getByText, getAllByRole } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '', branches: [] },
      false,
      false,
    );

    await waitFor(() => {
      expect(getByText(STEP)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[2]);
    });

    const stepsListBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox.getByText('step2'));
    });

    expect(mockUpdatePipeline).toHaveBeenCalledTimes(1);
  });

  it('should show branches selection when getSteps succeed ', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: ['steps'], haveStep: true, branches: ['branch1', 'branch2'], pipelineCrews: [] });
    const { getByRole, getByText } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '', branches: ['branch1', 'branch2'] },
      false,
      false,
    );

    await waitFor(() => {
      expect(getByText(BRANCH)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: 'Branches' }));
    });

    expect(getByRole('button', { name: 'branch1' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'branch2' })).toBeInTheDocument();
  });

  it('should show not show branches when deployment setting has branches given branches does not match pipeline ', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: ['steps'], haveStep: true, branches: ['branch1', 'branch2'], pipelineCrews: [] });
    const { getByRole, queryByRole, getByText } = await setup(
      { id: 0, organization: 'mockOrgName3', pipelineName: 'mockName3', step: '', branches: ['branch6', 'branch7'] },
      false,
      false,
    );

    await waitFor(() => {
      expect(getByText(BRANCH)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: 'Branches' }));
    });

    expect(queryByRole('button', { name: 'branch6' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'branch7' })).not.toBeInTheDocument();
  });

  it('should show duplicated message given duplicated id', async () => {
    metricsClient.getSteps = jest
      .fn()
      .mockReturnValue({ response: ['steps'], haveStep: true, pipelineCrews: [], branches: [] });
    const { getByText } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: 'step1', branches: [] },
      false,
      true,
    );

    expect(getByText('This pipeline is the same as another one!')).toBeInTheDocument();
  });

  it('should show warning message when organization and pipelineName warning messages have value', async () => {
    const { getByText } = await setup(deploymentFrequencySetting, false, false);

    expect(getByText('Test organization warning message')).toBeInTheDocument();
    expect(getByText('Test pipelineName warning message')).toBeInTheDocument();
    expect(getByText('Test step warning message')).toBeInTheDocument();
  });

  it('should clear warning message when organization and pipelineName warning messages have value after four seconds', async () => {
    jest.useFakeTimers();
    const { queryByText } = await setup(deploymentFrequencySetting, false, false);

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(queryByText('Test organization warning message')).not.toBeInTheDocument();
      expect(queryByText('Test pipelineName warning message')).not.toBeInTheDocument();
      expect(queryByText('Test step warning message')).not.toBeInTheDocument();
    });
  });
});
