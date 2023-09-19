import { render, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { LeadTimeForChanges } from '@src/components/Metrics/MetricsStep/LeadTimeForChanges'
import {
  addALeadTimeForChanges,
  deleteALeadTimeForChange,
  updateLeadTimeForChanges,
} from '@src/context/Metrics/metricsSlice'
import userEvent from '@testing-library/user-event'
import { LEAD_TIME_FOR_CHANGES, ORGANIZATION, REMOVE_BUTTON } from '../../../fixtures'

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn().mockReturnValue([
    { id: 0, organization: '', pipelineName: '', steps: '', branches: [] },
    { id: 1, organization: '', pipelineName: '', steps: '', branches: [] },
  ]),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  addALeadTimeForChanges: jest.fn(),
  deleteALeadTimeForChange: jest.fn(),
  updateLeadTimeForChanges: jest.fn(),
  selectOrganizationWarningMessage: jest.fn().mockReturnValue(null),
  selectPipelineNameWarningMessage: jest.fn().mockReturnValue(null),
  selectStepWarningMessage: jest.fn().mockReturnValue(null),
}))

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName']),
  selectPipelineNames: jest.fn().mockReturnValue(['']),
  selectSteps: jest.fn().mockReturnValue(['']),
  selectBranches: jest.fn().mockReturnValue(['']),
}))

const mockValidationCheckContext = {
  getDuplicatedPipeLineIds: jest.fn().mockReturnValue([]),
  isPipelineValid: jest.fn().mockReturnValue(true),
}

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))

const setup = () =>
  render(
    <Provider store={store}>
      <LeadTimeForChanges />
    </Provider>
  )

describe('LeadTimeForChanges', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render LeadTimeForChanges', () => {
    const { getByText, getAllByText } = setup()

    expect(getByText(LEAD_TIME_FOR_CHANGES)).toBeInTheDocument()
    expect(getAllByText(ORGANIZATION).length).toBe(2)
  })

  it('should call addALeadTimeForChanges function when click add another pipeline button', async () => {
    const { getByTestId } = await setup()

    await userEvent.click(getByTestId('AddIcon'))

    expect(addALeadTimeForChanges).toHaveBeenCalledTimes(1)
  })

  it('should call deleteALeadTimeForChanges function when click remove pipeline button', async () => {
    const { getAllByRole } = await setup()

    await userEvent.click(getAllByRole('button', { name: REMOVE_BUTTON })[0])

    expect(deleteALeadTimeForChange).toHaveBeenCalledTimes(1)
  })

  it('should call updateLeadTimeForChanges function and clearErrorMessages function when select organization', async () => {
    const { getAllByRole, getByRole } = setup()

    await userEvent.click(getAllByRole('button', { name: ORGANIZATION })[0])
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByText('mockOrgName'))

    expect(updateLeadTimeForChanges).toHaveBeenCalledTimes(1)
  })
})
