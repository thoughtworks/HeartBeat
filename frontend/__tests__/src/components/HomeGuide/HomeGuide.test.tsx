import HomeGuide from '@src/components/HomeGuide';
import { render } from '@testing-library/react';

describe('HomeGuide', () => {
  it('should show 2 buttons', () => {
    render(<HomeGuide />);
  });
});
