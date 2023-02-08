import { fireEvent, render } from '@testing-library/react'
import { DateRangePicker } from '@src/components/metrics/ConfigStep/DateRangePicker'

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

    fireEvent.change(startDateInput, { target: { value: '02/03/' } })

    expect(startDateInput.value).toEqual('02/03/')
    expect(getByText('From')).toHaveStyle(`color: #d32f2f`)
  })

  it('should show error when input a invalid end date given init end date is null ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement

    fireEvent.change(endDateInput, { target: { value: '03/02/' } })

    expect(endDateInput.value).toEqual('03/02/')
    expect(getByText('To')).toHaveStyle(`color: #d32f2f`)
  })

  it('should show error when input a null start date given init start date is valid ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement
    fireEvent.change(startDateInput, { target: { value: '03/02/2022' } })

    fireEvent.change(startDateInput, { target: { value: null } })

    expect(getByText('From')).toHaveStyle(`color: #d32f2f`)
  })

  it('should show error when input a null end date given init end date is valid ', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement
    fireEvent.change(endDateInput, { target: { value: '03/02/2022' } })

    fireEvent.change(endDateInput, { target: { value: null } })

    expect(getByText('To')).toHaveStyle(`color: #d32f2f`)
  })

  it('should clear end date when start date is after end date given valid end date', () => {
    const { getByRole, getByText } = render(<DateRangePicker />)
    const startDateInput = getByRole('textbox', { name: 'From' }) as HTMLInputElement
    const endDateInput = getByRole('textbox', { name: 'To' }) as HTMLInputElement
    fireEvent.change(endDateInput, { target: { value: '03/02/2022' } })

    fireEvent.change(startDateInput, { target: { value: '08/02/2022' } })

    expect(endDateInput.value).toEqual('03/02/2022')
    expect(getByText('To')).toHaveStyle(`color: #d32f2f`)
  })
})
