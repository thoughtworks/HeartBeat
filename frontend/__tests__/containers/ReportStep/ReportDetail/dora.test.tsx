import { DoraDetail } from '@src/containers/ReportStep/ReportDetail';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { render, screen, within } from '@testing-library/react';
import { reportMapper } from '@src/hooks/reportMapper/report';
import React from 'react';

jest.mock('@src/hooks/reportMapper/report');
describe('DoraDetail', () => {
  const data: ReportResponseDTO = {} as ReportResponseDTO;

  afterEach(jest.clearAllMocks);

  it('should render a back link', () => {
    (reportMapper as jest.Mock).mockReturnValue({});
    render(<DoraDetail data={data} onBack={jest.fn()} />);
    expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  describe('Deployment Frequency', () => {
    it('should show deploymentFrequencyList when deploymentFrequencyList data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        deploymentFrequencyList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      const deploymentFrequencyTable = screen.getByTestId('Deployment Frequency');
      expect(screen.getByText('Deployment Frequency')).toBeInTheDocument();
      expect(deploymentFrequencyTable).toBeInTheDocument();
      expect(within(deploymentFrequencyTable).queryAllByTestId('tr').length).toBe(2);
    });

    it('should not show deploymentFrequencyList when deploymentFrequencyList data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        deploymentFrequencyList: null,
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      expect(screen.queryAllByText('Deployment Frequency').length).toEqual(0);
    });
  });

  describe('Lead Time For Changes', () => {
    it('should show leadTimeForChangesList when leadTimeForChangesList data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        leadTimeForChangesList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      const leadTimeForChangesTable = screen.getByTestId('Lead Time For Changes');
      expect(screen.getByText('Lead Time For Changes')).toBeInTheDocument();
      expect(leadTimeForChangesTable).toBeInTheDocument();
      expect(within(leadTimeForChangesTable).queryAllByTestId('tr').length).toBe(2);
    });

    it('should not show leadTimeForChangesList when leadTimeForChangesList data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        leadTimeForChangesList: null,
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      expect(screen.queryAllByText('Lead Time For Changes').length).toEqual(0);
    });
  });

  describe('Change Failure Rate', () => {
    it('should show changeFailureRateList when changeFailureRateList data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        changeFailureRateList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      const changeFailureRateTable = screen.getByTestId('Change Failure Rate');
      expect(screen.getByText('Change Failure Rate')).toBeInTheDocument();
      expect(changeFailureRateTable).toBeInTheDocument();
      expect(within(changeFailureRateTable).queryAllByTestId('tr').length).toBe(2);
    });

    it('should not show changeFailureRateList when changeFailureRateList data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        changeFailureRateList: null,
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      expect(screen.queryAllByText('Change Failure Rate').length).toEqual(0);
    });
  });

  describe('Mean Time To Recovery', () => {
    it('should show meanTimeToRecoveryList when meanTimeToRecoveryList data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        meanTimeToRecoveryList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      const meanTimeToRecoveryTable = screen.getByTestId('Mean Time To Recovery');
      expect(screen.getByText('Mean Time To Recovery')).toBeInTheDocument();
      expect(meanTimeToRecoveryTable).toBeInTheDocument();
      expect(within(meanTimeToRecoveryTable).queryAllByTestId('tr').length).toBe(2);
    });

    it('should not show meanTimeToRecoveryList when meanTimeToRecoveryList data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        meanTimeToRecoveryList: null,
      });
      render(<DoraDetail data={data} onBack={jest.fn()} />);
      expect(screen.queryAllByText('Mean Time To Recovery').length).toEqual(0);
    });
  });
});
