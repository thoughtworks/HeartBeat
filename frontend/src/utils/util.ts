import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/emojis/emoji'

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

export const transformToCleanedBuildKiteEmoji = (input: OriginBuildKiteEmoji[]): CleanedBuildKiteEmoji[] =>
  input.map(({ name, image, aliases }) => ({
    image,
    aliases: [...new Set([...aliases, name])],
  }))
