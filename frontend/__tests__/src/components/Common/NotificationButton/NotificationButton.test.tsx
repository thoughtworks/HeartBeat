import { render, renderHook, waitFor } from '@testing-library/react';
import { Notification } from '@src/components/Common/NotificationButton';
import React from 'react';
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('Notification', () => {
  const closeNotificationProps = {
    open: false,
    title: 'NotificationPopper',
    message: 'Notification Message',
    closeAutomatically: false,
  };
  const openNotificationProps = {
    open: true,
    title: 'NotificationPopper',
    message: 'Notification Message',
    closeAutomatically: false,
  };
  const { result } = renderHook(() => useNotificationLayoutEffect());

  it('should show title and message given the "open" value is true', () => {
    act(() => {
      result.current.notificationProps = openNotificationProps;
    });
    const { getByText } = render(<Notification {...result.current} />);

    expect(getByText('NotificationPopper')).toBeInTheDocument();
    expect(getByText('Notification Message')).toBeInTheDocument();
  });

  it('should not show title and message given the "open" value is false', () => {
    act(() => {
      result.current.notificationProps = closeNotificationProps;
    });
    const { queryByText } = render(<Notification {...result.current} />);

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument();
    expect(queryByText('Notification Message')).not.toBeInTheDocument();
  });

  it('should call updateProps when clicking close button given the "open" value is true', async () => {
    act(() => {
      result.current.notificationProps = openNotificationProps;
      result.current.updateProps = jest.fn();
    });

    const { getByRole } = render(<Notification {...result.current} />);

    const closeButton = getByRole('button', { name: 'Close' });

    act(() => {
      userEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(result.current.updateProps).toBeCalledWith(closeNotificationProps);
    });
  });
});
