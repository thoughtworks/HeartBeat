import configReducer, {
  updateCalendarType,
  updateDateRange,
  updateProjectName,
  updateRequiredData,
} from '@src/features/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR, VELOCITY } from '../fixtures'

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
    expect(config.dateRange).toEqual({ startDate: null, endDate: null })
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
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
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
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
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
      },
      updateDateRange({ startDate: today, endDate: null })
    )

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual(null)
  })

  it('should update required data when change require data selections', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
      },
      updateRequiredData([VELOCITY])
    )

    expect(config.requiredData).toEqual([VELOCITY])
  })
})
