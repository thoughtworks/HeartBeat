import { fireEvent, render } from '@testing-library/react'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { ERROR_DATE, ERROR_MESSAGE_COLOR, PAST_DATE } from '../../../fixtures'
import dayjs from 'dayjs'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

const START_DATE_LABEL = 'From'
const END_DATE_LABEL = 'To'
const today = dayjs().format('MM/DD/YYYY')
let store = setupStore()

const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <DateRangePicker />
    </Provider>
  )
}

describe('DateRangePicker', () => {
  it('should render DateRangePicker', () => {
    const { getByText } = setup()

    expect(getByText(START_DATE_LABEL)).toBeInTheDocument()
    expect(getByText(END_DATE_LABEL)).toBeInTheDocument()
  })

  it('should show right start date when input a valid date given init start date is null ', () => {
    const { getByRole } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: today } })

    expect(startDateInput.value).toEqual(today)
  })

  it('should show right end date when input a valid date given init end date is null ', () => {
    const { getByRole } = setup()
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: today } })

    expect(endDateInput.value).toEqual(today)
  })

  it('should show error when input a invalid start date given init start date is null ', () => {
    const { getByRole, getByText } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: ERROR_DATE } })

    expect(startDateInput.value).toEqual(ERROR_DATE)
    expect(getByText(START_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a invalid end date given init end date is null ', () => {
    const { getByRole, getByText } = setup()
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: ERROR_DATE } })

    expect(endDateInput.value).toEqual(ERROR_DATE)
    expect(getByText(END_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a null start date given init start date is valid ', () => {
    const { getByRole, getByText } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: today } })

    fireEvent.change(startDateInput, { target: { value: null } })

    expect(getByText(START_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a null end date given init end date is valid ', () => {
    const { getByRole, getByText } = setup()
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement
    fireEvent.change(endDateInput, { target: { value: today } })

    fireEvent.change(endDateInput, { target: { value: null } })

    expect(getByText(END_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should clear end date when start date is after end date given valid end date', () => {
    const { getByRole, getByText } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: today } })
    fireEvent.change(endDateInput, { target: { value: PAST_DATE } })

    expect(endDateInput.value).toEqual(PAST_DATE)
    expect(getByText(END_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should Auto-fill endDate which is after startDate 14 days when fill right startDate ', () => {
    const { getByRole } = setup()
    const endDate = dayjs().add(14, 'day').format('MM/DD/YYYY')
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: today } })

    expect(endDateInput.value).toEqual(endDate)
  })

  it('should not Auto-fill endDate which is after startDate 14 days when fill wrong format startDate ', () => {
    const { getByRole, getByText } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: ERROR_DATE } })

    expect(startDateInput.value).toEqual(ERROR_DATE)
    expect(getByText(START_DATE_LABEL)).toHaveStyle(ERROR_MESSAGE_COLOR)
    expect(endDateInput.value).toEqual('')
  })
})
