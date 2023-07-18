export interface OriginBuildKiteEmoji {
  name: string
  image: string
  aliases: string[]
}

export interface CleanedBuildKiteEmoji {
  image: string
  aliases: string[]
}

const EMOJI_URL_PREFIX = 'https://buildkiteassets.com/emojis/'

export const transformToCleanedBuildKiteEmoji = (input: OriginBuildKiteEmoji[]): CleanedBuildKiteEmoji[] =>
  input.map(({ name, image, aliases }) => ({
    image,
    aliases: [...new Set([...aliases, name])],
  }))

const getEmojiNames = (input: string): string[] => {
  const regex = /:([\w+-]+):/g
  const matches = input.match(regex) || []
  return matches.map((match) => match.replaceAll(':', ''))
}

export const getEmojiUrls = (input: string, emojis: CleanedBuildKiteEmoji[]): string[] => {
  const names = getEmojiNames(input)
  return names.flatMap((name) => {
    const emojiImage: string | undefined = emojis.find(({ aliases }) => aliases.includes(name))?.image
    return emojiImage ? `${EMOJI_URL_PREFIX}${emojiImage}` : ''
  })
}

export const removeExtraEmojiName = (input: string): string => {
  const names = getEmojiNames(input)
  names.map((name) => {
    input = input.replaceAll(name, '')
  })
  return input.replaceAll(':', '')
}
