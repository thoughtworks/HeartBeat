import { act, render, waitFor } from '@testing-library/react'
import { ErrorNotificationAutoDismiss } from '@src/components/Common/ErrorNotificationAutoDismiss'
import { setupStore } from '../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

let store = null
jest.useFakeTimers()
describe('ErrorNotificationAutoDismiss', () => {
  store = setupStore()
  const message = 'Test error message'
  const setup = () => {
    store = setupStore()
    return render(
      <Provider store={store}>
        <ErrorNotificationAutoDismiss message={message} />
      </Provider>
    )
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders error message and dismisses after 2 seconds', async () => {
    const { getByText, queryByText } = setup()

    expect(getByText(message)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    await waitFor(() => {
      expect(queryByText(message)).not.toBeInTheDocument()
    })
  })
})
