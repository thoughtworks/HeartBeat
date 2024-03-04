import { ProjectDescription } from '@src/components/ProjectDescription';
import { PROJECT_DESCRIPTION } from '../fixtures';
import { render } from '@testing-library/react';

describe('ProjectDescription', () => {
  it('should show project description', () => {
    const { getByRole } = render(<ProjectDescription />);

    expect(getByRole('description').textContent).toContain(PROJECT_DESCRIPTION);
  });
});
