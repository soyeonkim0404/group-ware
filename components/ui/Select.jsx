import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SelectItem = ({
  getSelectData,
  value,
  onChange,
  labelId,
  selectId,
  label,
  minWidth,
  disabled,
}) => {
  return (
    <FormControl
      sx={{ minWidth: Number(minWidth) }}
      className="select"
      style={{ paddingBottom: '24px' }}
    >
      <InputLabel id={labelId} className="custom-select-label">
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        label={label}
        onChange={onChange}
        className="custom-select"
        disabled={disabled || false}
      >
        {getSelectData.map((item, index) => (
          <MenuItem key={index} value={item.code ?? item.id}>
            {item.value || item.name || item.companyNameKr}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const SSelectGroup = styled.div`
  display: flex;
  > div {
    & + div {
      margin-left: 20px;
    }
  }
  label + .select {
    margin-left: 20px;
  }
  .select {
    flex: 1;
    min-width: auto;
    & ~ .input {
      width: auto;
      flex: 1;
    }
  }
  .mobile & {
    flex-direction: column;
    .select {
      & + .select {
        margin-left: 0;
        margin-top: 20px;
      }
      & + .input {
        margin-left: 0;
        margin-top: 20px;
      }
    }
    label + .select {
      margin-left: 0;
      margin-top: 20px;
    }
  }
  .mobile & + & {
    margin-left: 0;
    margin-top: 20px;
  }
`;

const Group = ({ children }) => {
  return <SSelectGroup>{children}</SSelectGroup>;
};

SelectItem.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  // value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.string,
};

SelectItem.defaultProps = {
  minWidth: '280',
  value: '',
};

SelectItem.Group = Group;

export default SelectItem;
