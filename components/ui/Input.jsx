import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { MdOutlineCalendarToday, MdError } from 'react-icons/md';

function Input({
  name,
  type,
  label,
  placeholder,
  disabled,
  required,
  error,
  onChange,
  value,
  pattern,
  formatDate,
  readonly,
  onKeyPress,
  length,
}) {
  return (
    <SLabelField htmlFor={label} className="input">
      <SInputField
        id={`input-${name}`}
        type={type}
        // placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={value && 'isValue'}
        disabled={disabled}
        required={required}
        pattern={pattern}
        formatDate={formatDate}
        readonly={readonly}
        onKeyPress={onKeyPress}
        maxLength={length}
      />
      {type === 'date' && (
        <>
          <SFormatDate>
            {value && moment(value).format('YYYY-MM-DD')}
            <MdOutlineCalendarToday />
          </SFormatDate>
          {!error && placeholder && <SPlaceholder>{placeholder}</SPlaceholder>}
        </>
      )}
      {label && <SLabelTxt className="label">{label}</SLabelTxt>}
      {!value && !error && placeholder && <SPlaceholder>{placeholder}</SPlaceholder>}
      {error && (
        <SErrorMsg>
          <MdError />
          <span>{error}</span>
        </SErrorMsg>
      )}
    </SLabelField>
  );
}

const SLabelField = styled.label`
  position: relative;
  display: block;
  width: 100%;
  /*max-width: 280px;*/
  max-height: 80px;
  padding-bottom: 24px;
  box-sizing: border-box;
  & + & {
    margin-left: 20px;
  }
  .select + & {
    margin-left: 20px;
    .mobile & {
      margin-left: 0;
    }
  }
  .mobile & {
    max-width: 100%;
  }
`;

const SInputField = styled.input.attrs(() => ({ autocomplete: 'off' }))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-border-radius: 0;
  width: 100%;
  border: 0;
  font-family: inherit;
  border-radius: 0;
  padding: 17px 0 5px 0;
  height: 56px;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border-bottom: 2px solid ${(p) => p.theme.gray60};
  color: ${(p) => p.theme.black};
  transition: all 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${(p) => p.theme.gray60};
  }

  &:hover {
    border-bottom: 2px solid ${(p) => p.theme.gray40};
  }

  &:placeholder-shown,
  &.isValue,
  &:-webkit-autofill {
    & ~ .label {
      color: ${(p) => p.theme.gray40};
      transform: translateY(-20px) scale(0.75);
    }
  }

  &[type='date'] {
    position: relative;
    z-index: 10;
    background: none;
    color: #fff;
    font-size: 0;
    &::-webkit-datetime-edit,
    &::-webkit-inner-spin-button,
    &::-webkit-clear-button {
      display: none;
    }
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    &::-webkit-date-and-time-value {
      text-align: left;
    }
  }
  &[type='number'] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid ${(p) => p.theme.blue};

    & ~ .label {
      color: ${(p) => p.theme.blue};
      transform: translateY(-20px) scale(0.75);
    }
  }

  &:disabled {
    border-bottom: 2px dotted ${(p) => p.theme.gray70};
    opacity: 1;

    & + span {
      color: ${(p) => p.theme.gray60};
    }
  }
`;

const SLabelTxt = styled.span`
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 16px;
  color: ${(p) => p.theme.gray40};
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
  pointer-events: none;
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

const SInputGroup = styled.div`
  display: flex;
  align-items: center;
  .mobile & {
    flex-direction: column;
    label {
      max-width: 100%;
      & + label {
        margin-left: 0;
      }
    }
  }
`;

const SInputDash = styled.span`
  display: inline-flex;
  align-items: center;
  margin: -10px 20px 0 20px;
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 2px;
    background-color: ${(p) => p.theme.gray50};
  }
  .mobile & {
    display: none;
  }
`;

const SFormatDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 17px 0 5px 0;
  font-size: 16px;
  font-weight: 500;
  background: none;
  color: ${(p) => p.theme.black};
  svg {
    margin-left: auto;
    padding: 10px;
  }
  input:disabled ~ & {
    color: ${(p) => p.theme.gray60};
  }
`;

const SPlaceholder = styled.span`
  position: absolute;
  bottom: 0;
  font-size: 12px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  left: 0;
  color: ${(p) => p.theme.gray50};
`;

const Group = ({ children }) => {
  return <SInputGroup className={'input-group'}>{children}</SInputGroup>;
};

const Dash = ({ children }) => {
  return <SInputDash>{children}</SInputDash>;
};

Input.Group = Group;
Input.Dash = Dash;

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf([
    'text',
    'password',
    'number',
    'price',
    'date',
    'time',
    'submit',
    'search',
    'tel',
  ]),
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  formatDate: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  label: '',
  onChange: () => {},
  onFocus: () => {},
};

export default Input;
