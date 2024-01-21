import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { Notification } from '@src/components/Common/NotificationButton';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import React from 'react';

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
    render(<Notification {...result.current} />);

    expect(screen.getByText('NotificationPopper')).toBeInTheDocument();
    expect(screen.getByText('Notification Message')).toBeInTheDocument();
  });

  it('should not show title and message given the "open" value is false', () => {
    act(() => {
      result.current.notificationProps = closeNotificationProps;
    });
    render(<Notification {...result.current} />);

    expect(screen.queryByText('NotificationPopper')).not.toBeInTheDocument();
    expect(screen.queryByText('Notification Message')).not.toBeInTheDocument();
  });

  it('should call updateProps when clicking close button given the "open" value is true', async () => {
    act(() => {
      result.current.notificationProps = openNotificationProps;
      result.current.updateProps = jest.fn();
    });

    render(<Notification {...result.current} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });

    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(result.current.updateProps).toBeCalledWith(closeNotificationProps);
    });
  });

  it.each`
    type         | backgroundColor | icon                 | iconColor    | borderColor
    ${'error'}   | ${'#FFE7EA'}    | ${'CancelIcon'}      | ${'#D74257'} | ${'#F3B6BE'}
    ${'success'} | ${'#EFFFF1'}    | ${'CheckCircleIcon'} | ${'#5E9E66'} | ${'#CFE2D1'}
    ${'warning'} | ${'#FFF4E3'}    | ${'InfoIcon'}        | ${'#D78D20'} | ${'#F3D5A9'}
    ${'info'}    | ${'#E9ECFF'}    | ${'InfoIcon'}        | ${'#4050B5'} | ${'#939DDA'}
  `(
    `should render background color $backgroundColor and $icon in $iconColor given the "type" value is $type`,
    async ({ type, backgroundColor, icon, iconColor, borderColor }) => {
      act(() => {
        result.current.notificationProps = { ...openNotificationProps, type };
      });

      render(<Notification {...result.current} />);

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({ 'background-color': backgroundColor });
      expect(alertElement).toHaveStyle({ border: `0.0625rem solid ${borderColor}` });

      const iconElement = screen.getByTestId(icon).parentElement;
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveStyle({ color: iconColor });
      expect(screen.getByTestId(icon)).toBeInTheDocument();
    },
  );
});
