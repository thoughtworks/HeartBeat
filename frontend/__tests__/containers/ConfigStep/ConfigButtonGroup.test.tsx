import { ConfigButtonGrop } from '@src/containers/ConfigStep/ConfigButton';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('ConfigButtonGroup', () => {
  const setup = (isVerified: boolean, isLoading: boolean, isVerifyTimeOut: boolean, isDisableVerifyButton: boolean) => {
    return render(
      <ConfigButtonGrop
        isVerifyTimeOut={isVerifyTimeOut}
        isVerified={isVerified}
        isLoading={isLoading}
        isDisableVerifyButton={isDisableVerifyButton}
      />,
    );
  };

  it('should render a verified and rest button  given isVerified is true and isLoading is false', () => {
    setup(true, false, false, false);

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeDisabled();
  });
  it('should render a Reverify button given isVerifyTimeOut is true', () => {
    setup(false, false, true, false);

    expect(screen.getByText('Reverify')).toBeInTheDocument();
    expect(screen.getByText('Reverify')).toHaveAttribute('type', 'submit');
  });
});
