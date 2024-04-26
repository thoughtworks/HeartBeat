import { render, waitFor } from '@testing-library/react';
import { setupStore } from '@test/utils/setupStoreUtil';
import { Provider } from 'react-redux';

import { PipelineMetricSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection';
import { IPipelineConfig, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { addNotification } from '@src/context/notification/NotificationSlice';
import { METRICS_DATA_FAIL_STATUS } from '@src/constants/commons';
import { PIPELINE_SETTING_TYPES } from '@test/fixtures';

const store = setupStore();
let stepFailStatus = METRICS_DATA_FAIL_STATUS.NOT_FAILED;

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  addNotification: jest.fn().mockReturnValue({ type: 'ADD_NEW_NOTIFICATION' }),
}));

jest.mock('@src/hooks/useGetMetricsStepsEffect', () => ({
  ...jest.requireActual('@src/hooks/useGetMetricsStepsEffect'),

  useGetMetricsStepsEffect: jest.fn().mockImplementation(() => {
    return {
      stepFailedStatus: stepFailStatus,
    };
  }),
}));

describe('PipelineMetricSelection', () => {
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

  it('should show 4xx popup when call pipeline step to get partial 4xx error', async () => {
    stepFailStatus = METRICS_DATA_FAIL_STATUS.PARTIAL_FAILED_4XX;
    await setup(deploymentFrequencySetting, true, false);

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalled();
    });
  });

  it('should show timeout popup when call pipeline step to get partial timeout error', async () => {
    stepFailStatus = METRICS_DATA_FAIL_STATUS.PARTIAL_FAILED_TIMEOUT;
    await setup(deploymentFrequencySetting, true, false);

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalled();
    });
  });
});
