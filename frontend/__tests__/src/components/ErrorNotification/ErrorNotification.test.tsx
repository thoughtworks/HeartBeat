import { render } from '@testing-library/react'
import { ErrorNotification } from '@src/components/ErrorNotifaction'
import { JIRA_VERIFY_ERROR_MESSAGE } from '../../fixtures'

describe('error notification', () => {
  it('should show error message when render error notification', () => {
    const { getByText } = render(<ErrorNotification message={JIRA_VERIFY_ERROR_MESSAGE[400]} />)

    expect(getByText(JIRA_VERIFY_ERROR_MESSAGE[400])).toBeInTheDocument()
  })
})
