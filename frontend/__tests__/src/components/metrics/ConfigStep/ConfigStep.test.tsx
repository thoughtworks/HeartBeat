import { fireEvent, Matcher, render, within } from '@testing-library/react'
import { ConfigStep } from '@src/components/metrics/ConfigStep'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '../../../fixtures'

describe('ConfigStep', () => {
  it('should show project name when render configStep', () => {
    const { getByText } = render(<ConfigStep />)

    expect(getByText('Project Name')).toBeInTheDocument()
  })
  it('should show project name when input some letters', () => {
    const { getByRole, getByDisplayValue } = render(<ConfigStep />)
    const hasInputValue = (e: HTMLElement, inputValue: Matcher) => {
      return getByDisplayValue(inputValue) === e
    }
    const input = getByRole('textbox', { name: 'Project Name' })

    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'test project Name' } })

    expect(hasInputValue(input, 'test project Name')).toBe(true)
  })
  it('should show error message when project name is null', () => {
    const { getByTestId, getByText } = render(<ConfigStep />)
    const input = getByTestId('testProjectName')

    fireEvent.change(input, { target: { value: 'test project Name' } })
    fireEvent.change(input, { target: { value: '' } })

    expect(getByText('Project Name is required')).toBeInTheDocument()
  })
  it('should selected by default value when rendering the radioGroup', () => {
    const { getByRole } = render(<ConfigStep />)
    const defaultValue = getByRole('radio', { name: REGULAR_CALENDAR })
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR })

    expect(defaultValue).toBeChecked()
    expect(chinaCalendar).not.toBeChecked()
  })
  it('should switch the radio switch when any radioLabel is selected', () => {
    const { getByRole } = render(<ConfigStep />)
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR })
    const regularCalendar = getByRole('radio', { name: REGULAR_CALENDAR })
    fireEvent.click(chinaCalendar)

    expect(chinaCalendar).toBeChecked()
    expect(regularCalendar).not.toBeChecked()

    fireEvent.click(regularCalendar)

    expect(regularCalendar).toBeChecked()
    expect(chinaCalendar).not.toBeChecked()
  })
  it('should show require data and do not display specific options when init', async () => {
    const { getByText, queryByText } = render(<ConfigStep />)
    const require = getByText('Require Data')

    expect(require).toBeInTheDocument()

    const option = queryByText('Velocity')
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click require data button', async () => {
    const { getByRole } = render(<ConfigStep />)
    fireEvent.mouseDown(getByRole('button'))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual([
      'Velocity',
      'Cycle time',
      'Classification',
      'Lead time for changes',
      'Deployment frequency',
      'Change failure rate',
      'Mean time to recovery',
    ])
  })
  it('should show multiple selections when multiple options are selected', async () => {
    const { getByRole, getByText } = render(<ConfigStep />)
    fireEvent.mouseDown(getByRole('button'))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: 'Velocity' }))
    fireEvent.click(listBox.getByRole('option', { name: 'Cycle time' }))

    expect(getByText('Velocity,Cycle time')).toBeInTheDocument()
  })
  it('should show error message when require data is null', async () => {
    const { getByRole, getByText } = render(<ConfigStep />)

    fireEvent.mouseDown(getByRole('button'))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: 'Velocity' }))
    fireEvent.click(listBox.getByRole('option', { name: 'Velocity' }))
    fireEvent.mouseDown(getByRole('listbox', { name: 'Require Data' }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })
})
