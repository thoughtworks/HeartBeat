import { ConfirmDialog } from '@src/containers/MetricsStepper/ConfirmDialog';
import { CONFIRM_DIALOG_DESCRIPTION } from '../../fixtures';
import { render } from '@testing-library/react';

const onClose = jest.fn();
const onConfirm = jest.fn();

describe('confirm dialog', () => {
  it('should show confirm dialog', () => {
    const { getByText } = render(<ConfirmDialog isDialogShowing={true} onConfirm={onConfirm} onClose={onClose} />);

    expect(getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument();
  });
});
