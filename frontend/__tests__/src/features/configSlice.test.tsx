import configReducer, {
  updateBoardFields,
  updateCalendarType,
  updateDateRange,
  updatePipelineToolFields,
  updateProjectName,
  updateRequiredData,
} from '@src/features/config/configSlice'
import { CHINA_CALENDAR, REGULAR_CALENDAR, VELOCITY } from '../fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'

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
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
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
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
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
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
          token: '',
        },
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
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
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
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
          token: '',
        },
      },
      updateBoardFields({ boardId: '1' })
    )
    expect(config.boardFields.boardId).toEqual('1')
  })

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(
      {
        projectName: '',
        calendarType: REGULAR_CALENDAR,
        dateRange: { startDate: null, endDate: null },
        requiredData: [],
        boardFields: {
          board: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        },
        pipelineToolFields: {
          pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
          token: '',
        },
        sourceControlFields: {
          sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB,
          token: '',
        },
      },
      updatePipelineToolFields({ token: 'abcd' })
    )
    expect(config.pipelineToolFields.token).toEqual('abcd')
  })
})
