import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { DURATION } from '@src/constants/commons';
import clearAllMocks = jest.clearAllMocks;

const mockNotification = { title: 'Test', message: 'Notification Message' };

describe('useNotificationLayoutEffect', () => {
  afterAll(() => {
    clearAllMocks();
  });

  it('should init the state of notifications when rendering hook', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect());

    expect(result.current.notifications).toEqual([]);
  });

  it('should update the notifications when calling addNotification', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.addNotification(mockNotification);
      result.current.addNotification(mockNotification);
    });

    expect(result.current.notifications).toEqual([
      { id: expect.anything(), ...mockNotification },
      {
        id: expect.anything(),
        ...mockNotification,
      },
    ]);
  });

  it('should close corresponding notification when calling closeNotification by id', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.addNotification(mockNotification);
      result.current.addNotification(mockNotification);
    });

    expect(result.current.notifications.length).toEqual(2);
    const expected = result.current.notifications[1];

    act(() => {
      result.current.closeNotification(result.current.notifications[0].id);
    });

    await waitFor(() => {
      expect(result.current.notifications).toEqual([expected]);
    });
  });

  it('should reset the notifications when calling closeAllNotifications', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.addNotification(mockNotification);
      result.current.addNotification(mockNotification);
    });
    expect(result.current.notifications.length).toEqual(2);

    act(() => {
      result.current.closeAllNotifications();
    });

    expect(result.current.notifications).toEqual([]);
  });

  it('should close notification when time exceeds 10s', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.addNotification(mockNotification);
    });

    expect(result.current.notifications).toEqual([{ id: expect.anything(), ...mockNotification }]);

    act(() => {
      jest.advanceTimersByTime(DURATION.NOTIFICATION_TIME);
    });

    await waitFor(() => {
      expect(result.current.notifications).toEqual([]);
    });

    jest.useRealTimers();
  });
});
