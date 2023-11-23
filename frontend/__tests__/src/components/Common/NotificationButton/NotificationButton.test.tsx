import { cleanup, fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { NotificationButton } from '@src/components/Common/NotificationButton/NotificationButton'
import React from 'react'
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect'
import { act } from 'react-dom/test-utils'
import { HEADER_NOTIFICATION_MESSAGE } from '@src/constants'

describe('NotificationButton', () => {
  afterEach(cleanup)
  const closeNotificationProps = { open: false, title: 'NotificationPopper' }
  const openNotificationProps = { open: true, title: 'NotificationPopper' }
  const { result } = renderHook(() => useNotificationLayoutEffect())

  it('should show NotificationIcon when render NotificationButton component', () => {
    const { getByTestId } = render(<NotificationButton {...result.current} />)

    expect(getByTestId('NotificationIcon')).toBeInTheDocument()
  })

  it('should hide NotificationIcon when notificationProps is undefined', () => {
    act(() => {
      result.current.notificationProps = undefined
    })
    const { queryByTestId } = render(<NotificationButton {...result.current} />)

    expect(queryByTestId('NotificationIcon')).not.toBeInTheDocument()
  })

  it('should show NotificationPopper when clicking the component given the "open" value is true', async () => {
    act(() => {
      result.current.notificationProps = openNotificationProps
    })
    const { getByTestId, getByText } = render(<NotificationButton {...result.current} />)

    fireEvent.click(getByTestId('NotificationIcon'))
    expect(getByText('NotificationPopper')).toBeInTheDocument()
  })

  it('should hide NotificationPopper when clicking the component  given the "open" value is false', async () => {
    act(() => {
      result.current.notificationProps = closeNotificationProps
    })
    const { getByTestId, queryByText } = render(<NotificationButton {...result.current} />)

    fireEvent.click(getByTestId('NotificationIcon'))

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should  call updateProps when clicking outside the component given the "open" value.', async () => {
    let checkProps = openNotificationProps
    act(() => {
      result.current.notificationProps = openNotificationProps
      result.current.updateProps = jest.fn().mockImplementation(() => (checkProps = closeNotificationProps))
    })

    const { getByRole, getByText } = render(
      <div>
        <title> OutSideSection </title>
        <NotificationButton {...result.current} />
      </div>
    )

    expect(getByRole('tooltip')).toBeInTheDocument()

    const content = await waitFor(() => getByText('OutSideSection'))

    fireEvent.click(content)

    expect(result.current.updateProps).toBeCalledTimes(1)
    expect(checkProps).toEqual(closeNotificationProps)
  })

  it('should hide the NotificationPopper component when call render given notificationProps is undefined.', async () => {
    act(() => {
      result.current.notificationProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should hide the NotificationPopper component when call render given updateProps is undefined.', async () => {
    act(() => {
      result.current.updateProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should hide the Notification component when call render given updateProps and notificationProps are undefined.', async () => {
    act(() => {
      result.current.notificationProps = undefined
      result.current.updateProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should call resetProps and updateProps when remaining time is less than or equal to 5 minutes', async () => {
    const resetProps = jest.fn()
    const updateProps = jest.fn()
    jest.useFakeTimers()
    render(
      <div>
        <title> The file will expire in five minutes, please download it in time. </title>
        <NotificationButton {...result.current} />
      </div>
    )

    expect(resetProps).not.toBeCalled()
    expect(updateProps).not.toBeCalled()

    jest.advanceTimersByTime(5000)

    expect(resetProps).not.toBeCalled()
    expect(updateProps).not.toBeCalled()

    jest.advanceTimersByTime(1600000)

    expect(resetProps).toBeCalledTimes(1)
    expect(updateProps).toBeCalledTimes(1)
    expect(updateProps).toBeCalledWith({
      open: true,
      title: HEADER_NOTIFICATION_MESSAGE.EXPIRE_IN_FIVE_MINUTES,
    })

    jest.useRealTimers()
  })
})
