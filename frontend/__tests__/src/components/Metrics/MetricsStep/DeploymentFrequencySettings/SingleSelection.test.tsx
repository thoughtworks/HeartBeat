import { render } from '@testing-library/react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../../utils/setupStoreUtil'

const mockValidationCheckContext = {
  errorMessages: [],
  clearErrorMessage: jest.fn(),
  checkDuplicatedPipeLine: jest.fn(),
  checkPipelineValidation: jest.fn(),
}

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))

describe('SingleSelection', () => {
  const mockOptions = ['mockOptions 1', 'mockOptions 2', 'mockOptions 3']
  const mockLabel = 'mockLabel'
  const mockValue = 'mockOptions 1'
  const mockError = 'error message'
  const mockOnGetSteps = jest.fn()

  let store = setupStore()

  beforeEach(() => {
    store = setupStore()
  })

  const setup = (errorMessage: string) =>
    render(
      <Provider store={store}>
        <SingleSelection
          options={mockOptions}
          label={mockLabel}
          value={mockValue}
          id={0}
          errorMessage={errorMessage}
          onGetSteps={mockOnGetSteps}
        />
      </Provider>
    )

  it('should render SingleSelection', () => {
    const { getByText, queryByText } = setup('')

    expect(getByText(mockLabel)).toBeInTheDocument()
    expect(getByText(mockValue)).toBeInTheDocument()
    expect(queryByText(mockError)).not.toBeInTheDocument()
  })

  it('should render SingleSelection given error message', () => {
    const { getByText } = setup(mockError)

    expect(getByText(mockLabel)).toBeInTheDocument()
    expect(getByText(mockValue)).toBeInTheDocument()
    expect(getByText(mockError)).toBeInTheDocument()
  })

  it('should call update option function and OnGetSteps function when change option given mockValue as default', async () => {
    const { getByText, getByRole } = setup(mockError)

    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText(mockOptions[1]))

    expect(getByText(mockOptions[1])).toBeInTheDocument()
    expect(mockValidationCheckContext.clearErrorMessage).toHaveBeenCalledTimes(1)
    expect(mockOnGetSteps).toHaveBeenCalledTimes(1)
  })
})
