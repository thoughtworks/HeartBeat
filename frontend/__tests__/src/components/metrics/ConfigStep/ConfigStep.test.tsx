import { fireEvent, render } from '@testing-library/react'
import { ConfigStep } from '@src/components/metrics/ConfigStep'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '../../../fixtures'

describe('ConfigStep', () => {
  it('should show project name when render configStep', () => {
    const { getByText } = render(<ConfigStep />)

    expect(getByText('Project Name')).toBeInTheDocument()
  })
  it('should selected by default value when rendering the radioGroup', () => {
    const { getByRole } = render(<ConfigStep />)

    const defaultValue = getByRole('radio', { name: REGULAR_CALENDAR })

    expect(defaultValue).toBeChecked()
  })
  it('should switch the radio switch when any radioLabel is selected', () => {
    const { getByLabelText } = render(<ConfigStep />)

    const chinaCalendar = getByLabelText(CHINA_CALENDAR)
    fireEvent.click(chinaCalendar)
    expect(chinaCalendar).toBeChecked()

    const regularCalendar = getByLabelText(REGULAR_CALENDAR)
    fireEvent.click(regularCalendar)
    expect(regularCalendar).toBeChecked()
  })
})
