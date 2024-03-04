import {
  CollectionDateContainer,
  GreyTransitionBox,
  TextBox,
  DateText,
  MonthYearText,
  DateTitle,
  ColoredTopArea,
} from '@src/components/Common/CollectionDuration/style';
import dayjs from 'dayjs';

type Props = {
  startDate: string;
  endDate: string;
};

type DisplayedDateInfo = {
  year: string;
  month: string;
  day: string;
};

type DateInformation = {
  formattedDate: DisplayedDateInfo;
  dateTittle: string;
};

const CollectionDuration = ({ startDate, endDate }: Props) => {
  const toBeFormattedStartDate = dayjs(startDate);
  const toBeFormattedEndDate = dayjs(endDate);
  const startDateInfo: DisplayedDateInfo = {
    year: toBeFormattedStartDate.format('YY'),
    month: toBeFormattedStartDate.format('MMM'),
    day: toBeFormattedStartDate.format('DD'),
  };
  const endDateInfo: DisplayedDateInfo = {
    year: toBeFormattedEndDate.format('YY'),
    month: toBeFormattedEndDate.format('MMM'),
    day: toBeFormattedEndDate.format('DD'),
  };

  const DateDisplay = (props: DateInformation) => {
    const { dateTittle, formattedDate } = props;
    return (
      <div>
        <DateTitle isStart={dateTittle === 'START'}>{dateTittle}</DateTitle>
        <ColoredTopArea isStart={dateTittle === 'START'} />
        <TextBox>
          <DateText>{formattedDate.day}</DateText>
          <MonthYearText>
            {formattedDate.month} {formattedDate.year}
          </MonthYearText>
        </TextBox>
      </div>
    );
  };

  return (
    <CollectionDateContainer>
      <DateDisplay dateTittle='START' formattedDate={startDateInfo} />
      <GreyTransitionBox />
      <DateDisplay dateTittle='END' formattedDate={endDateInfo} />
    </CollectionDateContainer>
  );
};

export default CollectionDuration;
