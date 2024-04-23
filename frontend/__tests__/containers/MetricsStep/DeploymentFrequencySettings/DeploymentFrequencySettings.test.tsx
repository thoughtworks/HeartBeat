import {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  updateDeploymentFrequencySettings,
} from '@src/context/Metrics/metricsSlice';
import { DEPLOYMENT_FREQUENCY_SETTINGS, LIST_OPEN, LOADING, ORGANIZATION, REMOVE_BUTTON } from '@test/fixtures';
import { DeploymentFrequencySettings } from '@src/containers/MetricsStep/DeploymentFrequencySettings';
import { IUseVerifyPipeLineToolStateInterface } from '@src/hooks/useGetPipelineToolInfoEffect';
import { TokenAccessAlert } from '@src/containers/MetricsStep/TokenAccessAlert';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { setupStore } from '@test/utils/setupStoreUtil';

let mockSelectShouldGetPipelineConfig = true;
let mockSelectPipelineNames: string[] = [];
const mockSelectStepsParams = {
  organizationId: 0,
  pipelineType: '',
  token: '',
  params: [
    {
      pipelineName: mockSelectPipelineNames,
      repository: '',
      orgName: '',
      startTime: '2024-02-01T00:00:00.000+08:00',
      endTime: '2024-02-15T23:59:59.999+08:00',
    },
  ],
};

jest.mock('@src/hooks', () => ({
  ...jest.requireActual('@src/hooks'),
  useAppDispatch: () => jest.fn(),
}));

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  addADeploymentFrequencySetting: jest.fn(),
  deleteADeploymentFrequencySetting: jest.fn(),
  updateDeploymentFrequencySettings: jest.fn(),
  selectDeploymentFrequencySettings: jest.fn().mockReturnValue([
    { id: 0, organization: 'mockOrgName', pipelineName: '1', steps: '', branches: [] },
    { id: 1, organization: '', pipelineName: '', steps: '', branches: [] },
  ]),
  selectOrganizationWarningMessage: jest.fn().mockReturnValue(null),
  selectPipelineNameWarningMessage: jest.fn().mockReturnValue(null),
  selectStepWarningMessage: jest.fn().mockReturnValue(null),
  selectMetricsContent: jest.fn().mockReturnValue({ pipelineCrews: [], users: [] }),
  selectShouldGetPipelineConfig: jest.fn().mockImplementation(() => mockSelectShouldGetPipelineConfig),
}));

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName', 'mockOrgName2']),
  selectPipelineNames: jest.fn().mockImplementation(() => mockSelectPipelineNames),
  selectSteps: jest.fn().mockReturnValue(['']),
  selectBranches: jest.fn().mockReturnValue(['']),
  selectPipelineCrews: jest.fn().mockReturnValue(['']),
  selectStepsParams: jest.fn().mockImplementation(() => mockSelectStepsParams),
  selectDateRange: jest.fn().mockReturnValue(['']),
}));

const mockValidationCheckContext = {
  getDuplicatedPipeLineIds: jest.fn().mockReturnValue([]),
};

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}));

const mockGetPipelineToolInfoOkResponse = {
  isFirstFetch: false,
  isLoading: false,
  apiCallFunc: jest.fn(),
  result: {
    code: 200,
    data: {
      pipelineList: [
        {
          id: 'heartbeat',
          name: 'Heartbeat',
          orgId: 'thoughtworks-Heartbeat',
          orgName: 'Thoughtworks-Heartbeat',
          repository: 'git@github.com:au-heartbeat/Heartbeat.git',
          steps: [':pipeline: Upload pipeline.yml'],
          branches: [],
          crews: [],
        },
      ],
    },
    errorTitle: '',
    errorMessage: '',
  },
};
let mockGetPipelineToolInfoSpy: IUseVerifyPipeLineToolStateInterface = mockGetPipelineToolInfoOkResponse;

jest.mock('@src/hooks/useGetPipelineToolInfoEffect', () => ({
  useGetPipelineToolInfoEffect: () => mockGetPipelineToolInfoSpy,
}));
describe('DeploymentFrequencySettings', () => {
  let store = null;
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <DeploymentFrequencySettings />
      </Provider>,
    );
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    mockSelectShouldGetPipelineConfig = true;
    mockSelectPipelineNames = [];
    mockGetPipelineToolInfoSpy = mockGetPipelineToolInfoOkResponse;
  });

  it('should show crew settings when select pipelineName', async () => {
    mockSelectPipelineNames = ['Heartbeat'];
    const { getAllByRole, getByRole } = await setup();
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });

    let listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('mockOrgName'));
    });
    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[1]);
    });
    listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('Heartbeat'));
    });
    waitFor(() => {
      expect(screen.getByText('Crew setting (optional)')).toBeInTheDocument();
    });
  });

  it('should render DeploymentFrequencySettings component', () => {
    const { getByText, getAllByText } = setup();

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument();
    expect(getAllByText(ORGANIZATION).length).toBe(2);
  });

  it('should call addADeploymentFrequencySetting function when click add another pipeline button', async () => {
    const { getByTestId } = await setup();

    await userEvent.click(getByTestId('AddIcon'));

    expect(addADeploymentFrequencySetting).toHaveBeenCalledTimes(1);
  });

  it('should call deleteADeploymentFrequencySetting function when click remove pipeline button', async () => {
    const { getAllByRole } = await setup();

    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: REMOVE_BUTTON })[0]);
    });
    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1);
  });

  it('should call updateDeploymentFrequencySetting function and clearErrorMessages function when select organization', async () => {
    const { getAllByRole, getByRole } = setup();

    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });
    const listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByText('mockOrgName2'));
    });

    expect(updateDeploymentFrequencySettings).toHaveBeenCalledTimes(1);
  });

  it('show render crews component when all pipelines load completed', () => {
    mockSelectShouldGetPipelineConfig = false;
    setup();
    expect(screen.getByText('Crew setting (optional)')).toBeInTheDocument();
  });

  it('should display error UI when get pipeline info client returns non-200 code', () => {
    mockGetPipelineToolInfoSpy = {
      isFirstFetch: false,
      isLoading: false,
      apiCallFunc: jest.fn(),
      result: {
        code: 403,
        errorTitle: 'Forbidden request!',
        errorMessage: 'Forbidden request!',
      },
    };
    setup();

    expect(screen.getByLabelText('Error UI for pipeline settings')).toBeInTheDocument();
  });

  it('should show loading when get pipeline info client pending', () => {
    mockGetPipelineToolInfoSpy = {
      isFirstFetch: false,
      isLoading: true,
      apiCallFunc: jest.fn(),
      result: {
        code: null,
        errorTitle: '',
        errorMessage: '',
      },
    };
    setup();

    expect(screen.getByTestId(LOADING)).toBeInTheDocument();
  });

  it('should not show crews part when pipeline is loading', async () => {
    mockGetPipelineToolInfoSpy = {
      ...mockGetPipelineToolInfoOkResponse,
      isFirstFetch: true,
    };
    setup();
    expect(screen.queryByText('Crews Setting')).toBeNull();
  });

  it('renders without error when errorDetail is provided', () => {
    const { queryByLabelText } = render(<TokenAccessAlert errorDetail={401} />);
    expect(queryByLabelText('alert for token access error')).toBeInTheDocument();
  });

  it('renders null when errorDetail is not provided', () => {
    const { queryByLabelText } = render(<TokenAccessAlert />);
    expect(queryByLabelText('alert for token access error')).not.toBeInTheDocument();
  });

  it('renders null when errorDetail is 404', () => {
    const { queryByLabelText } = render(<TokenAccessAlert errorDetail={404} />);
    expect(queryByLabelText('alert for token access error')).not.toBeInTheDocument();
  });
});
