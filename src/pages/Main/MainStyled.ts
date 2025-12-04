import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 393px;
    height: 100vh;
    position: relative;
`;
export const Toggle = styled.div`
  position: absolute;     // ★절대 위치
  top: 60px;              // DateHeader 아래 원하는 위치
  right: 20px;            // 오른쪽 아이콘 기준 위치
  z-index: 999;

  display: inline-flex;
  padding: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;

  border-radius: 10px;
  background: #FFF;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.61);
`;


export const ToggleBtn = styled.div`
cursor: pointer;
color: #959595;
&:hover {
    color: black;    
}
;
`;