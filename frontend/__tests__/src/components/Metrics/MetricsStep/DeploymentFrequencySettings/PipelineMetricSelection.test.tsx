import { render } from '@testing-library/react'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { deleteADeploymentFrequencySetting } from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection', () => ({
  SingleSelection: () => <div>mock SingleSelection</div>,
}))

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}))

jest.mock('@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice', () => ({
  deleteADeploymentFrequencySetting: jest.fn(),
}))

const mockIndex = 0

const deploymentFrequencySetting = {
  organization: 'mock organization',
  pipelineName: 'mock pipelineName',
  steps: 'mock steps',
}

const setUp = async (mockIndex: number, isShowRemoveButton: boolean) => {
  return render(
    <Provider store={store}>
      <PipelineMetricSelection
        deploymentFrequencySetting={deploymentFrequencySetting}
        index={mockIndex}
        isShowRemoveButton={isShowRemoveButton}
      />
    </Provider>
  )
}

describe('PipelineMetricSelection', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is true', async () => {
    const { getAllByText, getByText } = await setUp(mockIndex, true)
    expect(getByText('Remove this pipeline')).toBeInTheDocument()
    expect(getAllByText('mock SingleSelection').length).toEqual(3)
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is false', async () => {
    const { getAllByText, queryByText } = await setUp(mockIndex, false)
    expect(queryByText('Remove this pipeline')).not.toBeInTheDocument()
    expect(getAllByText('mock SingleSelection').length).toEqual(3)
  })

  it('should call deleteADeploymentFrequencySetting function when click remove this pipeline button', async () => {
    const { getByRole } = await setUp(mockIndex, true)

    await userEvent.click(getByRole('button', { name: 'Remove this pipeline' }))

    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledWith(mockIndex)
  })
})
