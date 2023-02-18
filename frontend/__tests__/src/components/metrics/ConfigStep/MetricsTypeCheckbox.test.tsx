import { CONFIG_TITLE, REQUIRED_DATA, REQUIRED_DATA_LIST, VELOCITY } from '../../../fixtures'
import { fireEvent, render, within } from '@testing-library/react'
import { MetricsTypeCheckbox } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
let store = null
const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <MetricsTypeCheckbox />
    </Provider>
  )
}

describe('MetricsTypeCheckbox', () => {
  it('should show require data and do not display specific options when init', () => {
    const { getByText, queryByText } = setup()
    const require = getByText(REQUIRED_DATA)

    expect(require).toBeInTheDocument()

    const option = queryByText(VELOCITY)
    expect(option).not.toBeTruthy()
  })
  it('should show detail options when click require data button', () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(REQUIRED_DATA_LIST)
  })
  it('should show multiple selections when multiple options are selected', () => {
    const { getByRole, getByText } = setup()
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))

    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: 'Cycle time' }))

    expect(getByText('Velocity,Cycle time')).toBeInTheDocument()
  })
  it('should show error message when require data is null', () => {
    const { getByRole, getByText } = setup()

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))
    fireEvent.mouseDown(getByRole('listbox', { name: REQUIRED_DATA }))

    const errorMessage = getByText('Metrics is required')
    expect(errorMessage).toBeInTheDocument()
  })
  it('should board component  when click MetricsTypeCheckbox selection velocity ', () => {
    const { getByRole } = setup()
    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const listBox = within(getByRole('listbox'))
    fireEvent.click(listBox.getByRole('option', { name: VELOCITY }))

    expect(getByRole('heading', { name: CONFIG_TITLE.BOARD, hidden: true })).toBeInTheDocument()
  })
  it('should hidden board component when MetricsTypeCheckbox select is null given MetricsTypeCheckbox select is velocity ', () => {
    const { getByRole, queryByText } = setup()

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }))
    const requireDateSelection = within(getByRole('listbox'))
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }))
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }))

    expect(queryByText(CONFIG_TITLE.BOARD)).toBeNull()
  })
})
