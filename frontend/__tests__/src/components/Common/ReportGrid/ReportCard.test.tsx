import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard';
import { render, screen } from '@testing-library/react';
import React from 'react';
import clearAllMocks = jest.clearAllMocks;

describe('Report Card', () => {
  afterEach(() => {
    clearAllMocks();
  });

  it('should not show exceeding items', () => {
    const items = [
      {
        value: 1,
        subtitle: 'PR Lead Time',
      },
      {
        value: 2,
        subtitle: 'Pipeline Lead Time',
      },
      {
        value: 3,
        subtitle: 'Total Lead Time',
      },
    ];

    render(<ReportCard title={'card'} items={items} xs={6} errorMessage={''} />);

    expect(screen.getByText('1.00')).toBeInTheDocument();
    expect(screen.getByText('2.00')).toBeInTheDocument();
    expect(screen.queryByText('3.00')).not.toBeInTheDocument();
  });

  it('should show error message when errorMessage is not empty', () => {
    const errorMessage = 'Data loading failed';

    render(<ReportCard title={'card'} items={null} xs={6} errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
