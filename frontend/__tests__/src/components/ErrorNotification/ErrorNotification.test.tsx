import { act, render } from '@testing-library/react'
import { ErrorNotification } from '@src/components/ErrorNotifaction'

describe('error notification', () => {
  it('should call closeErrorNotification method when render error notification', () => {
    jest.useFakeTimers()
    const mockCloseErrorNotification = jest.fn()
    render(<ErrorNotification message={'Jira verify failed'} closeErrorNotification={mockCloseErrorNotification} />)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(mockCloseErrorNotification).toHaveBeenCalledTimes(1)
  })
})
