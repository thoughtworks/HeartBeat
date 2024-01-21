import { withGoBack } from '@src/containers/ReportStep/ReportDetail/withBack';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

describe('withGoBack', () => {
  const onBack = jest.fn();

  afterEach(jest.clearAllMocks);

  it('should render a link with back', () => {
    const Component = withGoBack(() => <div>{'test1'}</div>);
    render(<Component onBack={onBack} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should render the icon', () => {
    const Component = withGoBack(() => <div>{'test2'}</div>);
    render(<Component onBack={onBack} />);
    expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
  });

  it('should call onBack when the back is clicked', () => {
    const Component = withGoBack(() => <div>{'test3'}</div>);
    render(<Component onBack={onBack} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toBeCalled();
  });
});
