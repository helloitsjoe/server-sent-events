import styled from 'styled-components';
import {
  color,
  space,
  layout,
  border,
  flexbox,
  typography,
  position,
} from 'styled-system';

const Box = styled.div`
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
  ${typography}
  ${position}
`;

export const SpacedBox = styled(Box)`
  & > * {
    margin-bottom: 1em;
  }
`;

export default Box;
