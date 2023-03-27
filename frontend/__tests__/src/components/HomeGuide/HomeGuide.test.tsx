import { HomeGuide } from '@src/components/HomeGuide'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { setupStore } from '../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { CREATE_NEW_PROJECT, IMPORT_PROJECT_FROM_FILE } from '../../fixtures'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

let store = setupStore()

const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <HomeGuide />
    </Provider>
  )
}
beforeEach(() => {
  store = setupStore()
})

describe('HomeGuide', () => {
  it('should show 2 buttons', () => {
    const { getByText } = setup()

    expect(getByText(IMPORT_PROJECT_FROM_FILE)).toBeInTheDocument()
    expect(getByText(CREATE_NEW_PROJECT)).toBeInTheDocument()
  })

  it('should go to Metrics page when click create a new project button', async () => {
    const { getByText } = setup()

    fireEvent.click(getByText(CREATE_NEW_PROJECT))

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/metrics')
  })

  it('should go to Metrics page and read file when click import file button', async () => {
    const { getByLabelText } = setup()

    const file = new File(['{"projectName": "Heartbeat test"}'], 'test.json', {
      type: 'file',
    })
    const input = getByLabelText('Import project from file')

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/metrics')
    })
  })
})
