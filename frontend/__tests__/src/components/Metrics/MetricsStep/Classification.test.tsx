import { render, within } from '@testing-library/react'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import userEvent from '@testing-library/user-event'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'

const mockTitle = 'Classification Setting'
const mockLabel = 'Distinguished By'
const mockTargetField = [
  { flag: false, key: 'issue', name: 'Issue' },
  { flag: false, key: 'type', name: 'Type' },
]

const store = setupStore()
const setup = () => {
  return render(
    <Provider store={store}>
      <Classification title={mockTitle} label={mockLabel} options={mockTargetField} />
    </Provider>
  )
}

describe('Classification', () => {
  it('should show Classification when render Classification component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(mockLabel)).toBeInTheDocument()
  })

  it('should not show options when initialization', () => {
    const { queryByText } = setup()

    expect(queryByText('Issue')).not.toBeInTheDocument()
    expect(queryByText('Type')).not.toBeInTheDocument()
  })

  it('should show all options when click selectBox', async () => {
    const { getByRole, getByText } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))

    expect(getByText('Issue')).toBeInTheDocument()
    expect(getByText('Type')).toBeInTheDocument()
  })

  it('should show all targetField when click All and show nothing when cancel click', async () => {
    const { getByText, getByRole } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText('All'))
    const listBox = within(getByRole('listbox'))
    const names = mockTargetField.map((item) => item.name)

    expect(listBox.getByRole('option', { name: names[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: names[1] })).toHaveProperty('selected', true)

    await userEvent.click(getByText('All'))

    expect(listBox.getByRole('option', { name: names[0] })).toHaveProperty('selected', false)
    expect(listBox.getByRole('option', { name: names[1] })).toHaveProperty('selected', false)
  })

  it('should show selected targetField when click selected field', async () => {
    const { getByRole } = setup()
    const names = mockTargetField.map((item) => item.name)
    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: names[0] }))

    expect(listBox.getByRole('option', { name: names[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: names[1] })).toHaveProperty('selected', false)
  })
})
