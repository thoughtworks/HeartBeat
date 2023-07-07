import { BuildKiteEmoji, exportToJsonFile, getEmojiNames, getEmojiUrls, removeExtraEmojiName } from '@src/utils/util'

describe('exportToJsonFile function', () => {
  test('it should create a link element with the correct attributes and click it', () => {
    const filename = 'test'
    const json = { key: 'value' }
    const documentCreateSpy = jest.spyOn(document, 'createElement')

    exportToJsonFile(filename, json)

    expect(documentCreateSpy).toHaveBeenCalledWith('a')
  })
})

describe('getEmojiName function', () => {
  test('it should get single emoji name', () => {
    const input = ':zap: one emoji'

    const expectName = ['zap']

    expect(getEmojiNames(input)).toEqual(expectName)
  })

  test('it should get multl-emoji names', () => {
    const input = ':zap: :wws: two emoji'

    const expectName = ['zap', 'wws']

    expect(getEmojiNames(input)).toEqual(expectName)
  })

  test('it should get empty names', () => {
    const input = 'no emoji '

    expect(getEmojiNames(input)).toEqual([])
  })
})

describe('getEmojiUrl function', () => {
  test('it should get empty urls', () => {
    const input = 'one emoji'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'zap1',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual([])
  })

  test('it should get single emoji url', () => {
    const input = ':zap: one emoji'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'zap1',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual(['https://example.com/abc.png'])
  })

  test('it should get muilt-emoji urls', () => {
    const input = ':zap: :www:one emoji'
    const emojis: BuildKiteEmoji[] = [
      {
        name: 'zap',
        url: 'https://example.com/abc.png',
        aliases: [],
      },
      {
        name: 'www',
        url: 'https://example2.com/abc.png',
        aliases: [],
      },
      {
        name: 'fff',
        url: 'https://example3.com/abc.png',
        aliases: [],
      },
    ]

    expect(getEmojiUrls(input, emojis)).toEqual(['https://example.com/abc.png', 'https://example2.com/abc.png'])
  })

  test('it should remove extra emoji names', () => {
    const input = ':zap: :www:one emoji'

    expect(removeExtraEmojiName(input)).toEqual(' one emoji')
  })
})
