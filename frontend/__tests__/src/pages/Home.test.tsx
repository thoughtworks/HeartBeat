import { render } from '@testing-library/react'
import { PROJECT_NAME } from '../fixtures'
import Home from '@src/pages/Home'
import { MemoryRouter } from 'react-router-dom'
import { setupStore } from '../utils/setupStoreUtil'
import { Provider } from 'react-redux'

const setup = () => {
  store = setupStore()
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  )
}
let store = null

describe('Home', () => {
  it('should render home page', () => {
    const { getByText } = setup()

    expect(getByText(PROJECT_NAME)).toBeInTheDocument()
  })
})
