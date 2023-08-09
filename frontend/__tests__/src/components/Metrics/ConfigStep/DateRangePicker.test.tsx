import { fireEvent, render } from '@testing-library/react'
import { DateRangePicker } from '@src/components/Metrics/ConfigStep/DateRangePicker'
import { ERROR_DATE } from '../../../fixtures'
import dayjs from 'dayjs'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

const START_DATE_LABEL = 'From *'
const END_DATE_LABEL = 'To *'
const TODAY = dayjs()
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY')
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
  const expectDate = (inputDate: HTMLInputElement) => {
    expect(inputDate.value).toEqual(expect.stringContaining(TODAY.date().toString()))
    expect(inputDate.value).toEqual(expect.stringContaining((TODAY.month() + 1).toString()))
    expect(inputDate.value).toEqual(expect.stringContaining(TODAY.year().toString()))
  }

  it('should render DateRangePicker', () => {
    const { queryAllByText } = setup()

    expect(queryAllByText(START_DATE_LABEL)).toHaveLength(2)
    expect(queryAllByText(END_DATE_LABEL)).toHaveLength(2)
  })

  it('should show right start date when input a valid date given init start date is null ', () => {
    const { getByRole } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } })

    expectDate(startDateInput)
  })

  it('should show right end date when input a valid date given init end date is null ', () => {
    const { getByRole } = setup()
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: INPUT_DATE_VALUE } })

    expectDate(endDateInput)
  })

  it('should Auto-fill endDate which is after startDate 13 days when fill right startDate ', () => {
    const { getByRole } = setup()
    const endDate = TODAY.add(13, 'day')
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } })

    expect(endDateInput.value).toEqual(expect.stringContaining(endDate.date().toString()))
    expect(endDateInput.value).toEqual(expect.stringContaining((endDate.month() + 1).toString()))
    expect(endDateInput.value).toEqual(expect.stringContaining(endDate.year().toString()))
  })

  it('should not Auto-fill endDate which is after startDate 14 days when fill wrong format startDate ', () => {
    const { getByRole } = setup()
    const startDateInput = getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: ERROR_DATE } })

    expect(startDateInput.valueAsDate).toEqual(null)
    expect(endDateInput.valueAsDate).toEqual(null)
  })
})
