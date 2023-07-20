import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorPage from '@src/pages/ErrorPage'
import { ERROR_PAGE_MESSAGE } from '../fixtures'
import userEvent from '@testing-library/user-event'
import { navigateMock } from '../../setupTests'

describe('error page', () => {
  it('should show error message when render error page', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )

    expect(getByText('Oh no!')).toBeInTheDocument()
    expect(getByText(ERROR_PAGE_MESSAGE)).toBeInTheDocument()
    expect(getByText('Go to homepage')).toBeInTheDocument()
  })

  it('should go to home page when click button', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )

    await userEvent.click(getByText('Go to homepage'))

    expect(navigateMock).toHaveBeenCalledWith('/home')
  })
})
