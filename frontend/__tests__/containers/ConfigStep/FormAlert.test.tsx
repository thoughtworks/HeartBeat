import { act, render, screen, waitFor } from '@testing-library/react';
import { FormAlert } from '@src/containers/ConfigStep/FormAlert';
import { formAlertTypes } from '@src/constants/commons';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('FormAlert', () => {
  const onCloseSpy = jest.fn();
  const setup = (onClose: () => void, showAlert: boolean, moduleType: string, formAlertType: formAlertTypes) => {
    return render(
      <FormAlert showAlert={showAlert} onClose={onClose} moduleType={moduleType} formAlertType={formAlertType} />,
    );
  };

  it('should render board message given moduleType is board and timeout alert', () => {
    const mockTimeoutAlertType = formAlertTypes.TIMEOUT;
    setup(onCloseSpy, true, 'Board', mockTimeoutAlertType);
    const message = screen.getByText('Board');

    expect(message).toBeInTheDocument();
  });

  it('should render board verify failed message given board verify alert', () => {
    const mockBoardVerifyAlertType = formAlertTypes.BOARD_VERIFY;
    setup(onCloseSpy, true, '', mockBoardVerifyAlertType);
    render(<FormAlert showAlert={true} onClose={onCloseSpy} formAlertType={mockBoardVerifyAlertType} />);
    const elements = screen.getAllByText('Email');
    const message = elements[0];

    expect(message).toBeInTheDocument();
  });

  it('should close alert when click the close icon', async () => {
    const mockTimeoutAlertType = formAlertTypes.TIMEOUT;
    setup(onCloseSpy, true, 'any', mockTimeoutAlertType);
    const closeIcon = screen.getByTestId('CloseIcon');

    act(() => {
      userEvent.click(closeIcon);
    });

    await waitFor(() => {
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
