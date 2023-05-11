import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const SOrderedList = styled.ol`
  padding: 0 0 0 15px;
  list-style-type: decimal;
`;
const SUnOrderedList = styled.ul`
  padding: 0 0 0 15px;
`;
const SListItem = styled.li`
  ul & {
    position: relative;
    &::before {
      display: block;
      content: '';
      position: absolute;
      top: 10px;
      left: -12px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background:black};
    }
    ${({ className }) => css`
      color: ${className};
      &::before {
        background: ${className} !important;
      }
    `}
  }
  & ~ & {
    margin-top: 5px;
  }
`;

const List = ({ ordered, children }) => {
  return ordered ? (
    <SOrderedList>{children}</SOrderedList>
  ) : (
    <SUnOrderedList>{children}</SUnOrderedList>
  );
};

const Item = ({ color, children }) => {
  return <SListItem className={color}>{children}</SListItem>;
};

List.propTypes = {
  ordered: PropTypes.bool,
};

List.defaultProps = {
  ordered: false,
};

List.Item = Item;

export default List;
