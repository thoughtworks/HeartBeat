import { ReworkDialog } from '@src/containers/MetricsStep/ReworkSettings/ReworkDialog';
import { CONFIRM, NEXT, PREVIOUS, REWORK_DIALOG_NOTE } from '@test/fixtures';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react/index';

const mockHiddenDialog = jest.fn();
describe('ReworkDialog', () => {
  const setup = () => render(<ReworkDialog isShowDialog={true} hiddenDialog={mockHiddenDialog} />);

  it('should show dialog when isShowDialog is true', () => {
    setup();
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should go to step two when handle Next', async () => {
    setup();
    const nextButton = screen.getByRole('button', { name: NEXT });

    expect(screen.getByText(REWORK_DIALOG_NOTE.REWORK_NOTE)).toBeVisible();

    await act(async () => {
      await userEvent.click(nextButton);
    });

    expect(screen.getByText(REWORK_DIALOG_NOTE.EXCLUDE_NOTE)).toBeVisible();
    expect(screen.getByRole('button', { name: PREVIOUS })).toBeVisible();
  });

  it('should back to step one when handle Previous', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: NEXT }));
    });
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: PREVIOUS }));
    });

    expect(screen.getByText(REWORK_DIALOG_NOTE.REWORK_NOTE)).toBeVisible();
    expect(screen.getByRole('button', { name: NEXT })).toBeVisible();
  });

  it('should hidden the dialog when handle Confirm', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: CONFIRM }));
    });

    expect(mockHiddenDialog).toBeCalled();
  });

  it('should hidden the dialog when handle close', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByTestId('CloseIcon'));
    });

    expect(mockHiddenDialog).toBeCalled();
  });
});
