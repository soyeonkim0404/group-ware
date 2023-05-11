import styled from 'styled-components';

const SFlagItem = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.black};
  background: ${(p) => p.theme.gray50};
`;

const SFlagRed = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.white};
  background: ${(p) => p.theme.red};
`;

const SFlagBlue = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.white};
  background: ${(p) => p.theme.blue};
`;

const SFlagOrange = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.white};
  background: ${(p) => p.theme.orange};
`;

const SFlagGreen = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.white};
  background: ${(p) => p.theme.green};
`;

const SFlagGray = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  line-height: 12px;
  box-sizing: border-box;
  color: ${(p) => p.theme.gray40};
  background: ${(p) => p.theme.gray80};
`;

const SFlagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -2.5px;
  span {
    margin: 2.5px;
  }
`;

const Group = ({ children }) => {
  return <SFlagGroup>{children}</SFlagGroup>;
};

const Red = ({ children }) => {
  return <SFlagRed>{children}</SFlagRed>;
};

const Blue = ({ children }) => {
  return <SFlagBlue>{children}</SFlagBlue>;
};

const Orange = ({ children }) => {
  return <SFlagOrange>{children}</SFlagOrange>;
};

const Green = ({ children }) => {
  return <SFlagGreen>{children}</SFlagGreen>;
};

const Gray = ({ children }) => {
  return <SFlagGray>{children}</SFlagGray>;
};

const Flag = ({ children }) => {
  return <SFlagItem>{children}</SFlagItem>;
};

Flag.Group = Group;
Flag.Red = Red;
Flag.Blue = Blue;
Flag.Orange = Orange;
Flag.Green = Green;
Flag.Gray = Gray;

export default Flag;
