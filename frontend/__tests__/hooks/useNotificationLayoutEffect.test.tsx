import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { DURATION } from '@src/constants/commons';
import clearAllMocks = jest.clearAllMocks;

describe('useNotificationLayoutEffect', () => {
  afterAll(() => {
    clearAllMocks();
  });
  const defaultProps = {
    title: '',
    message: '',
    open: false,
    closeAutomatically: false,
    durationTimeout: DURATION.NOTIFICATION_TIME,
  };
  it('should init the state of notificationProps when render hook', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect());

    expect(result.current.notificationProps).toEqual(defaultProps);
  });

  it('should reset the notificationProps when call resetProps given mock props', async () => {
    const mockProps = { title: 'Test', message: 'Notification Message', open: true, closeAutomatically: false };
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.notificationProps = mockProps;
      result.current.resetProps();
    });

    expect(result.current.notificationProps).toEqual(defaultProps);
  });

  it('should update the notificationProps when call updateProps given mock props', async () => {
    const mockProps = { title: 'Test', message: 'Notification Message', open: true, closeAutomatically: false };
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.notificationProps = defaultProps;
      result.current.updateProps(mockProps);
    });

    expect(result.current.notificationProps).toEqual(mockProps);
  });

  it('should reset the notificationProps when update the value of closeAutomatically given closeAutomatically equals to true', async () => {
    jest.useFakeTimers();
    const mockProps = { title: 'Test', message: 'Notification Message', open: true, closeAutomatically: true };
    const { result } = renderHook(() => useNotificationLayoutEffect());

    act(() => {
      result.current.notificationProps = defaultProps;
      result.current.updateProps(mockProps);
    });
    act(() => {
      jest.advanceTimersByTime(DURATION.NOTIFICATION_TIME);
    });

    await waitFor(() => {
      expect(result.current.notificationProps).toEqual(defaultProps);
    });

    jest.useRealTimers();
  });

  it('should reset the notificationProps after 5s when update the value of closeAutomatically given durationTimeout equals to 5s', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNotificationLayoutEffect());
    const expectedTime = 5000;
    const mockProps = {
      title: 'Test',
      message: 'Notification Message',
      open: true,
      closeAutomatically: true,
      durationTimeout: expectedTime,
    };

    act(() => {
      result.current.notificationProps = defaultProps;
      result.current.updateProps(mockProps);
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.notificationProps).not.toEqual(defaultProps);
    });
    act(() => {
      jest.advanceTimersByTime(expectedTime);
    });

    await waitFor(() => {
      expect(result.current.notificationProps).toEqual(defaultProps);
    });

    jest.useRealTimers();
  });
});
