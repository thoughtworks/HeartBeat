import { act, render, within } from '@testing-library/react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../../utils/setupStoreUtil'
import { LIST_OPEN } from '../../../../fixtures'

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

  it('should show selectors title when render SingleSelection', () => {
    const { getByText } = setup()

    expect(getByText(mockLabel)).toBeInTheDocument()
  })

  it('should show detail options when click the dropdown button', async () => {
    const { getAllByRole, getByRole } = setup()
    const buttonElements = getAllByRole('button', { name: LIST_OPEN })
    await act(async () => {
      await userEvent.click(buttonElements[0])
    })

    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionText = options.map((option) => option.textContent)

    expect(optionText).toEqual(mockOptions)
  })

  it('should show the right options when search the keyword', async () => {
    const { getAllByRole, getByRole } = setup()
    const buttonElements = getAllByRole('button', { name: LIST_OPEN })

    await act(async () => {
      await userEvent.type(buttonElements[0], '1')
    })

    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionTexts = options.map((option) => option.textContent)

    const expectedOptions = ['mockOptions 1']

    expect(optionTexts).toEqual(expectedOptions)
  })

  it('should show no options when search the wrong keyword', async () => {
    const { getAllByRole, getByText } = setup()
    const buttonElements = getAllByRole('button', { name: LIST_OPEN })

    await act(async () => {
      await userEvent.type(buttonElements[0], 'xxx')
    })

    expect(getByText('No options')).toBeInTheDocument()
  })

  it('should call update option function and OnGetSteps function when change option given mockValue as default', async () => {
    const { getByText, getByRole } = setup()
    await act(async () => {
      await userEvent.click(getByRole('button', { name: LIST_OPEN }))
    })

    await act(async () => {
      await userEvent.click(getByText(mockOptions[1]))
    })

    expect(mockOnGetSteps).toHaveBeenCalledTimes(1)
    expect(mockUpdatePipeline).toHaveBeenCalledTimes(2)
  })
})
