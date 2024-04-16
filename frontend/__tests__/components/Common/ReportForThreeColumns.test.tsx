import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import { LEAD_TIME_FOR_CHANGES, LOADING, VELOCITY } from '../../fixtures';
import { render, screen } from '@testing-library/react';

describe('Report for three columns', () => {
  it('should show loading when data is empty', () => {
    render(<ReportForThreeColumns title={VELOCITY} fieldName='fieldName' listName='listName' data={null} />);

    expect(screen.getByTestId(LOADING)).toBeInTheDocument();
    expect(screen.getByText(VELOCITY)).toBeInTheDocument();
  });

  it('should show table when data is not empty', () => {
    const mockData = [
      { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: '1' }] },
      { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: '2' }] },
      { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: '3' }] },
    ];

    render(
      <ReportForThreeColumns title={LEAD_TIME_FOR_CHANGES} fieldName='fieldName' listName='listName' data={mockData} />,
    );

    expect(screen.getByTestId(LEAD_TIME_FOR_CHANGES)).toBeInTheDocument();
  });

  it('should show table when data name contains emoji', () => {
    const mockData = [
      { id: 0, name: 'name1/:rocket: Deploy prod', valuesList: [{ name: 'test1', value: '1' }] },
      { id: 1, name: 'name2/:rocket: Deploy prod', valuesList: [{ name: 'test2', value: '2' }] },
      { id: 2, name: 'name3/:rocket: Deploy prod', valuesList: [{ name: 'test3', value: '3' }] },
    ];

    render(<ReportForThreeColumns title={VELOCITY} fieldName='fieldName' listName='listName' data={mockData} />);

    expect(screen.getByTestId(VELOCITY)).toBeInTheDocument();
  });

  it('should show default value when valuesList is empty', () => {
    const mockData = [{ id: 0, name: 'name1', valuesList: [] }];

    render(<ReportForThreeColumns title={VELOCITY} fieldName='fieldName' listName='listName' data={mockData} />);

    expect(screen.getAllByText('--')).toHaveLength(2);
  });
});
