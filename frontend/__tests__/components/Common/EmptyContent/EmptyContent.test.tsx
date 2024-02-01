import EmptyContent from '@src/components/Common/EmptyContent';
import { render, screen } from '@testing-library/react';

describe('EmptyContent', () => {
  it('should show title and message when render EmptyContent given title and message', () => {
    render(<EmptyContent title='Fake title' message='there is empty content' />);
    expect(screen.getByText(/fake title/i)).toBeInTheDocument();
    expect(screen.getByText(/there is empty content/i)).toBeInTheDocument();
  });
});
