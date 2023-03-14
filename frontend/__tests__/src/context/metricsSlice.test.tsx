import saveMetricsSettingReducer, { updateTargetFields, updateUsers } from '@src/context/Metrics/metricsSlice'

describe('saveMetricsSetting reducer', () => {
  it('should show empty array when handle initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(undefined, { type: 'unknown' })

    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.targetFields).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
  })

  it('should store updated targetFields when its value changed', () => {
    const mockUpdatedTargetFields = {
      targetFields: [
        { key: 'issuetype', name: 'Issue Type', flag: true },
        { key: 'parent', name: 'Parent', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
        { key: 'project', name: 'Project', flag: false },
        { key: 'reporter', name: 'Reporter', flag: false },
        { key: 'customfield_10021', name: 'Flagged', flag: false },
        { key: 'fixVersions', name: 'Fix versions', flag: false },
        { key: 'customfield_10000', name: 'Development', flag: false },
        { key: 'priority', name: 'Priority', flag: false },
        { key: 'customfield_10037', name: 'Partner', flag: false },
        { key: 'labels', name: 'Labels', flag: false },
        { key: 'timetracking', name: 'Time tracking', flag: false },
        { key: 'customfield_10015', name: 'Start date', flag: false },
        { key: 'customfield_10016', name: 'Story point estimate', flag: false },
        { key: 'customfield_10038', name: 'QA', flag: false },
        { key: 'customfield_10019', name: 'Rank', flag: false },
        { key: 'assignee', name: 'Assignee', flag: false },
        { key: 'customfield_10017', name: 'Issue color', flag: false },
        { key: 'customfield_10027', name: 'Feature/Operation', flag: false },
      ],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      { jiraColumns: [], targetFields: [], users: [] },
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
      { jiraColumns: [], targetFields: [], users: [] },
      updateUsers({
        users: mockUpdatedUsers.users,
      })
    )

    expect(savedMetricsSetting.users).toEqual(mockUpdatedUsers)
  })
})
