import { fireEvent, render } from '@testing-library/react'
import { NoCardPop } from '@src/components/Metrics/ConfigStep/NoCardPop'

const NO_CARD_MESSAGE = 'Sorry there is no card has been done, please change your collection date!'

describe('NoCardPop', () => {
  it('should show NoCardPop component given isOpen param is true', () => {
    const { getByText, getByRole } = render(<NoCardPop isOpen={true} onClose={jest.fn()} />)

    expect(getByText(NO_CARD_MESSAGE)).toBeInTheDocument()
    expect(getByRole('button', { name: 'Ok' })).toBeInTheDocument()
  })
  it('should call onClose function when click Ok button given isOpen param is true', () => {
    const handleClose = jest.fn()
    const { getByRole } = render(<NoCardPop isOpen={true} onClose={handleClose} />)
    const okButton = getByRole('button', { name: 'Ok' })

    fireEvent.click(okButton)

    expect(handleClose).toBeCalledTimes(1)
  })
})
