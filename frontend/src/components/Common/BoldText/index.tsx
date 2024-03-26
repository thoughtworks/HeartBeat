import { StyledBoldText } from '@src/components/Common/BoldText/style';

const BoldText = ({ children }: { children: React.ReactNode }) => {
  return <StyledBoldText>{children}</StyledBoldText>;
};

export default BoldText;
