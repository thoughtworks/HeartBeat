import { render, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  updateDeploymentFrequencySettings,
} from '@src/context/Metrics/metricsSlice'
import { DEPLOYMENT_FREQUENCY_SETTINGS, REMOVE_BUTTON, ORGANIZATION } from '../../../../fixtures'

jest.mock('@src/hooks', () => ({
  ...jest.requireActual('@src/hooks'),
  useAppDispatch: () => jest.fn(),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  addADeploymentFrequencySetting: jest.fn(),
  deleteADeploymentFrequencySetting: jest.fn(),
  updateDeploymentFrequencySettings: jest.fn(),
  selectDeploymentFrequencySettings: jest.fn().mockReturnValue([
    { id: 0, organization: '', pipelineName: '', steps: '' },
    { id: 1, organization: '', pipelineName: '', steps: '' },
  ]),
}))

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName']),
  selectPipelineNames: jest.fn().mockReturnValue(['']),
  selectSteps: jest.fn().mockReturnValue(['']),
}))

const mockValidationCheckContext = {
  deploymentFrequencySettingsErrorMessages: [
    {
      id: 0,
      error: {
        organization: 'organization is required',
        pipelineName: 'pipelineName is required',
        steps: 'steps is required',
      },
    },
    {
      id: 1,
      error: {
        organization: 'organization is required',
        pipelineName: 'pipelineName is required',
        steps: 'steps is required',
      },
    },
  ],
  leadTimeForChangesErrorMessages: [],
  clearErrorMessage: jest.fn(),
  checkDuplicatedPipeline: jest.fn(),
  isPipelineValid: jest.fn().mockReturnValue(true),
}

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))

const setup = () =>
  render(
    <Provider store={store}>
      <DeploymentFrequencySettings />
    </Provider>
  )

describe('DeploymentFrequencySettings', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render DeploymentFrequencySettings component', () => {
    const { getByText, getAllByText } = setup()

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument()
    expect(getAllByText(ORGANIZATION).length).toBe(2)
    expect(getAllByText('organization is required').length).toBe(2)
  })

  it('should call addADeploymentFrequencySetting function when click add another pipeline button', async () => {
    const { getByTestId } = await setup()

    await userEvent.click(getByTestId('AddIcon'))

    expect(addADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })

  it('should call deleteADeploymentFrequencySetting function when click remove pipeline button', async () => {
    const { getAllByRole } = await setup()

    await userEvent.click(getAllByRole('button', { name: REMOVE_BUTTON })[0])

    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })

  it('should call updateDeploymentFrequencySetting function and clearErrorMessages function when select organization', async () => {
    const { getAllByRole, getByRole } = setup()

    await userEvent.click(getAllByRole('button', { name: ORGANIZATION })[0])
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByText('mockOrgName'))

    expect(updateDeploymentFrequencySettings).toHaveBeenCalledTimes(1)
    expect(mockValidationCheckContext.clearErrorMessage).toHaveBeenCalledTimes(1)
  })
})
