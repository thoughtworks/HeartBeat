import { addNotification } from '@src/context/notification/NotificationSlice';
import { BoardDetail } from '@src/containers/ReportStep/ReportDetail';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { updateMetrics } from '@src/context/config/configSlice';
import { render, screen, within } from '@testing-library/react';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { setupStore } from '@test/utils/setupStoreUtil';
import { REQUIRED_DATA_LIST } from '@test/fixtures';
import { MESSAGE } from '@src/constants/resources';
import { Provider } from 'react-redux';
import React from 'react';

jest.mock('@src/hooks/reportMapper/report');

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  addNotification: jest.fn().mockReturnValue({ type: 'ADD_NOTIFICATION' }),
}));

describe('board', () => {
  const data: ReportResponseDTO = {} as ReportResponseDTO;

  afterEach(jest.clearAllMocks);

  it('should render a back link', () => {
    (reportMapper as jest.Mock).mockReturnValue({});

    render(
      <Provider store={setupStore()}>
        <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
      </Provider>,
    );

    expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  describe('Velocity', () => {
    it('should show velocity when velocity data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        velocityList: [
          { id: 0, name: 'name1', valueList: [{ value: 1 }] },
          { id: 1, name: 'name2', valueList: [{ value: 2 }] },
        ],
      });

      render(
        <Provider store={setupStore()}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      const velocityTable = screen.getByTestId('Velocity');
      expect(screen.getByText('Velocity')).toBeInTheDocument();
      expect(velocityTable).toBeInTheDocument();
      expect(within(velocityTable).queryAllByTestId('tr').length).toBe(2);
    });

    it('should not show velocity when velocity data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        velocityList: null,
      });

      render(
        <Provider store={setupStore()}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      expect(screen.queryAllByText('Velocity').length).toEqual(0);
    });
  });

  describe('Cycle Time', () => {
    it('should show cycle time when cycle time data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        cycleTimeList: [
          { id: 0, name: 'name1', valueList: [{ value: 1 }] },
          { id: 1, name: 'name2', valueList: [{ value: 2 }] },
          { id: 2, name: 'name3', valueList: [{ value: 3 }] },
        ],
      });

      render(
        <Provider store={setupStore()}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      const cycleTimeTable = screen.getByTestId('Cycle Time');
      expect(screen.getByText('Cycle Time')).toBeInTheDocument();
      expect(cycleTimeTable).toBeInTheDocument();
      expect(within(cycleTimeTable).queryAllByTestId('tr').length).toBe(3);
    });

    it('should not show cycle time when cycle time data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        cycleTimeList: null,
      });

      render(
        <Provider store={setupStore()}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      expect(screen.queryAllByText('Cycle Time').length).toEqual(0);
    });
  });

  describe('Classification', () => {
    it('should show classifications when classifications data is existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        classification: [
          { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] },
          { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: 2 }] },
          { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: 3 }] },
          { id: 3, name: 'name4', valuesList: [{ name: 'test4', value: 4 }] },
        ],
      });
      const store = setupStore();
      store.dispatch(updateMetrics(REQUIRED_DATA_LIST));

      render(
        <Provider store={store}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      const classificationTable = screen.getByTestId('Classification');
      expect(screen.getByText('Classification')).toBeInTheDocument();
      expect(classificationTable).toBeInTheDocument();
      expect(within(classificationTable).queryAllByTestId('tr').length).toBe(8);
    });

    it('should not show classifications when classifications data is not existing', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        classification: null,
      });

      render(
        <Provider store={setupStore()}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
        </Provider>,
      );

      expect(screen.queryAllByText('Classification').length).toEqual(0);
    });

    it('should show error notification when only selecting classification and having errorMessage', () => {
      (reportMapper as jest.Mock).mockReturnValue({
        classification: null,
      });
      const store = setupStore();
      store.dispatch(updateMetrics([REQUIRED_DATA_LIST[3]]));

      render(
        <Provider store={store}>
          <BoardDetail data={data} onBack={() => 'back'} errorMessage={'Data loading failed'} />
        </Provider>,
      );

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_GET_CLASSIFICATION_DATA,
        type: 'error',
      });
      expect(screen.getByText('Data loading failed')).toBeInTheDocument();
    });
  });

  it('should show all data when all data is existing', () => {
    (reportMapper as jest.Mock).mockReturnValue({
      velocityList: [{ id: 0, name: 'name1', valueList: [{ value: 1 }] }],
      cycleTimeList: [
        { id: 0, name: 'name1', valueList: [{ value: 1 }] },
        { id: 1, name: 'name2', valueList: [{ value: 2 }] },
      ],
      classification: [
        { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] },
        { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: 2 }] },
        { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: 3 }] },
      ],
    });
    const store = setupStore();
    store.dispatch(updateMetrics(REQUIRED_DATA_LIST));

    render(
      <Provider store={store}>
        <BoardDetail data={data} onBack={() => 'back'} errorMessage={''} />
      </Provider>,
    );

    const velocityTable = screen.getByTestId('Velocity');
    const cycleTimeTable = screen.getByTestId('Cycle Time');
    const classificationTable = screen.getByTestId('Classification');
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(velocityTable).toBeInTheDocument();
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
    expect(cycleTimeTable).toBeInTheDocument();
    expect(screen.getByText('Classification')).toBeInTheDocument();
    expect(classificationTable).toBeInTheDocument();

    expect(within(velocityTable).queryAllByTestId('tr').length).toBe(1);
    expect(within(cycleTimeTable).queryAllByTestId('tr').length).toBe(2);
    expect(within(classificationTable).queryAllByTestId('tr').length).toBe(6);
  });
});
