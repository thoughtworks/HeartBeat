import configReducer, { updateCalendarType, updateProjectName } from '@src/features/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '../fixtures'

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
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
      },
      updateCalendarType(CHINA_CALENDAR)
    )

    expect(config.calendarType).toEqual(CHINA_CALENDAR)
  })
})
