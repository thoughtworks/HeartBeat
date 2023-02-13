import { fireEvent, Matcher, render, within } from '@testing-library/react'
import { ConfigStep } from '@src/components/metrics/ConfigStep'
import { CHINA_CALENDAR, REGULAR_CALENDAR, REQUIRE_DATA, TEST_PROJECT_NAME, VELOCITY } from '../../../fixtures'
import { Provider } from 'react-redux'
import { store } from '@src/store/store'

describe('ConfigStep', () => {
  const setup = () =>
    render(
      <Provider store={store}>
        <ConfigStep />
      </Provider>
    )
  it('should show project name when render configStep', () => {
    const { getByText } = setup()

    expect(getByText('Project Name')).toBeInTheDocument()
  })
  it('should show project name when input some letters', () => {
    const { getByRole, getByDisplayValue } = setup()
    const hasInputValue = (e: HTMLElement, inputValue: Matcher) => {
      return getByDisplayValue(inputValue) === e
    }
    const input = getByRole('textbox', { name: 'Project Name' })

    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } })

    expect(hasInputValue(input, TEST_PROJECT_NAME)).toBe(true)
  })
  it('should show error message when project name is Empty', () => {
    const { getByRole, getByText } = setup()
    const input = getByRole('textbox', { name: 'Project Name' })

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } })
    fireEvent.change(input, { target: { value: '' } })

    expect(getByText('Project Name is required')).toBeInTheDocument()
  })
  it('should show error message when click project name input with no letter', () => {
    const { getByRole, getByText } = setup()
    const input = getByRole('textbox', { name: 'Project Name' })

    fireEvent.focus(input)

    expect(getByText('Project Name is required')).toBeInTheDocument()
  })
  it('should select Regular calendar by default when rendering the radioGroup', () => {
    const { getByRole } = setup()
    const defaultValue = getByRole('radio', { name: REGULAR_CALENDAR })
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR })

    expect(defaultValue).toBeChecked()
    expect(chinaCalendar).not.toBeChecked()
  })
  it('should switch the radio when any radioLabel is selected', () => {
    const { getByRole } = setup()
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR })
    const regularCalendar = getByRole('radio', { name: REGULAR_CALENDAR })
    fireEvent.click(chinaCalendar)

    expect(chinaCalendar).toBeChecked()
    expect(regularCalendar).not.toBeChecked()

    fireEvent.click(regularCalendar)

    expect(regularCalendar).toBeChecked()
    expect(chinaCalendar).not.toBeChecked()
  })

  it('should not show board component when init ConfigStep component ', () => {
    const { queryByText } = setup()

    expect(queryByText('board')).toBeNull()
  })

  it('should show board component when MetricsTypeCheckbox select Velocity,Cycle time', () => {
    const { getByRole } = setup()

    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const requireDateSelection = within(getByRole('listbox'))
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }))
    fireEvent.click(requireDateSelection.getByRole('option', { name: 'Cycle time' }))

    expect(getByRole('heading', { name: 'board', hidden: true })).toBeInTheDocument()
  })

  it('should show board component when MetricsTypeCheckbox select  Classification, ', () => {
    const { getByRole } = setup()

    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const requireDateSelection = within(getByRole('listbox'))
    fireEvent.click(requireDateSelection.getByRole('option', { name: 'Classification' }))

    expect(getByRole('heading', { name: 'board', hidden: true })).toBeInTheDocument()
  })
})
