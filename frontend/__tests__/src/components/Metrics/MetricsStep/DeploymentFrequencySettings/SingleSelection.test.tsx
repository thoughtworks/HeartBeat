import { render } from '@testing-library/react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../../utils/setupStoreUtil'

const mockValidationCheckContext = {
  checkDuplicatedPipeLine: jest.fn(),
  checkPipelineValidation: jest.fn(),
}

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}))
describe('SingleSelection', () => {
  const mockOptions = ['mockOptions 1', 'mockOptions 2', 'mockOptions 3']
  const mockLabel = 'mockLabel'
  const mockValue = 'mockOptions 1'
  const mockOnGetSteps = jest.fn()
  const mockUpdatePipeline = jest.fn()

  let store = setupStore()

  beforeEach(() => {
    store = setupStore()
  })

  const setup = () =>
    render(
      <Provider store={store}>
        <SingleSelection
          options={mockOptions}
          label={mockLabel}
          value={mockValue}
          id={0}
          onGetSteps={mockOnGetSteps}
          onUpDatePipeline={mockUpdatePipeline}
        />
      </Provider>
    )

  it('should render SingleSelection', () => {
    const { getByText } = setup()

    expect(getByText(mockLabel)).toBeInTheDocument()
    expect(getByText(mockValue)).toBeInTheDocument()
  })

  it('should render SingleSelection given error message', () => {
    const { getByText } = setup()

    expect(getByText(mockLabel)).toBeInTheDocument()
    expect(getByText(mockValue)).toBeInTheDocument()
  })

  it('should call update option function and OnGetSteps function when change option given mockValue as default', async () => {
    const { getByText, getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText(mockOptions[1]))

    expect(mockOnGetSteps).toHaveBeenCalledTimes(1)
    expect(mockUpdatePipeline).toHaveBeenCalledTimes(2)
  })
})
