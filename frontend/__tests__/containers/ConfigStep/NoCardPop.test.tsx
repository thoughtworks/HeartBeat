import { NoCardPop } from '@src/containers/ConfigStep/NoDoneCardPop';
import { fireEvent, render } from '@testing-library/react';
import { NO_CARD_ERROR_MESSAGE } from '../../fixtures';

const OK = 'Ok';
describe('NoCardPop', () => {
  it('should show NoCardPop component given isOpen param is true', () => {
    const { getByText, getByRole } = render(<NoCardPop isOpen={true} onClose={jest.fn()} />);

    expect(getByText(NO_CARD_ERROR_MESSAGE)).toBeInTheDocument();
    expect(getByRole('button', { name: OK })).toBeInTheDocument();
  });

  it('should call onClose function when click Ok button given isOpen param is true', () => {
    const handleClose = jest.fn();
    const { getByRole } = render(<NoCardPop isOpen={true} onClose={handleClose} />);
    const okButton = getByRole('button', { name: OK });

    fireEvent.click(okButton);

    expect(handleClose).toBeCalledTimes(1);
  });
});
