import styled from "@emotion/styled";

/** 화면 배치에 영향을 주지 않고 보조기기에 텍스트를 제공한다. */
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export default VisuallyHidden;
