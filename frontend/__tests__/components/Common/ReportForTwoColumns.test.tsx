import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns';
import { CYCLE_TIME, DEPLOYMENT_FREQUENCY, VELOCITY } from '../../fixtures';
import { REPORT_SUFFIX_UNITS } from '@src/constants/resources';
import { render, screen } from '@testing-library/react';

describe('Report for two columns', () => {
  it('should show table when data is not empty', () => {
    const mockData = [
      { id: 0, name: 'name1', valueList: [{ value: '1' }] },
      { id: 1, name: 'name2', valueList: [{ value: '2' }] },
      { id: 2, name: 'name3', valueList: [{ value: '3' }] },
    ];

    render(<ReportForTwoColumns title={VELOCITY} data={mockData} />);

    expect(screen.getByTestId(VELOCITY)).toBeInTheDocument();
  });

  it('should show cycle time table row', () => {
    const mockData = [
      { id: 0, name: 'name1', valueList: [{ value: '1.1', units: REPORT_SUFFIX_UNITS.PER_CARD }] },
      { id: 1, name: 'name2', valueList: [{ value: '2', units: REPORT_SUFFIX_UNITS.PER_CARD }] },
      { id: 2, name: <div>name3</div>, valueList: [{ value: '3', units: REPORT_SUFFIX_UNITS.PER_CARD }] },
    ];

    render(<ReportForTwoColumns title={CYCLE_TIME} data={mockData} />);

    expect(screen.getByTestId(CYCLE_TIME)).toBeInTheDocument();
  });

  it('should show table when data name contains emoji', () => {
    const mockData = [
      { id: 0, name: 'name1/:rocket: Deploy prod', valueList: [{ value: '1' }] },
      { id: 1, name: 'name2/:rocket: Deploy prod', valueList: [{ value: '2' }] },
      { id: 2, name: 'name3/:rocket: Deploy prod', valueList: [{ value: '3' }] },
    ];

    render(<ReportForTwoColumns title={DEPLOYMENT_FREQUENCY} data={mockData} />);

    expect(screen.getByTestId(DEPLOYMENT_FREQUENCY)).toBeInTheDocument();
  });

  it('should show table when data with Units is not empty', () => {
    const mockData = [
      { id: 0, name: 'name1', valueList: [{ value: 1, units: REPORT_SUFFIX_UNITS.PER_CARD }] },
      { id: 1, name: 'name2', valueList: [{ value: 2, units: REPORT_SUFFIX_UNITS.PER_CARD }] },
    ];

    render(<ReportForTwoColumns title={CYCLE_TIME} data={mockData} />);

    expect(screen.getByTestId(CYCLE_TIME)).toBeInTheDocument();
  });
});
