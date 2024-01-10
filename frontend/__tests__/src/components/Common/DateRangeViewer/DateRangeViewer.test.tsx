import { render } from '@testing-library/react';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
describe('DateRangeVier', () => {
  it('should show date when render component given startDate and endDate', () => {
    const { getByText } = render(
      <DateRangeViewer startDate={new Date('2022/1/1').toString()} endDate={new Date('2022/1/2').toString()} />
    );
    expect(getByText(/2022\/01\/01/g)).toBeInTheDocument();
    expect(getByText(/2022\/01\/02/g)).toBeInTheDocument();
  });
});
