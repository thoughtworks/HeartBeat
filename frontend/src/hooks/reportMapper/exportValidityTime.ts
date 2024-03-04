import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

export const exportValidityTimeMapper = (exportValidityTime: number | null) => {
  dayjs.extend(duration);
  const timestamp = exportValidityTime ? exportValidityTime : null;
  return timestamp ? dayjs.duration(timestamp).asMinutes() : null;
};
