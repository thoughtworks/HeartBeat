import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

export const exportValidityTimeMapper = (exportValidityTime?: number) => {
  dayjs.extend(duration)
  const timestamp = exportValidityTime ? exportValidityTime : undefined
  return timestamp ? dayjs.duration(timestamp).asMinutes() : undefined
}
