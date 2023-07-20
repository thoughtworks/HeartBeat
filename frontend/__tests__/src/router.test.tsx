import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Router from '@src/router'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { ERROR_PAGE_MESSAGE } from './fixtures'
import { HOME_PAGE_ROUTE } from '@src/constants'

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
    expect.assertions(3)
    const metricsRoute = '/metrics'

    const { getByText } = setup(metricsRoute)
    await waitFor(
      () => {
        expect(getByText('Config')).toBeInTheDocument()
        expect(getByText('Metrics')).toBeInTheDocument()
        expect(getByText('Report')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('should show error page when go error page', async () => {
    const errorPageRoute = '/error-page'

    const { getByText } = setup(errorPageRoute)

    await waitFor(() => {
      expect(getByText(ERROR_PAGE_MESSAGE)).toBeInTheDocument()
    })
  })
})
