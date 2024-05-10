import {
  CloseButton,
  DialogContainer,
  StyledButton,
  StyledCalendarToday,
  StyledDialogContent,
  StyledDialogTitle,
  StyledFormControlLabel,
  StyledFormGroup,
  TimePeriodSelectionMessage,
  tooltipModifiers,
} from '@src/containers/ReportStep/DownloadDialog/style';
import { DISABLED_DATE_RANGE_MESSAGE } from '@src/constants/resources';
import { Checkbox, Dialog, Tooltip } from '@mui/material';
import { COMMON_BUTTONS } from '@src/constants/commons';
import { formatDate } from '@src/utils/util';
import React, { useState } from 'react';

interface DownloadDialogProps {
  isShowDialog: boolean;
  handleClose: () => void;
  dateRangeList: DateRangeItem[];
  downloadCSVFile: (startDate: string, endDate: string) => void;
}

export interface DateRangeItem {
  startDate: string;
  endDate: string;
  disabled: boolean;
}

export const DownloadDialog = ({ isShowDialog, handleClose, dateRangeList, downloadCSVFile }: DownloadDialogProps) => {
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
    <Dialog open={isShowDialog} maxWidth='md'>
      <DialogContainer>
        <StyledDialogTitle>
          <strong>Export Board Data</strong>
          <CloseButton onClick={handleClose} />
        </StyledDialogTitle>
        <StyledDialogContent dividers>
          <TimePeriodSelectionMessage>
            <StyledCalendarToday />
            <strong>Select the time period for the exporting data</strong>
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
    </Dialog>
  );
};
