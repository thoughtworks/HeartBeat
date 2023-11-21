import { cleanup, fireEvent, getByRole, render, waitFor } from '@testing-library/react'
import { NotificationButton } from '@src/components/Common/NotificationButton/NotificationButton'
import React from 'react'

describe('NotificationButton', () => {
  afterEach(cleanup)
  const closeNotificationProps = { open: false, title: 'NotificationPopper' }
  const openNotificationProps = { open: true, title: 'NotificationPopper' }
  const setNotificationProps = jest.fn()

  it('should show NotificationIcon when render NotificationButton component', () => {
    const setNotificationProps = jest.fn()
    const { getByTestId } = render(
      <NotificationButton notificationProps={closeNotificationProps} setNotificationProps={setNotificationProps} />
    )
    expect(getByTestId('NotificationIcon')).toBeInTheDocument()
  })

  it('should hide NotificationIcon when notificationProps is undefined', () => {
    const notificationProps = undefined
    const { queryByTestId } = render(
      <NotificationButton notificationProps={notificationProps} setNotificationProps={setNotificationProps} />
    )
    expect(queryByTestId('NotificationIcon')).not.toBeInTheDocument()
  })

  it('should show NotificationPopper when the "open" value is true before clicking on the component.', async () => {
    const { getByTestId, getByText } = render(
      <NotificationButton notificationProps={openNotificationProps} setNotificationProps={setNotificationProps} />
    )

    fireEvent.click(getByTestId('NotificationIcon'))
    expect(getByText('NotificationPopper')).toBeInTheDocument()
  })

  it('should hide NotificationPopper when the "open" value is false before clicking on the component.', async () => {
    const { getByTestId, queryByText } = render(
      <NotificationButton notificationProps={closeNotificationProps} setNotificationProps={setNotificationProps} />
    )

    fireEvent.click(getByTestId('NotificationIcon'))
    expect(queryByText('NotificationPopper')).not.toBeInTheDocument()
  })

  it('should call setNotificationProps when click outside the component.', async () => {
    const setNotificationProps = jest.fn()

    const { getByText } = render(
      <div>
        <title> OutSideSection </title>
        <NotificationButton notificationProps={openNotificationProps} setNotificationProps={setNotificationProps} />
      </div>
    )

    const content = await waitFor(() => getByText('OutSideSection'))
    fireEvent.click(content)
    expect(setNotificationProps).toHaveBeenCalledTimes(1)
  })

  it('should return the empty string for title when notificationProps is undefined.', async () => {
    let resultNotificationProps = { title: 'not empty', open: false }
    const setNotificationProps = jest.fn().mockImplementation((preState) => {
      resultNotificationProps = preState
    })

    const { getByText } = render(
      <div>
        <title> OutSideSection </title>
        <NotificationButton notificationProps={openNotificationProps} setNotificationProps={setNotificationProps} />
      </div>
    )

    const content = await waitFor(() => getByText('OutSideSection'))
    fireEvent.click(content)
    expect(setNotificationProps).toHaveBeenCalledTimes(1)
    expect(resultNotificationProps.title).toEqual(undefined)
  })
})
