import configReducer, {
  updateCalendarType,
  updateDateRange,
  updateProjectName,
  updateMetrics,
  updatePipelineToolFields,
  updateSourceControlFields,
} from '@src/context/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR, VELOCITY } from '../fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'

const initState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: '',
    endDate: '',
  },
  metrics: [],
  boardConfig: {
    type: BOARD_TYPES.JIRA,
    boardId: '',
    email: '',
    projectKey: '',
    site: '',
    token: '',
  },
  isBoardVerified: false,
  pipelineToolFields: {
    pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  sourceControlFields: {
    sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
}

describe('config reducer', () => {
  it('should be default value when init render config page', () => {
    const config = configReducer(undefined, { type: 'unknown' })

    expect(config.projectName).toEqual('')
    expect(config.calendarType).toEqual(REGULAR_CALENDAR)
    expect(config.dateRange).toEqual({ startDate: '', endDate: '' })
  })

  it('should update project name when change project name input', () => {
    const config = configReducer(initState, updateProjectName('mock project name'))

    expect(config.projectName).toEqual('mock project name')
  })

  it('should update calendar when change calendar types', () => {
    const config = configReducer(initState, updateCalendarType(CHINA_CALENDAR))

    expect(config.calendarType).toEqual(CHINA_CALENDAR)
  })

  it('should update date range when change date', () => {
    const today = new Date().getMilliseconds()
    const config = configReducer(initState, updateDateRange({ startDate: today, endDate: '' }))

    expect(config.dateRange.startDate).toEqual(today)
    expect(config.dateRange.endDate).toEqual('')
  })

  it('should update required data when change require data selections', () => {
    const config = configReducer(initState, updateMetrics([VELOCITY]))

    expect(config.metrics).toEqual([VELOCITY])
  })

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(initState, updatePipelineToolFields({ token: 'abcd' }))

    expect(config.pipelineToolFields.token).toEqual('abcd')
  })

  it('should update sourceControl fields when change sourceControl fields input', () => {
    const config = configReducer(initState, updateSourceControlFields({ token: 'token' }))

    expect(config.sourceControlFields.token).toEqual('token')
  })
})
