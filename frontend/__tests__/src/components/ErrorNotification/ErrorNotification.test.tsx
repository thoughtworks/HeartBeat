import { ErrorNotification } from '@src/components/ErrorNotification';
import { BOARD_TYPES, VERIFY_ERROR_MESSAGE } from '../../fixtures';
import { render } from '@testing-library/react';

describe('error notification', () => {
  it('should show error message when render error notification', () => {
    const { getByText } = render(
      <ErrorNotification message={`${BOARD_TYPES.JIRA} ${VERIFY_ERROR_MESSAGE.BAD_REQUEST}`} />,
    );

    expect(getByText(`${BOARD_TYPES.JIRA} ${VERIFY_ERROR_MESSAGE.BAD_REQUEST}`)).toBeInTheDocument();
  });
});
