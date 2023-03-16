import jiraVerifyResponseReducer, {
  updateJiraVerifyResponse,
} from '@src/context/config/board/jiraVerifyResponse/jiraVerifyResponseSlice'

describe('jiraVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const jiraVerifyResponse = jiraVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(jiraVerifyResponse.jiraColumns).toEqual([])
    expect(jiraVerifyResponse.targetFields).toEqual([])
    expect(jiraVerifyResponse.users).toEqual([])
  })

  it('should store jiraColumns,targetFields,users data when get network jira verify response', () => {
    const mockJiraVerifyResponse = {
      jiraColumns: [
        { key: 'indeterminate', value: { name: 'Doing', statuses: ['DOING'] } },
        { key: 'indeterminate', value: { name: 'TODO', statuses: ['TODO'] } },
        { key: 'indeterminate', value: { name: 'Testing', statuses: ['TESTING'] } },
        { key: 'indeterminate', value: { name: 'Blocked', statuses: ['BLOCKED'] } },
        { key: 'done', value: { name: 'Done', statuses: ['DONE', 'CANCELLED'] } },
      ],
      users: ['A', 'B', 'C'],
      targetFields: [
        { key: 'issuetype', name: '事务类型', flag: false },
        { key: 'parent', name: '父级', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
        { key: 'project', name: '项目', flag: false },
        { key: 'customfield_10021', name: 'Flagged', flag: false },
        { key: 'fixVersions', name: '修复版本', flag: false },
        { key: 'customfield_10000', name: 'development', flag: false },
        { key: 'priority', name: '优先级', flag: false },
        { key: 'customfield_10037', name: 'Partner', flag: false },
        { key: 'labels', name: '标签', flag: false },
        { key: 'timetracking', name: '时间跟踪', flag: false },
        { key: 'customfield_10015', name: 'Start date', flag: false },
        { key: 'customfield_10016', name: 'Story point estimate', flag: false },
        { key: 'customfield_10038', name: 'QA', flag: false },
        { key: 'customfield_10019', name: 'Rank', flag: false },
        { key: 'assignee', name: '经办人', flag: false },
        { key: 'customfield_10017', name: 'Issue color', flag: false },
        { key: 'customfield_10027', name: 'Feature/Operation', flag: false },
      ],
    }

    const jiraVerifyResponse = jiraVerifyResponseReducer(
      { jiraColumns: [], targetFields: [], users: [] },
      updateJiraVerifyResponse({
        jiraColumns: mockJiraVerifyResponse.jiraColumns,
        targetFields: mockJiraVerifyResponse.targetFields,
        users: mockJiraVerifyResponse.users,
      })
    )

    expect(jiraVerifyResponse.jiraColumns).toEqual(mockJiraVerifyResponse.jiraColumns)
    expect(jiraVerifyResponse.targetFields).toEqual(mockJiraVerifyResponse.targetFields)
    expect(jiraVerifyResponse.users).toEqual(mockJiraVerifyResponse.users)
  })
})
