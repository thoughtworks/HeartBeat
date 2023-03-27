import { render } from '@testing-library/react'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'

jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection', () => ({
  SingleSelection: () => <div>mock SingleSelection</div>,
}))

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  deleteADeploymentFrequencySetting: jest.fn(),
}))

describe('PipelineMetricSelection', () => {
  const REMOVE_BUTTON = 'Remove'
  const mockIndex = 0
  const deploymentFrequencySetting = {
    id: 0,
    organization: 'mock organization',
    pipelineName: 'mock pipelineName',
    steps: 'mock steps',
  }

  const setup = (mockIndex: number, isShowRemoveButton: boolean) =>
    render(
      <Provider store={store}>
        <PipelineMetricSelection
          deploymentFrequencySetting={deploymentFrequencySetting}
          isShowRemoveButton={isShowRemoveButton}
          errorMessages={{ organization: '', pipelineName: '', steps: '' }}
        />
      </Provider>
    )

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is true', async () => {
    const { getAllByText, getByText } = await setup(mockIndex, true)

    expect(getByText(REMOVE_BUTTON)).toBeInTheDocument()
    expect(getAllByText('mock SingleSelection').length).toEqual(3)
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is false', async () => {
    const { getAllByText, queryByText } = await setup(mockIndex, false)

    expect(queryByText('Remove this pipeline')).not.toBeInTheDocument()
    expect(getAllByText('mock SingleSelection').length).toEqual(3)
  })

  it('should call deleteADeploymentFrequencySetting function when click remove this pipeline button', async () => {
    const { getByRole } = await setup(mockIndex, true)

    await userEvent.click(getByRole('button', { name: REMOVE_BUTTON }))

    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledWith(mockIndex)
  })
})
