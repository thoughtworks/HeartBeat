import configReducer, {
  updateCalendarType,
  updateDateRange,
  updateProjectName,
  updateMetrics,
} from '@src/context/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR, VELOCITY } from '../fixtures'
import initialConfigState from '../initialConfigState'

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
    expect(config.dateRange).toEqual({ startDate: '', endDate: '' })
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(initialConfigState, updateProjectName('mock project name'))

    expect(config.projectName).toEqual('mock project name')
  })

  it('should update calendar when change calendar types', () => {
    const config = configReducer(initialConfigState, updateCalendarType(CHINA_CALENDAR))

    expect(config.calendarType).toEqual(CHINA_CALENDAR)
  })

  it('should update date range when change date', () => {
    const today = new Date().getMilliseconds()
    const config = configReducer(initialConfigState, updateDateRange({ startDate: today, endDate: '' }))

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual('')
  })

  it('should update required data when change require data selections', () => {
    const config = configReducer(initialConfigState, updateMetrics([VELOCITY]))

    expect(config.metrics).toEqual([VELOCITY])
  })
})
