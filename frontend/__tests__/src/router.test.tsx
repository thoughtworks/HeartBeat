import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Router from '@src/router'
import '@testing-library/jest-dom'

describe('router', () => {
  const setup = (routeUrl: string) =>
    render(
      <MemoryRouter initialEntries={[routeUrl]}>
        <Router />
      </MemoryRouter>
    )

  it('should show home page when loading on a bad page', async () => {
    const badRoute = '/some/bad/route'

    setup(badRoute)

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/')
    })
  })

  it('should show home page when go home page', async () => {
    const homeRoute = '/home'

    setup(homeRoute)

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/')
    })
  })

  it('should show metrics page when go metrics page', async () => {
    const metricsRoute = '/metrics'
    const steps = ['config', 'metrics', 'export']

    const { getByText } = setup(metricsRoute)

    await waitFor(() => {
      expect(getByText('Heartbeat')).toBeInTheDocument()
      steps.map((label) => {
        expect(getByText(label)).toBeInTheDocument()
      })
    })
  })
})
