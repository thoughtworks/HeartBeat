import { StyledCalendarWrapper } from '@src/containers/ReportStep/style';
import { render, screen } from '@testing-library/react';

describe('Report step styled components', () => {
  it('should render the bottom margin depend on whether StyledCalendarWrapper in summary page', () => {
    const wrapper = render(
      <StyledCalendarWrapper aria-label='test component 1' isSummaryPage={true}>
        test
      </StyledCalendarWrapper>,
    );

    const component1 = screen.getByLabelText('test component 1');

    expect(component1).toHaveStyle({ 'margin-bottom': '-3.5rem' });

    wrapper.rerender(<StyledCalendarWrapper aria-label='test component 2' isSummaryPage={false} />);

    const component2 = screen.getByLabelText('test component 2');

    expect(component2).toHaveStyle({ 'margin-bottom': '-2rem' });
  });
});
