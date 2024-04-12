import { TimeoutAlert } from '@src/containers/ConfigStep/TimeoutAlert';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('TimeoutAlert', () => {
  const setIsShowAlert = jest.fn();
  const setup = (
    setIsShowAlert: (value: boolean) => void,
    isShowAlert: boolean,
    isVerifyTimeOut: boolean,
    moduleType: string,
  ) => {
    return render(
      <TimeoutAlert
        setIsShowAlert={setIsShowAlert}
        isShowAlert={isShowAlert}
        isVerifyTimeOut={isVerifyTimeOut}
        moduleType={moduleType}
      />,
    );
  };

  it('should render board message given moduleType is board', () => {
    setup(setIsShowAlert, true, true, 'Board');
    const message = screen.getByText('Board');

    expect(message).toBeInTheDocument();
  });
  it('should not render the alert given isVerifyTimeOut or isShowAlert is false', () => {
    setup(setIsShowAlert, false, true, 'Board');

    expect(screen.queryByText('Board')).not.toBeInTheDocument();

    setup(setIsShowAlert, true, false, 'Board');

    expect(screen.queryByText('Board')).not.toBeInTheDocument();
  });

  it('should call setIsShowAlert with false when click the close icon given init value', async () => {
    setup(setIsShowAlert, true, true, 'any');
    const closeIcon = screen.getByTestId('CloseIcon');

    act(() => {
      userEvent.click(closeIcon);
    });

    await waitFor(() => {
      expect(setIsShowAlert).toHaveBeenCalledTimes(1);
      expect(setIsShowAlert).toHaveBeenCalledWith(false);
    });
  });
});
