import { HomeGuide } from '@src/components/HomeGuide'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { setupStore } from '../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { CREATE_NEW_PROJECT, IMPORT_PROJECT_FROM_FILE } from '../../fixtures'
import userEvent from '@testing-library/user-event'
import { navigateMock } from '../../../setupTests'

const mockedUseAppDispatch = jest.fn()

jest.mock('@src/hooks/useAppDispatch', () => ({
  ...jest.requireActual('react-router-dom'),
  useAppDispatch: () => mockedUseAppDispatch,
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

describe('HomeGuide', () => {
  beforeEach(() => {
    store = setupStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show 2 buttons', () => {
    const { getByText } = setup()

    expect(getByText(IMPORT_PROJECT_FROM_FILE)).toBeInTheDocument()
    expect(getByText(CREATE_NEW_PROJECT)).toBeInTheDocument()
  })

  it('should render input when click guide button', async () => {
    const { getByText, getByTestId } = setup()
    const fileInput = getByTestId('testInput')

    const clickSpy = jest.spyOn(fileInput, 'click')
    await userEvent.click(getByText(IMPORT_PROJECT_FROM_FILE))

    expect(clickSpy).toHaveBeenCalled()
  })

  it('should go to Metrics page and read file when click import file button', async () => {
    const { getByTestId } = setup()

    const file = new File(['{"projectName": "Heartbeat test"}'], 'test.json', {
      type: 'file',
    })
    const input = getByTestId('testInput')

    Object.defineProperty(input, 'files', {
      value: [file],
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(mockedUseAppDispatch).toHaveBeenCalledTimes(2)
      expect(navigateMock).toHaveBeenCalledWith('/metrics')
    })
  })

  it('should go to Metrics page when click create a new project button', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(CREATE_NEW_PROJECT))

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/metrics')
  })
})
