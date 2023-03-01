import { render } from '@testing-library/react'
import { ErrorNotification } from '@src/components/ErrorNotifaction'
import { JIRA_VERIFY_FAILED_MESSAGE } from '../../fixtures'

describe('error notification', () => {
  it('should show error message when render error notification', () => {
    const { getByText } = render(<ErrorNotification message={JIRA_VERIFY_FAILED_MESSAGE} />)

    expect(getByText(JIRA_VERIFY_FAILED_MESSAGE)).toBeInTheDocument()
  })

  it('should close when the error notation show 2 seconds', () => {
    const { getByText, getByTestId } = render(<ErrorNotification message={JIRA_VERIFY_FAILED_MESSAGE} />)
    expect(getByTestId('errorNotification')).toBeVisible()

    const handleClose = jest.fn()

    expect(getByText(JIRA_VERIFY_FAILED_MESSAGE)).toBeInTheDocument()
    setTimeout(() => {
      expect(handleClose).toBeCalledTimes(1)
      expect(getByTestId('errorNotification')).not.toBeVisible()
    }, 2000)
  })
})
