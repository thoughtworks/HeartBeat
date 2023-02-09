import { fireEvent, Matcher, render, within } from '@testing-library/react'
import { ConfigStep } from '@src/components/metrics/ConfigStep'
import {
  CHINA_CALENDAR,
  REGULAR_CALENDAR,
  REQUIRE_DATA,
  REQUIRE_DATAS,
  TEST_PROJECT_NAME,
  VELOCITY,
} from '../../../fixtures'
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
  it('should show require data and do not display specific options when init', async () => {
    const { getByText, queryByText } = setup()
    const require = getByText(REQUIRE_DATA)

    expect(require).toBeInTheDocument()

    const option = queryByText(VELOCITY)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click require data button', async () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(REQUIRE_DATAS)
  })
  it('should show multiple selections when multiple options are selected', async () => {
    const { getByRole, getByText } = setup()
    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))

    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: 'Cycle time' }))

    expect(getByText('Velocity,Cycle time')).toBeInTheDocument()
  })
  it('should show error message when require data is null', async () => {
    const { getByRole, getByText } = setup()

    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.mouseDown(getByRole('listbox', { name: REQUIRE_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })
})
