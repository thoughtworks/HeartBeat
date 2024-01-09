import { render, renderHook, waitFor, screen } from '@testing-library/react'
import { NotificationButton } from '@src/components/Common/NotificationButton'
import React from 'react'
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

const notificationIcon = 'NotificationIcon'
describe('NotificationButton', () => {
  const closeNotificationProps = { open: false, title: 'NotificationPopper', closeAutomatically: false }
  const openNotificationProps = { open: true, title: 'NotificationPopper', closeAutomatically: false }
  const { result } = renderHook(() => useNotificationLayoutEffect())

  it('should show NotificationIcon when render NotificationButton component', () => {
    const { getByTestId } = render(<NotificationButton {...result.current} />)

    expect(getByTestId(notificationIcon)).toBeInTheDocument()
  })

  it('should show NotificationPopper when clicking the component given the "open" value is true', async () => {
    act(() => {
      result.current.notificationProps = openNotificationProps
    })
    const { getByText } = render(<NotificationButton {...result.current} />)
    await userEvent.click(screen.getByTestId(notificationIcon))
    expect(getByText('NotificationPopper')).toBeInTheDocument()
  })

  it('should hide NotificationPopper when clicking the component  given the "open" value is false', async () => {
    act(() => {
      result.current.notificationProps = closeNotificationProps
    })
    const { getByTestId, queryByText } = render(<NotificationButton {...result.current} />)
    await userEvent.click(getByTestId(notificationIcon))

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
    await userEvent.click(content)

    expect(result.current.updateProps).toBeCalledTimes(1)
    expect(checkProps).toEqual(closeNotificationProps)
  })

  it('should hide the NotificationPopper component when call render given notificationProps is undefined.', () => {
    act(() => {
      result.current.notificationProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should hide the NotificationPopper component when call render given updateProps is undefined.', () => {
    act(() => {
      result.current.updateProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should hide the Notification component when call render given updateProps and notificationProps are undefined.', () => {
    act(() => {
      result.current.notificationProps = undefined
      result.current.updateProps = undefined
    })
    const { queryByText } = render(<NotificationButton {...result.current} />)

    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should not call updateProps when clicking outside the component given the notificationProps is undefined.', async () => {
    act(() => {
      result.current.notificationProps = undefined
      result.current.updateProps = jest.fn()
    })

    const { getByText, getByTestId } = render(
      <div>
        <title> OutSideSection </title>
        <NotificationButton {...result.current} />
      </div>
    )

    expect(getByTestId(notificationIcon)).toBeInTheDocument()

    const content = await waitFor(() => getByText('OutSideSection'))
    await userEvent.click(content)

    expect(result.current.updateProps).not.toBeCalled()
  })
})
