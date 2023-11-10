import { exportToJsonFile, getJiraBoardToken, transformToCleanedBuildKiteEmoji } from '@src/utils/util'
import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/emojis/emoji'

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
