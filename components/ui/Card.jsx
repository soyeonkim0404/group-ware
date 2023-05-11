import PropTypes from 'prop-types';
import styled from 'styled-components';

const Head = ({ children }) => {
  return <SCardHead>{children}</SCardHead>;
};

const Title = ({ children }) => {
  return <SCardTitle>{children}</SCardTitle>;
};

const Body = ({ children }) => {
  return <SCardBody className="card-body">{children}</SCardBody>;
};

export const CardLayout = ({ children }) => {
  return <SCardRow className="card-layout">{children}</SCardRow>;
};

function Card({ children, col, type }) {
  return (
    <div className={`card col-${col}`}>
      <SCardStyled className="card-inner" type={type}>
        {children}
      </SCardStyled>
    </div>
  );
}

const SCardRow = styled.div`
  --pc-gap-x: 15px;
  --pc-gap-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--pc-gap-y));
  margin-right: calc(-0.5 * var(--pc-gap-x));
  margin-left: calc(-0.5 * var(--pc-gap-x));
  > * {
    --pc-gap-x: 35px;
    --pc-gap-y: 35px;
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    padding-right: calc(var(--pc-gap-x) * 0.5);
    padding-left: calc(var(--pc-gap-x) * 0.5);
    margin-top: var(--pc-gap-y);
    box-sizing: border-box;
    .mobile & {
      padding-right: 0;
      padding-left: 0;
    }
  }
  &:first-child {
    margin-top: -35px;
  }
  .mobile & {
    margin-right: 0;
    margin-left: 0;
  }
  form & {
    &:first-child {
      margin-top: 0;
    }
  }
`;

const SCardStyled = styled.div`
  max-width: 100%;
  border-radius: 20px;
  background: ${(props) => (props.type === 'clean' ? 'transparent' : props.theme.white)};
  box-shadow: ${(props) => (props.type === 'clean' ? 'none' : props.theme.boxShadow)};
  box-sizing: border-box;
  min-height: 100px;
  padding: 30px;
  .mobile & {
    padding: 20px;
  }
`;

const SCardHead = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(p) => p.theme.gray70};
`;

const SCardTitle = styled.div`
  font-weight: 700;
  font-size: 25px;
`;

const SCardBody = styled.div`
  /*min-height: 100px;*/
  box-sizing: border-box;
  ${SCardHead} ~ & {
    padding-top: 20px;
  }
`;

Card.Head = Head;
Card.Title = Title;
Card.Body = Body;

Card.propTypes = {
  col: PropTypes.string,
};

Card.defaultProps = {};

export default Card;
