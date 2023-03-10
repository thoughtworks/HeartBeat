import { render } from '@testing-library/react'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { JIRA_VERIFY_ERROR_MESSAGE } from '../../fixtures'

describe('error notification', () => {
  it('should show error message when render error notification', () => {
    const { getByText } = render(<ErrorNotification message={JIRA_VERIFY_ERROR_MESSAGE.BadRequest} />)

    expect(getByText(JIRA_VERIFY_ERROR_MESSAGE.BadRequest)).toBeInTheDocument()
  })
})
