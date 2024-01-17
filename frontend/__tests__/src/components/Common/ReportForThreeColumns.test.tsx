import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import clearAllMocks = jest.clearAllMocks;

describe('Report for three columns', () => {
  afterEach(() => {
    clearAllMocks();
  });

  it('should show loading when data is empty', () => {
    render(<ReportForThreeColumns title='title' fieldName='fieldName' listName='listName' data={undefined} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('should show table when has data', () => {
    const mockData = [
      { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: '1' }] },
      { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: '2' }] },
      { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: '3' }] },
    ];

    render(<ReportForThreeColumns title='title' fieldName='fieldName' listName='listName' data={mockData} />);

    expect(screen.getByTestId('title')).toBeInTheDocument();
  });
});
