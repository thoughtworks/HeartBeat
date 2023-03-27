import configReducer, {
  updateCalendarType,
  updateDateRange,
  updateProjectName,
  updateMetrics,
  updateBasicConfigState,
} from '@src/context/config/configSlice'
import { CHINA_CALENDAR, MOCK_IMPORT_FILE, REGULAR_CALENDAR, VELOCITY } from '../fixtures'
import initialConfigState from '../initialConfigState'
import updatedConfigState from '../updatedConfigState'

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' }).basicConfigState

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
    expect(config.dateRange).toEqual({ startDate: '', endDate: '' })
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(initialConfigState, updateProjectName('mock project name')).basicConfigState

    expect(config.projectName).toEqual('mock project name')
  })

  it('should update calendar when change calendar types', () => {
    const config = configReducer(initialConfigState, updateCalendarType(CHINA_CALENDAR)).basicConfigState

    expect(config.calendarType).toEqual(CHINA_CALENDAR)
  })

  it('should update date range when change date', () => {
    const today = new Date().getMilliseconds()
    const config = configReducer(
      initialConfigState,
      updateDateRange({ startDate: today, endDate: '' })
    ).basicConfigState

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual('')
  })

  it('should update config when import file', () => {
    const config = configReducer(initialConfigState, updateBasicConfigState(MOCK_IMPORT_FILE))

    expect(config).toEqual(updatedConfigState)
  })

  it('should update required data when change require data selections', () => {
    const config = configReducer(initialConfigState, updateMetrics([VELOCITY])).basicConfigState

    expect(config.metrics).toEqual([VELOCITY])
  })
})
