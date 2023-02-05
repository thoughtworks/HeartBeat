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
})
