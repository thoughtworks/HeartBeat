import { REQUIRED_DATA, REQUIRED_DATAS, VELOCITY } from '../../../fixtures'
import { fireEvent, render, within } from '@testing-library/react'
import { MetricsTypeCheckbox } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox'

describe('MetricsTypeCheckbox', () => {
  it('should show require data and do not display specific options when init', () => {
    const { getByText, queryByText } = render(<MetricsTypeCheckbox onHandleRequireData={jest.fn} />)
    const require = getByText(REQUIRED_DATA)

    expect(require).toBeInTheDocument()

    const option = queryByText(VELOCITY)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click require data button', () => {
    const { getByRole } = render(<MetricsTypeCheckbox onHandleRequireData={jest.fn} />)
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(REQUIRED_DATAS)
  })
  it('should show multiple selections when multiple options are selected', () => {
    const { getByRole, getByText } = render(<MetricsTypeCheckbox onHandleRequireData={jest.fn} />)
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: 'Cycle time' }))

    expect(getByText('Velocity,Cycle time')).toBeInTheDocument()
  })
  it('should show error message when require data is null', () => {
    const { getByRole, getByText } = render(<MetricsTypeCheckbox onHandleRequireData={jest.fn} />)

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.mouseDown(getByRole('listbox', { name: REQUIRED_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should call handleRequireDate function when click MetricsTypeCheckbox selection, ', async () => {
    const handleRequireDate = jest.fn()
    const { getByRole } = render(<MetricsTypeCheckbox onHandleRequireData={handleRequireDate} />)
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))

    expect(handleRequireDate).toHaveBeenCalledTimes(1)
  })
})
