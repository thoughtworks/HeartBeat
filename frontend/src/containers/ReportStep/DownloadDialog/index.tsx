import {
  CloseButton,
  DialogContainer,
  StyledButton,
  StyledCalendarToday,
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledFormControlLabel,
  StyledFormGroup,
  TimePeriodSelectionMessage,
  tooltipModifiers,
} from '@src/containers/ReportStep/DownloadDialog/style';
import { DISABLED_DATE_RANGE_MESSAGE } from '@src/constants/resources';
import { COMMON_BUTTONS } from '@src/constants/commons';
import { Checkbox, Tooltip } from '@mui/material';
import { formatDate } from '@src/utils/util';
import React, { useState } from 'react';

interface DownloadDialogProps {
  isShowDialog: boolean;
  handleClose: () => void;
  dateRangeList: DateRangeItem[];
  downloadCSVFile: (startDate: string, endDate: string) => void;
  title: string;
}

export interface DateRangeItem {
  startDate: string;
  endDate: string;
  disabled: boolean;
}

export const DownloadDialog = ({
  isShowDialog,
  handleClose,
  dateRangeList,
  downloadCSVFile,
  title,
}: DownloadDialogProps) => {
  const [selectedRangeItems, setSelectedRangeItems] = useState<DateRangeItem[]>([]);
  const confirmButtonDisabled = selectedRangeItems.length === 0;

  const handleChange = (targetItem: DateRangeItem) => {
    if (selectedRangeItems.includes(targetItem)) {
      setSelectedRangeItems(selectedRangeItems.filter((item) => targetItem !== item));
    } else {
      setSelectedRangeItems([...selectedRangeItems, targetItem]);
    }
  };

  const handleDownload = () => {
    selectedRangeItems.forEach((item) => {
      downloadCSVFile(item.startDate, item.endDate);
    });
    handleClose();
  };

  const getLabel = (item: DateRangeItem) => {
    if (item.disabled) {
      return (
        <Tooltip
          arrow
          title={DISABLED_DATE_RANGE_MESSAGE}
          placement={'top-end'}
          slotProps={{
            popper: tooltipModifiers,
          }}
        >
          <span>{`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}</span>
        </Tooltip>
      );
    } else {
      return `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
    }
  };

  return (
    <StyledDialog open={isShowDialog} maxWidth='md'>
      <DialogContainer>
        <StyledDialogTitle>
          <strong>Export {title} Data</strong>
          <CloseButton onClick={handleClose} />
        </StyledDialogTitle>
        <StyledDialogContent dividers>
          <TimePeriodSelectionMessage>
            <StyledCalendarToday />
            <strong>Select the time period</strong>
          </TimePeriodSelectionMessage>
          <StyledFormGroup>
            {dateRangeList.map((item) => (
              <StyledFormControlLabel
                key={item.startDate}
                control={<Checkbox onChange={() => handleChange(item)} />}
                label={getLabel(item)}
                checked={selectedRangeItems.includes(item)}
                disabled={item.disabled}
              />
            ))}
          </StyledFormGroup>
          <StyledButton variant='contained' onClick={handleDownload} disabled={confirmButtonDisabled}>
            {COMMON_BUTTONS.CONFIRM}
          </StyledButton>
        </StyledDialogContent>
      </DialogContainer>
    </StyledDialog>
  );
};
