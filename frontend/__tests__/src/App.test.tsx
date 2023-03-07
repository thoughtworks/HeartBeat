import { render, RenderResult } from '@testing-library/react'
import App from '@src/App'
import { Provider } from 'react-redux'
import { store } from '@src/store'

describe('render app', () => {
  const setup = (): RenderResult => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
  it('should show hello World when render app', () => {
    const { rerender, container } = setup()

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar')
  })
})
