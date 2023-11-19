import { fireEvent, render } from '@testing-library/react'
import Header from '@src/layouts/Header'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { navigateMock } from '../../setupTests'
import { PROJECT_NAME } from '@src/constants'

describe('Header', () => {
  it('should show project name', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(getByText(PROJECT_NAME)).toBeInTheDocument()
  })

  it('should show project logo', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const logoInstance = getByRole('img')
    expect(logoInstance).toBeInTheDocument()
    expect(logoInstance.getAttribute('alt')).toContain('logo')
  })

  it('should go to home page when click logo', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    fireEvent.click(getByText(PROJECT_NAME))

    expect(window.location.pathname).toEqual('/')
  })

  describe('HomeIcon', () => {
    const homeBtnText = 'Home'
    const notHomePageRender = () =>
      render(
        <MemoryRouter initialEntries={[{ pathname: '/not/home/page' }]}>
          <Header />
        </MemoryRouter>
      )

    const indexHomePageRender = () =>
      render(
        <MemoryRouter initialEntries={[{ pathname: '/index.html' }]}>
          <Header />
        </MemoryRouter>
      )

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should show home icon', () => {
      const { getByTitle } = notHomePageRender()

      expect(getByTitle(homeBtnText)).toBeVisible()
    })

    it('should not show home icon when pathname is index.html', () => {
      const { queryByTitle } = indexHomePageRender()

      expect(queryByTitle(homeBtnText)).not.toBeInTheDocument()
    })

    it('should navigate to home page', () => {
      const { getByTitle } = notHomePageRender()

      fireEvent.click(getByTitle(homeBtnText))

      expect(navigateMock).toBeCalledTimes(1)
      expect(navigateMock).toBeCalledWith('/')
    })

    it('should go to home page when click logo given a not home page path', () => {
      const { getByText } = notHomePageRender()

      fireEvent.click(getByText(PROJECT_NAME))

      expect(window.location.pathname).toEqual('/')
    })

    it('should go to home page when click logo given a not home page path', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[{ pathname: '/index.html' }]}>
          <Header />
        </MemoryRouter>
      )

      fireEvent.click(getByText(PROJECT_NAME))

      expect(window.location.pathname).toEqual('/')
    })

    it('should render notification button when location equals to "/metrics".', () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={[{ pathname: '/metrics' }]}>
          <Header />
        </MemoryRouter>
      )
      expect(getByTestId('NotificationButton')).toBeInTheDocument()
    })
  })
})
