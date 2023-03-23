import { act, fireEvent, render, screen } from '@testing-library/react'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import {
  BACK,
  CONFIRM_DIALOG_DESCRIPTION,
  LEAD_TIME_FOR_CHANGES,
  NEXT,
  PROJECT_NAME_LABEL,
  STEPS,
  TEST_PROJECT_NAME,
  VELOCITY,
} from '../../../fixtures'
import userEvent from '@testing-library/user-event'
import {
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineToolVerifyState,
  updateShowBoard,
  updateShowPipeline,
  updateShowSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import dayjs from 'dayjs'
import { navigateMock } from '../../../../setupTests'

const START_DATE_LABEL = 'From *'
const TODAY = dayjs()
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY')
const END_DATE_LABEL = 'To *'

const YES = 'Yes'
const CANCEL = 'Cancel'
const METRICS = 'Metrics'
const EXPORT = 'Export'
const stepperColor = 'rgba(0, 0, 0, 0.87)'
let store = setupStore()

beforeEach(() => {
  store = setupStore()
})

const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStepper />
    </Provider>
  )

const fillConfigPageData = async () => {
  const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL })
  fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } })

  const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
  fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } })
  await act(async () => {
    await store.dispatch(updateMetrics([VELOCITY, LEAD_TIME_FOR_CHANGES]))
    await store.dispatch(updateShowBoard(true))
    await store.dispatch(updateShowPipeline(true))
    await store.dispatch(updateShowSourceControl(true))
    await store.dispatch(updateBoardVerifyState(true))
    await store.dispatch(updatePipelineToolVerifyState(true))
    await store.dispatch(updateSourceControlVerifyState(true))
  })
}

describe('MetricsStepper', () => {
  it('should show metrics stepper', () => {
    const { getByText } = setup()

    STEPS.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })

    expect(getByText(NEXT)).toBeInTheDocument()
    expect(getByText(BACK)).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given config step ', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(PROJECT_NAME_LABEL)).toBeInTheDocument()
  })

  it('should show confirm dialog when click back button in config page', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument()
  })

  it('should close confirm dialog when click cancel button', async () => {
    const { getByText, queryByText } = setup()

    await userEvent.click(getByText(BACK))
    await userEvent.click(getByText(CANCEL))

    expect(queryByText(CONFIRM_DIALOG_DESCRIPTION)).not.toBeInTheDocument()
  })

  it('should go to home page when click Yes button', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(YES)).toBeVisible()

    await userEvent.click(getByText(YES))

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/home')
  })

  it('should disable next when required data is empty ', async () => {
    const { getByText } = setup()
    await act(async () => {
      await store.dispatch(updateMetrics([]))
    })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should disable next when dataRange is empty ', async () => {
    const { getByText, getByRole } = setup()
    await fillConfigPageData()

    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: null } })
    fireEvent.change(endDateInput, { target: { value: null } })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should disable next when endDate is empty ', async () => {
    const { getByText, getByRole } = setup()
    await fillConfigPageData()

    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } })
    fireEvent.change(endDateInput, { target: { value: null } })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should enable next when every selected component is show and verified', async () => {
    const { getByText } = setup()
    await fillConfigPageData()

    expect(getByText(NEXT)).toBeEnabled()
  })

  it('should disable next when board component is exist but not verified successfully', async () => {
    const { getByText } = setup()
    await act(async () => {
      await store.dispatch(updateMetrics([VELOCITY]))
      await store.dispatch(updateShowBoard(true))
      await store.dispatch(updateBoardVerifyState(false))
    })

    expect(getByText(NEXT)).toBeDisabled()
  })

  it('should go metrics page when click next button given next button enabled', async () => {
    const { getByText } = setup()

    await fillConfigPageData()
    await userEvent.click(getByText(NEXT))

    expect(getByText(METRICS)).toHaveStyle(`color:${stepperColor}`)
  })

  it('should show metrics export step when click next button given export step', async () => {
    const { getByText } = setup()
    await fillConfigPageData()
    await userEvent.click(getByText(NEXT))
    await userEvent.click(getByText(NEXT))

    expect(getByText(EXPORT)).toHaveStyle(`color:${stepperColor}`)
  })
})
