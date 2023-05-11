import styled from 'styled-components';
import moment from 'moment';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { MdOutlineCalendarToday, MdError } from 'react-icons/md';
import NumberFormat from 'react-number-format';

const Group = ({ children }) => {
  return <SInputGroup>{children}</SInputGroup>;
};

const Dash = ({ children }) => {
  return <SInputDash>{children}</SInputDash>;
};

function FormInput({
  inputId,
  type,
  label,
  required,
  step,
  disabled,
  byte,
  length,
  pattern,
  patternMessage,
  max,
  hidden,
  error,
  defaultValue,
  onChangeEvent,
  onBlurEvent,
  placeholder,
  style,
}) {
  const { control } = useForm();
  const { register, setValue } = useFormContext();
  const calculateByte = (text, max) => {
    const byte = new TextEncoder().encode(text).length;
    return byte < max;
  };

  const matchArray = inputId.match(/\[\d]/);
  let _id, _id2, _index;
  if (matchArray) {
    const position = matchArray.index;

    _id = inputId.substring(0, position);
    _id2 = inputId.split('.')[1];
    _index = Number(matchArray[0].substring(1, matchArray[0].substring().length - 1));
  }

  const matchObject = inputId.match(/\[.+]/);
  let __id, __id2, __index;
  if (matchObject) {
    const position = matchObject.index;

    __id = inputId.substring(0, position);
    __id2 = inputId.split('.')[1];
    __index = matchObject[0].substring(1, matchObject[0].substring().length - 1);
  }

  return (
    <Controller
      name="formInput"
      control={control}
      render={({ field: { onChange, value } }) => (
        <SLabelField
          htmlFor={inputId}
          value={value || defaultValue || ''}
          hidden={hidden}
          onChange={onChange}
          className="form-input"
        >
          {style === 'price' ? (
            <NumberFormat
              thousandSeparator={true}
              id={inputId}
              type={type}
              step={step}
              hidden={hidden}
              disabled={disabled}
              className={(value || defaultValue) && 'isValue'}
              max={max}
              maxLength={length}
              defaultValue={value || defaultValue || ''}
              onValueChange={(e) => {
                onChange();
                setValue(inputId, e.value);
              }}
              {...register(inputId, {
                required: {
                  value: required,
                  message: `${label}은(는) 필수 입력값입니다.`,
                },
                pattern: {
                  value: pattern,
                  message: patternMessage || '올바르지 않은 형식입니다.',
                },
                maxLength: max,
                validate: (v) => {
                  calculateByte(v, byte);
                },
                onChange: (e) => {
                  onChangeEvent && onChangeEvent(e);
                },
              })}
            />
          ) : (
            <>
              <SInputField
                id={inputId}
                type={type}
                step={step}
                hidden={hidden}
                disabled={disabled}
                className={(value || defaultValue) && 'isValue'}
                max={max}
                maxLength={length}
                defaultValue={value || defaultValue || ''}
                placeholder={placeholder}
                {...register(inputId, {
                  required: {
                    value: required,
                    message: `${label}은(는) 필수 입력값입니다.`,
                  },
                  pattern: {
                    value: pattern,
                    message: patternMessage || '올바르지 않은 형식입니다.',
                  },
                  maxLength: max,
                  validate: (v) => {
                    calculateByte(v, byte);
                  },
                  onChange: (e) => {
                    onChangeEvent && onChangeEvent(e);
                  },
                  onBlur: (e) => {
                    onBlurEvent && onBlurEvent(e);
                  },
                })}
              />
              {type === 'date' && (
                <>
                  <SFormatDate>
                    {((value || defaultValue) &&
                      moment(value || defaultValue).format('YYYY-MM-DD')) ||
                      null}
                    <MdOutlineCalendarToday />
                  </SFormatDate>
                </>
              )}
            </>
          )}
          {label && <SLabelTxt className="label">{label}</SLabelTxt>}
          {(error[inputId] ||
            error[_id]?.[_index]?.[_id2] ||
            error[__id]?.[__index]?.[__id2]) &&
            (error[inputId]?.message ||
            error[_id]?.[_index]?.[_id2]?.message ||
            error[__id]?.[__index]?.[__id2]?.message ? (
              <SErrorMsg>
                <MdError />
                <span>
                  {error[inputId]?.message ||
                    error[_id]?.[_index]?.[_id2]?.message ||
                    error[__id]?.[__index]?.[__id2]?.message}
                </span>
              </SErrorMsg>
            ) : (
              <SErrorMsg>
                <MdError />
                <span>{error[inputId]?.[0]}</span>
              </SErrorMsg>
            ))}
        </SLabelField>
      )}
    />
  );
}

FormInput.defaultProps = {
  type: 'text',
  error: {},
  required: false,
};

FormInput.Group = Group;
FormInput.Dash = Dash;

const SLabelField = styled.label`
  position: relative;
  display: ${(props) => (props.hidden ? 'hidden' : 'block')};
  width: 100%;
  max-width: 100%;
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

  input {
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

      & + span {
        color: ${(p) => p.theme.gray40};
      }
    }
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
    -webkit-text-fill-color: ${(p) => p.theme.gray60};
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
    -webkit-text-fill-color: ${(p) => p.theme.gray40};
    color: ${(p) => p.theme.gray40};
    border-bottom: 2px dotted ${(p) => p.theme.gray70};
    & + span {
      -webkit-text-fill-color: ${(p) => p.theme.gray40};
      color: ${(p) => p.theme.gray40};
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
  /*width: 100%;*/
  width: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 5px;
  /*font-size: 12px;*/
  font-size: 0.7em;
  color: ${(p) => p.theme.red};
  svg {
    margin-right: 2px;
  }
`;

const SInputGroup = styled.div`
  display: flex;
  align-items: center;
  label {
    & + label {
      margin-left: 20px;
    }
    & + button,
    & + a {
      flex: 1 0 auto;
      height: 56px;
      margin: 0 0 24px 20px;
    }
  }
  .mobile & {
    flex-direction: column;
    align-items: flex-start;
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
    -webkit-text-fill-color: ${(p) => p.theme.gray40};
    color: ${(p) => p.theme.gray40};
  }
`;
export default FormInput;
