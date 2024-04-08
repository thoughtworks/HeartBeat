import dayjs from 'dayjs';

const format = (date: string) => dayjs(date).format('MM/DD/YYYY');

export { format };
