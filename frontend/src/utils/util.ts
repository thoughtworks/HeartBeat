export const exportToJsonFile = (filename: string, json: object) => {
  const dataStr = JSON.stringify(json, null, 4)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
  const exportFileDefaultName = `${filename}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const downloadCSV = (filename: string, data: string) => {
  const blob = new Blob([data], { type: 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export interface BuildKiteEmoji {
  name: string
  url: string
  aliases?: string[]
}

export const getEmojiUrls = (input: string, emojis: BuildKiteEmoji[]): string[] => {
  const names = getEmojiNames(input)
  return names.flatMap((name) => {
    const emoji: BuildKiteEmoji = emojis.find((emoji) => emoji.name === name) as BuildKiteEmoji
    return emoji.url
  })
}

export const getEmojiNames = (input: string): string[] => {
  const regex = /:([\w+-]+):/g
  const matches = input.match(regex) || []
  return matches.map((match) => match.replaceAll(':', ''))
}

export const removeExtraEmojiName = (input: string): string => {
  const names = getEmojiNames(input)
  names.map((name) => {
    input = input.replaceAll(name, '')
  })
  return input.replaceAll(':', '')
}
