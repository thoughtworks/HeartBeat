import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading } from '@src/components/Loading';
import { LOADING } from '../../fixtures';

describe('Loading', () => {
  it('should show Loading', () => {
    const { container } = render(<Loading />);

    expect(container.getElementsByTagName('svg')).toHaveLength(1);
    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar');
  });

  it('should show Loading message when has message', () => {
    const mockText = 'loading...';
    render(<Loading message={mockText} />);

    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it('should in page center when placement is center', () => {
    render(<Loading placement={'center'} />);

    expect(screen.getByTestId(LOADING)).toHaveStyle({ 'align-items': 'center' });
  });

  it('should in page start when placement is left', () => {
    render(<Loading placement={'left'} />);

    expect(screen.getByTestId(LOADING)).toHaveStyle({ 'align-items': 'flex-start' });
  });
});
