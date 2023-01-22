import { render, screen } from '@testing-library/react';
import ProjectDescription from '@src/components/ProjectDescription';
import { PROJECT_DESCRIPTION } from '../fixtures';

describe('ProjectDescription', () => {
  it('should show project description', () => {
    const { getByRole } = render(<ProjectDescription />);

    // expect(queryByText(PROJECT_DESCRIPTION)).not.toBeInTheDocument();
    expect(getByRole('description').textContent).toContain(PROJECT_DESCRIPTION);
  });
});
