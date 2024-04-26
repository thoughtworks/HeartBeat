import { TimeoutAlert } from '@src/containers/ConfigStep/TimeoutAlert';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('TimeoutAlert', () => {
  const onCloseSpy = jest.fn();
  const setup = (onClose: () => void, showAlert: boolean, moduleType: string) => {
    return render(<TimeoutAlert showAlert={showAlert} onClose={onClose} moduleType={moduleType} />);
  };

  it('should render board message given moduleType is board', () => {
    setup(onCloseSpy, true, 'Board');
    const message = screen.getByText('Board');

    expect(message).toBeInTheDocument();
  });

  it('should call onCloseSpy when click the close icon given init value', async () => {
    setup(onCloseSpy, true, 'any');
    const closeIcon = screen.getByTestId('CloseIcon');

    act(() => {
      userEvent.click(closeIcon);
    });

    await waitFor(() => {
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
