import saveMetricsSettingReducer, {
  savedBoardColumns,
  updateTargetFields,
  updateUsers,
} from '@src/context/Metrics/metricsSlice'

describe('saveMetricsSetting reducer', () => {
  it('should show empty array when handle initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(undefined, { type: 'unknown' })

    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.targetFields).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
    expect(savedMetricsSetting.boardColumns).toEqual([])
  })

  it('should store updated targetFields when its value changed', () => {
    const mockUpdatedTargetFields = {
      targetFields: [
        { key: 'issuetype', name: 'Issue Type', flag: true },
        { key: 'parent', name: 'Parent', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
      ],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      { jiraColumns: [], targetFields: [], users: [], boardColumns: [] },
      updateTargetFields({
        targetFields: mockUpdatedTargetFields.targetFields,
      })
    )

    expect(savedMetricsSetting.targetFields).toEqual(mockUpdatedTargetFields)
    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
  })

  it('should store updated users when its value changed', () => {
    const mockUpdatedUsers = {
      users: ['userOne', 'userTwo', 'userThree'],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      { jiraColumns: [], targetFields: [], users: [], boardColumns: [] },
      updateUsers({
        users: mockUpdatedUsers.users,
      })
    )

    expect(savedMetricsSetting.users).toEqual(mockUpdatedUsers)
  })

  it('should store saved boardColumns when its value changed', () => {
    const mockSavedBoardColumns = {
      boardColumns: [{ name: 'TODO', value: 'To do' }],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      { jiraColumns: [], targetFields: [], users: [], boardColumns: [] },
      savedBoardColumns({
        boardColumns: mockSavedBoardColumns.boardColumns,
      })
    )

    expect(savedMetricsSetting.boardColumns).toEqual(mockSavedBoardColumns)
  })
})
