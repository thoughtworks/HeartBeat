import { fireEvent, render } from '@testing-library/react'
import { DateRangePicker } from '@src/components/metrics/ConfigStep/DateRangePicker'
import { ERROR_DATE, ERROR_MESSAGE_COLOR, PAST_DATE } from '../../../fixtures'

const today = new Date()
  .toLocaleDateString('en-US')
  .split('/')
  .map((num) => (Number(num) < 10 ? 0 + num : num))
  .join('/')

describe('DateRangePicker', () => {
  it('should render DateRangePicker', () => {
    const { getByText } = render(<DateRangePicker />)

    expect(getByText('From')).toBeInTheDocument()
    expect(getByText('To')).toBeInTheDocument()
  })

  it('should show right start date when input a valid date given init start date is null ', () => {
    const { getByRole } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: today } })

    expect(startDateInput.value).toEqual(today)
  })

  it('should show right end date when input a valid date given init end date is null ', () => {
    const { getByRole } = render(<DateRangePicker />)
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: today } })

    expect(endDateInput.value).toEqual(today)
  })

  it('should show error when input a invalid start date given init start date is null ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement

    fireEvent.change(startDateInput, { target: { value: ERROR_DATE } })

    expect(startDateInput.value).toEqual(ERROR_DATE)
    expect(getByText('From')).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a invalid end date given init end date is null ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: ERROR_DATE } })

    expect(endDateInput.value).toEqual(ERROR_DATE)
    expect(getByText('To')).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a null start date given init start date is valid ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: today } })

    fireEvent.change(startDateInput, { target: { value: null } })

    expect(getByText('From')).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should show error when input a null end date given init end date is valid ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement
    fireEvent.change(endDateInput, { target: { value: today } })

    fireEvent.change(endDateInput, { target: { value: null } })

    expect(getByText('To')).toHaveStyle(ERROR_MESSAGE_COLOR)
  })

  it('should clear end date when start date is after end date given valid end date', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement
    fireEvent.change(endDateInput, { target: { value: PAST_DATE } })

    fireEvent.change(startDateInput, { target: { value: today } })

    expect(endDateInput.value).toEqual(PAST_DATE)
    expect(getByText('To')).toHaveStyle(ERROR_MESSAGE_COLOR)
  })
})
