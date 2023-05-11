import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm, useFormContext } from 'react-hook-form';
import { MdError } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

const Group = ({ children }) => {
  return <SSelectGroup>{children}</SSelectGroup>;
};

const FormSelect = ({
  getSelectData,
  selectId,
  label,
  required,
  disabled,
  defaultValue,
  error,
  onChange,
  onClick,
  onOpenEvent,
  onCloseEvent,
}) => {
  const {
    setValue,
    formState: { errors },
  } = useForm();
  const { register } = useFormContext();

  const matchArray = selectId.match(/\[\d]/);
  let _id, _id2, _index;
  if (matchArray) {
    const position = matchArray.index;

    _id = selectId.substring(0, position);
    _id2 = selectId.split('.')[1];
    _index = Number(matchArray[0].substring(1, matchArray[0].substring().length - 1));
  }

  const matchObject = selectId.match(/\[.+]/);
  let __id, __id2, __index;
  if (matchObject) {
    const position = matchObject.index;

    __id = selectId.substring(0, position);
    __id2 = selectId.split('.')[1];
    __index = matchObject[0].substring(1, matchObject[0].substring().length - 1);
  }

  const id = uuidv4();
  let clickCount = 0;
  return (
    <FormControl fullWidth className={error ? 'select use-error' : 'select'}>
      <TextField
        select
        className="form-select"
        name={selectId}
        id={id}
        onChange={(e) => {
          setValue(selectId, e.target.value, { shouldValidate: true });
          onChange && onChange(e);
        }}
        onClick={(e) => {
          clickCount++;
          onClick && onClick(e);
        }}
        onFocus={(e) => {
          if (clickCount % 2) {
            onCloseEvent && onCloseEvent(e);
            document.getElementById(id).blur();
          } else {
            onOpenEvent && onOpenEvent(e);
          }
        }}
        label={label}
        defaultValue={defaultValue}
        disabled={disabled}
        error={errors[selectId]}
        {...register(selectId, {
          required: {
            value: required,
            message: `${label}은(는) 필수 입력값입니다.`,
          },
          onChange: (e) => onChange && onChange(e),
          onBlur: (e) => (clickCount = 0),
        })}
      >
        {getSelectData.map((item) => {
          return item.code || item.id ? (
            <MenuItem key={item.code || item.id} value={item.code || item.id}>
              <span>{item.value || item.name || item.companyNameKr}</span>
            </MenuItem>
          ) : (
            <MenuItem key={item.toString()} value={item}>
              <span>{item.toString()}</span>
            </MenuItem>
          );
        })}
      </TextField>
      {(error[selectId] ||
        error[_id]?.[_index]?.[_id2] ||
        error[__id]?.[__index]?.[__id2]) && (
        <SErrorMsg>
          <MdError />
          <span>{label}은(는) 필수 입력값입니다.</span>
        </SErrorMsg>
      )}
    </FormControl>
  );
};

FormSelect.propTypes = {
  label: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
};
FormSelect.defaultProps = {
  defaultValue: '',
};

FormSelect.Group = Group;
FormSelect.displayName = 'FormSelect';

const SSelectGroup = styled.div`
  display: flex;
  .select {
    & + .select {
      margin-left: 20px;
    }
  }
  label + .select {
    margin-left: 20px;
  }
  .mobile & {
    flex-direction: column;
    .select {
      & + .select {
        margin-left: 0;
        margin-top: 20px;
      }
    }
    label + .select {
      margin-left: 0;
      margin-top: 20px;
    }
  }
`;

const SErrorMsg = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 12px;
  color: ${(p) => p.theme.red};
  svg {
    margin-right: 2px;
  }
`;
export default FormSelect;
