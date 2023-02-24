import { render } from '@testing-library/react'
import App from '@src/App'
import { Provider } from 'react-redux'
import { store } from '@src/store/store'

describe('render app', () => {
  const setup = () => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
  it('should show hello World when render app', () => {
    const { getByText, rerender } = setup()

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    )
    const loadText = getByText('Loading...')

    expect(loadText).toBeInTheDocument()
  })
})
