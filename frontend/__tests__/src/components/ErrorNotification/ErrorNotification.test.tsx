import { render } from '@testing-library/react'
import { ErrorNotification } from '@src/components/ErrorNotifaction'
import { JIRA_VERIFY_FAILED_MESSAGE } from '../../fixtures'

describe('error notification', () => {
  it('should show error message when render error notification', () => {
    const { getByText } = render(<ErrorNotification message={JIRA_VERIFY_FAILED_MESSAGE} />)

    expect(getByText(JIRA_VERIFY_FAILED_MESSAGE)).toBeInTheDocument()
  })
})
