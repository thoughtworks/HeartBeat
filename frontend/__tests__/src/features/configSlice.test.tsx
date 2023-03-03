import configReducer, {
  updateBoardFields,
  updateCalendarType,
  updateDateRange,
  updateProjectName,
  updateRequiredData,
} from '@src/context/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR, VELOCITY } from '../fixtures'
import { BOARD_TYPES } from '@src/constants'

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
    expect(config.dateRange).toEqual({ startDate: '', endDate: '' })
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: '', endDate: '' },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
      },
      updateProjectName('mock project name')
    )

    expect(config.projectName).toEqual('mock project name')
  })

  it('should update calendar when change calendar types', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: '', endDate: '' },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
      },
      updateCalendarType(CHINA_CALENDAR)
    )

    expect(config.calendarType).toEqual(CHINA_CALENDAR)
  })

  it('should update date range when change date', () => {
    const today = new Date().getMilliseconds()
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: '', endDate: '' },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
      },
      updateDateRange({ startDate: today, endDate: '' })
    )

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual('')
  })

  it('should update required data when change require data selections', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: '', endDate: '' },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
      },
      updateRequiredData([VELOCITY])
    )

    expect(config.requiredData).toEqual([VELOCITY])
  })

  it('should update board fields when change board fields input', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: '', endDate: '' },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
      },
      updateBoardFields({ boardId: '1' })
    )
    expect(config.boardFields.boardId).toEqual('1')
  })
})
