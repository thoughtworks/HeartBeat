import configReducer, { updateCalendarType, updateDateRange, updateProjectName } from '@src/features/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '../fixtures'

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
      },
      updateDateRange({ startDate: today, endDate: null })
    )

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual(null)
  })
})
