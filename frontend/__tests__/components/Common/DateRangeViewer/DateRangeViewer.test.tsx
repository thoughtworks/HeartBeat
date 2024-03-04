import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { render, screen } from '@testing-library/react';
describe('DateRangeVier', () => {
  it('should show date when render component given startDate and endDate', () => {
    render(<DateRangeViewer startDate={new Date('2022/1/1').toString()} endDate={new Date('2022/1/2').toString()} />);
    expect(screen.getByText(/2022\/01\/01/)).toBeInTheDocument();
    expect(screen.getByText(/2022\/01\/02/)).toBeInTheDocument();
  });
});
