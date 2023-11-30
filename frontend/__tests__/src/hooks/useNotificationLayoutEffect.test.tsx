import { act, renderHook } from '@testing-library/react'
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect'

describe('useNotificationLayoutEffect', () => {
  const defaultProps = { title: '', open: false }
  it('should init the state of notificationProps when render hook', async () => {
    const { result } = renderHook(() => useNotificationLayoutEffect())

    expect(result.current.notificationProps).toEqual(defaultProps)
  })

  it('should reset the notificationProps when call resetProps given mock props', async () => {
    const mockProps = { title: 'Test', open: true }
    const { result } = renderHook(() => useNotificationLayoutEffect())

    act(() => {
      result.current.notificationProps = mockProps
      result.current.resetProps?.()
    })

    expect(result.current.notificationProps).toEqual(defaultProps)
  })

  it('should update the notificationProps when call resetProps given mock props', async () => {
    const mockProps = { title: 'Test', open: true }
    const { result } = renderHook(() => useNotificationLayoutEffect())

    act(() => {
      result.current.notificationProps = defaultProps
      result.current.updateProps?.(mockProps)
    })

    expect(result.current.notificationProps).toEqual(mockProps)
  })
})
