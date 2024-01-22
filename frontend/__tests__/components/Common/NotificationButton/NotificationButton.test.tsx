import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { Notification } from '@src/components/Common/NotificationButton';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import React from 'react';

const mockNotifications = [
  { id: '1', title: 'Notification', message: 'Notification Message 1' },
  {
    id: '2',
    title: 'Notification',
    message: 'Notification Message 2',
  },
];
describe('Notification', () => {
  const { result } = renderHook(() => useNotificationLayoutEffect());

  it('should render all notifications correctly', () => {
    act(() => {
      result.current.notifications = mockNotifications;
    });
    render(<Notification {...result.current} />);

    expect(screen.queryAllByText('Notification')).toHaveLength(2);
    expect(screen.getByText('Notification Message 1')).toBeInTheDocument();
    expect(screen.getByText('Notification Message 2')).toBeInTheDocument();
  });

  it('should call closeNotification with corresponding id when clicking close button', async () => {
    act(() => {
      result.current.notifications = mockNotifications;
      result.current.closeNotification = jest.fn();
    });

    render(<Notification {...result.current} />);

    const closeButton = screen.getAllByRole('button', { name: 'Close' });

    await userEvent.click(closeButton[0]);

    await waitFor(() => {
      expect(result.current.closeNotification).toBeCalledWith('1');
    });
  });

  it.each`
    type         | title                        | backgroundColor | icon                 | iconColor    | borderColor
    ${'error'}   | ${'Something went wrong!'}   | ${'#FFE7EA'}    | ${'CancelIcon'}      | ${'#D74257'} | ${'#F3B6BE'}
    ${'success'} | ${'Successfully completed!'} | ${'#EFFFF1'}    | ${'CheckCircleIcon'} | ${'#5E9E66'} | ${'#CFE2D1'}
    ${'warning'} | ${'Please note that'}        | ${'#FFF4E3'}    | ${'InfoIcon'}        | ${'#D78D20'} | ${'#F3D5A9'}
    ${'info'}    | ${'Help Information'}        | ${'#E9ECFF'}    | ${'InfoIcon'}        | ${'#4050B5'} | ${'#939DDA'}
  `(
    `should render title $title background color $backgroundColor, $icon in $iconColor, border color $borderColor given the "type" value is $type`,
    async ({ type, title, backgroundColor, icon, iconColor, borderColor }) => {
      act(() => {
        result.current.notifications = [{ id: '1', message: 'Notification Message 1', type }];
      });

      render(<Notification {...result.current} />);

      expect(screen.getByText(title)).toBeInTheDocument();
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
