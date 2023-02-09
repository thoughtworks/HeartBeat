import { REQUIRE_DATA, REQUIRE_DATAS, VELOCITY } from '../../../fixtures'
import { fireEvent, render, within } from '@testing-library/react'
import { MetricsTypeCheckbox } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox'

describe('MetricsTypeCheckbox', () => {
  it('should show require data and do not display specific options when init', () => {
    const { getByText, queryByText } = render(<MetricsTypeCheckbox />)
    const require = getByText(REQUIRE_DATA)

    expect(require).toBeInTheDocument()

    const option = queryByText(VELOCITY)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click require data button', () => {
    const { getByRole } = render(<MetricsTypeCheckbox />)
    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(REQUIRE_DATAS)
  })
  it('should show multiple selections when multiple options are selected', () => {
    const { getByRole, getByText } = render(<MetricsTypeCheckbox />)
    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))

    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: 'Cycle time' }))

    expect(getByText('Velocity,Cycle time')).toBeInTheDocument()
  })
  it('should show error message when require data is null', () => {
    const { getByRole, getByText } = render(<MetricsTypeCheckbox />)

    fireEvent.mouseDown(getByRole('button', { name: REQUIRE_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.mouseDown(getByRole('listbox', { name: REQUIRE_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })
})
