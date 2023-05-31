export const exportToJsonFile = (filename: string, json: object) => {
  const dataStr = JSON.stringify(json, null, 4)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
  const exportFileDefaultName = `${filename}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}
