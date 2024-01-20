import { MetricSelectionWrapper } from '@src/containers/MetricsStep/style';
import { tableCellClasses } from '@mui/material/TableCell';
import { TableCell, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const Container = styled(MetricSelectionWrapper)({});

export const Row = styled(TableRow)({});
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.dark,
    fontWeight: 600,
  },
}));

export const BorderTableCell = styled(TableCell)(() => ({
  border: `0.06rem solid ${theme.palette.secondary.dark}`,
  borderRight: 'none',
  color: theme.palette.secondary.contrastText,
}));

export const ColumnTableCell = styled(BorderTableCell)(() => ({
  borderLeft: 'none',
}));
