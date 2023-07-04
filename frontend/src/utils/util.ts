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

export const getEmojiName = (text: string): string | null => {
  const regex = /:([\w+-]+):/
  const matches = regex.exec(text)
  if (matches && matches.length >= 2) {
    return matches[1].trim()
  }
  return null
}

export const removeEmojiNameFromInput = (text: string): string | null => {
  return text
    .replace(getEmojiName(text) || '', '')
    .replace(':', '')
    .replace(':', '')
}
