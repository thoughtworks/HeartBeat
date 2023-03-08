import { render, within } from '@testing-library/react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import userEvent from '@testing-library/user-event'

const options = ['user one', 'user two']
const mockTitle = 'Crews Setting'
const mockLabel = 'Included Crews'
const setup = () => {
  return render(<Crews options={options} title={mockTitle} label={mockLabel} />)
}

describe('Crew', () => {
  it('should show Crews when render Crews component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
  })

  it('should selected all options by default when initializing', () => {
    const { getByText } = setup()
    const require = getByText('user one, user two')

    expect(require).toBeInTheDocument()
  })

  it('should show detail options when click Included crews button', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(['All', 'user one', 'user two'])
  })

  it('should show error message when crews is null', async () => {
    const { getByRole, getByText } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText('All'))

    const errorMessage = getByText(`${mockLabel} is required`)
    expect(errorMessage).toBeInTheDocument()
  })

  it('should show other selections when cancel one option given default all selections in crews', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: options[0] }))

    expect(listBox.getByRole('option', { name: options[0] })).toHaveProperty('selected', false)
    expect(listBox.getByRole('option', { name: options[1] })).toHaveProperty('selected', true)
  })

  it('should clear crews data when check all option', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const allOption = listBox.getByRole('option', { name: 'All' })
    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: options[0] })).toHaveProperty('selected', false)
    expect(listBox.getByRole('option', { name: options[1] })).toHaveProperty('selected', false)

    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: options[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: options[1] })).toHaveProperty('selected', true)
  })
})
