import { CleanedBuildKiteEmoji, OriginBuildKiteEmoji } from '@src/emojis/emoji'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION } from '@src/constants'
import React from 'react'

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

export const handleApiRequest = async <T>(
  apiCall: () => Promise<T>,
  errorHandler: (err: Error) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsServerError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  setIsLoading(true)
  try {
    return await apiCall()
  } catch (e) {
    const err = e as Error
    if (err.message === UNKNOWN_EXCEPTION) {
      setIsServerError(true)
    } else {
      errorHandler(err)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
    }
  } finally {
    setIsLoading(false)
  }
}
