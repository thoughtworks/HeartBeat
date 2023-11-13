import {
  exportToJsonFile,
  findCaseInsensitiveType,
  getJiraBoardToken,
  transformToCleanedBuildKiteEmoji,
} from '@src/utils/util'
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/emojis/emoji'
import { EMPTY_STRING, PIPELINE_TOOL_TYPES } from '@src/constants'

describe('exportToJsonFile function', () => {
  it('should create a link element with the correct attributes and click it', () => {
    const filename = 'test'
    const json = { key: 'value' }
    const documentCreateSpy = jest.spyOn(document, 'createElement')

    exportToJsonFile(filename, json)

    expect(documentCreateSpy).toHaveBeenCalledWith('a')
  })
})

describe('transformToCleanedBuildKiteEmoji function', () => {
  it('should transform to cleaned emoji', () => {
    const mockOriginEmoji: OriginBuildKiteEmoji = {
      name: 'zap',
      image: 'abc.com',
      aliases: [],
    }

    const expectedCleanedEmoji: CleanedBuildKiteEmoji = {
      image: 'abc.com',
      aliases: ['zap'],
    }

    const [result] = transformToCleanedBuildKiteEmoji([mockOriginEmoji])

    expect(result).toEqual(expectedCleanedEmoji)
  })
})

describe('getJiraToken function', () => {
  it('should return an valid string when token is not empty string', () => {
    const email = 'test@example.com'
    const token = 'myToken'

    const jiraToken = getJiraBoardToken(token, email)
    const encodedMsg = `Basic ${btoa(`${email}:${token}`)}`

    expect(jiraToken).toBe(encodedMsg)
  })

  it('should return an empty string when token is missing', () => {
    const email = 'test@example.com'
    const token = ''

    const jiraToken = getJiraBoardToken(token, email)

    expect(jiraToken).toBe('')
  })
})

describe('findCaseInsensitiveType function', () => {
  it('Should return "BuildKite" when passing a type given case insensitive input bUildkite', () => {
    const selectedValue = 'bUildkite'
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue)
    expect(value).toBe(PIPELINE_TOOL_TYPES.BUILD_KITE)
  })

  it('Should return "GoCD" when passing a type given case sensitive input GoCD', () => {
    const selectedValue = 'GoCD'
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue)
    expect(value).toBe(PIPELINE_TOOL_TYPES.GO_CD)
  })

  it('Should return "GoCD" when passing a type given case insensitive input Gocd', () => {
    const selectedValue = 'Gocd'
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue)
    expect(value).toBe(PIPELINE_TOOL_TYPES.GO_CD)
  })

  it('Should return "_BuildKite" when passing a type given the value mismatches with PIPELINE_TOOL_TYPES', () => {
    const selectedValue = '_BuildKite'
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue)
    expect(value).not.toBe(PIPELINE_TOOL_TYPES.BUILD_KITE)
    expect(value).not.toBe(PIPELINE_TOOL_TYPES.GO_CD)
    expect(value).toBe(selectedValue)
  })

  it('Should return empty string when passing a type given empty string', () => {
    const selectedValue = ''
    const value = findCaseInsensitiveType(Object.values(PIPELINE_TOOL_TYPES), selectedValue)
    expect(value).toBe(EMPTY_STRING)
  })
})
