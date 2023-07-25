import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ErrorPage from '@src/pages/ErrorPage'
import { PROJECT_NAME } from '../fixtures'
import { setupStore } from '../utils/setupStoreUtil'
import { Provider } from 'react-redux'

describe('error page', () => {
  const setup = () => {
    store = setupStore()
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ErrorPage />
        </MemoryRouter>
      </Provider>
    )
  }
  let store = null
  it('should show error message when render error page', () => {
    const { getByText } = setup()

    expect(getByText(PROJECT_NAME)).toBeInTheDocument()
  })
})
