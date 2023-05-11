import styled from 'styled-components';
import PropTypes from 'prop-types';

const SDataView = styled.ul``;
const SListItem = styled.li`
  .tit {
    font-size: 14px;
    color: ${(p) => p.theme.gray30};
  }
  .content {
    margin-top: 5px;
    font-size: 18px;
    min-height: 27px;
  }
  & ~ & {
    margin-top: 20px;
    border-top: 1px solid ${(p) => p.theme.gray60};
    padding-top: 20px;
  }
`;

const List = ({ children }) => {
  return <SDataView>{children}</SDataView>;
};

const Item = (props) => {
  return (
    <SListItem>
      <div className="tit">{props.label}</div>
      <div className="content">{props.children}</div>
    </SListItem>
  );
};

List.Item = Item;

export default List;
