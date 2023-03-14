import { render, within } from '@testing-library/react'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import userEvent from '@testing-library/user-event'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'

const options = ['DONE', 'CANCELLED']
const mockTitle = 'RealDone'
const mockLabel = 'Consider as Done'
const store = setupStore()
const setup = () =>
  render(
    <Provider store={store}>
      <RealDone options={options} label={mockLabel} title={mockTitle} />
    </Provider>
  )

describe('RealDone', () => {
  it('should show RealDone when render RealDone component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
  })

  it('should selected all options by default when initializing', () => {
    const { getByText } = setup()
    const require = getByText('DONE, CANCELLED')

    expect(require).toBeInTheDocument()
  })

  it('should show detail options when click Consider as Done button', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(['All', 'DONE', 'CANCELLED'])
  })

  it('should show error message when RealDone is null', async () => {
    const { getByRole, getByText } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText('All'))

    const requiredText = getByText('consider as Done')
    expect(requiredText.tagName).toBe('STRONG')
  })

  it('should show other selections when cancel one option given default all selections in RealDone', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: options[0] }))

    expect(listBox.getByRole('option', { name: options[0] })).toHaveProperty('selected', false)
    expect(listBox.getByRole('option', { name: options[1] })).toHaveProperty('selected', true)
  })

  it('should clear RealDone data when check all option', async () => {
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

  it('should check RealDone data when click all option', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const allOption = listBox.getByRole('option', { name: 'All' })
    await userEvent.click(allOption)

    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: options[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: options[1] })).toHaveProperty('selected', true)
  })
})
