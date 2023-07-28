import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Router from '@src/router'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { ERROR_PAGE_MESSAGE, ERROR_PAGE_ROUTE, HOME_PAGE_ROUTE, METRICS_PAGE_ROUTE } from './fixtures'

jest.mock('@src/pages/Metrics', () => ({
  __esModule: true,
  default: () => <div>Mocked Metrics Page</div>,
}))

describe('router', () => {
  const setup = (routeUrl: string) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[routeUrl]}>
          <Router />
        </MemoryRouter>
      </Provider>
    )

  it('should show home page when loading on a bad page', async () => {
    const badRoute = '/some/bad/route'

    setup(badRoute)

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/')
    })
  })

  it('should show home page when go home page', async () => {
    setup(HOME_PAGE_ROUTE)

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/')
    })
  })

  it('should show Metrics page when go Metrics page', async () => {
    const { getByText } = setup(METRICS_PAGE_ROUTE)

    await waitFor(() => {
      expect(getByText('Mocked Metrics Page')).toBeInTheDocument()
    })
  })

  it('should show error page when go error page', async () => {
    const { getByText } = setup(ERROR_PAGE_ROUTE)

    await waitFor(() => {
      expect(getByText(ERROR_PAGE_MESSAGE)).toBeInTheDocument()
    })
  })
})
