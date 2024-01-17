import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading } from '@src/components/Loading';

describe('Loading', () => {
  it('should show Loading', () => {
    const { container } = render(<Loading />);

    expect(container.getElementsByTagName('svg')).toHaveLength(1);
    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
  });

  it('should show Loading message when has message', () => {
    render(<Loading message={'loading...'} />);

    expect(screen.getByText('loading...')).toBeInTheDocument();
  });

  it('should in page center when placement is center', () => {
    render(<Loading placement={'center'} />);

    expect(screen.getByTestId('loading')).toHaveStyle({ 'align-items': 'center' });
  });

  it('should in page start when placement is start', () => {
    render(<Loading placement={'start'} />);

    expect(screen.getByTestId('loading')).toHaveStyle({ 'align-items': 'flex-start' });
  });
});
