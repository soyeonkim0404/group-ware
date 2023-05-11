import styled from 'styled-components';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { MdError, MdOutlineClose } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { getEmployeeALl } from '@api';
import Image from 'next/image';
import _ from 'lodash';

const Group = ({ children }) => {
  return <SInputGroup>{children}</SInputGroup>;
};

const Dash = ({ children }) => {
  return <SInputDash>{children}</SInputDash>;
};

function AutoFormInput({
  inputId,
  type,
  label,
  required,
  step,
  disabled,
  byte,
  pattern,
  max,
  hidden,
  error,
  defaultValue,
  onClickEvent,
  length,
}) {
  const { control, reset } = useForm();
  const { register, setValue } = useFormContext();
  const calculateByte = (text, max) => {
    const byte = new TextEncoder().encode(text).length;
    return byte < max;
  };

  const match = inputId.match(/\[\d]/);
  let _id, _id2, _index;
  if (match) {
    const position = match.index;

    _id = inputId.substring(0, position);
    _id2 = inputId.split('.')[1];
    _index = Number(match[0].substring(1, match[0].substring().length - 1));
  }

  const matchObject = inputId.match(/\[.+]/);
  let __id, __id2, __index;
  if (matchObject) {
    const position = matchObject.index;

    __id = inputId.substring(0, position);
    __id2 = inputId.split('.')[1];
    __index = matchObject[0].substring(1, matchObject[0].substring().length - 1);
  }

  const [getEmployee, setGetEmployee] = useState('');
  const [suggestions, setSuggestion] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isAutoCompleting, setAutoCompleting] = useState(false);

  const apiGetEmployeeAll = async () => {
    getEmployeeALl().then((res) => {
      setGetEmployee(res.data);
    });
  };

  useEffect(() => {
    apiGetEmployeeAll();
  }, []);

  const selectSuggestion = (name) => {
    setSuggestion([]);
    setSearchText(name);
  };

  const handleTextChanged = (e) => {
    let suggestedDataList = [];
    let textValue = e.target.value;
    if (textValue !== '') {
      const regex = new RegExp(`^${_.escapeRegExp(textValue)}`, 'i');
      suggestedDataList = getEmployee && getEmployee.filter((e) => regex.test(e.name));
    }
    setSuggestion(suggestedDataList);
    setSearchText(textValue);
  };

  return (
    <SAutoFormInput className={'auto-input'}>
      <Controller
        name="formInput"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SLabelField
            htmlFor={inputId}
            value={searchText || value || defaultValue || ''}
            hidden={hidden}
            onChange={onChange}
            onClick={() => {
              setAutoCompleting(true);
            }}
          >
            <SInputField
              id={inputId}
              readOnly
              hidden
              {...register(inputId, {
                required: {
                  value: required,
                  message: `${label}은(는) 필수 입력값입니다.`,
                },
                pattern: {
                  value: pattern,
                },
                maxLength: max,
                validate: (v) => {
                  calculateByte(v, byte);
                },
              })}
            />
            <SInputField
              type={type}
              step={step}
              hidden={hidden}
              disabled={disabled}
              className={(value || defaultValue) && 'isValue'}
              max={max}
              maxLength={length}
              value={searchText || value || defaultValue || ''}
              onChange={(e) => {
                handleTextChanged(e);
              }}
              onBlur={() => {
                setSuggestion([]);
              }}
            />
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
            {(value || defaultValue) && (
              <button
                className="form-delete"
                onClick={() => {
                  setSearchText('');
                  setValue(inputId, '');
                  reset({
                    inputId: '',
                  });
                }}
              >
                <MdOutlineClose />
              </button>
            )}
          </SLabelField>
        )}
      />

      <SUl className="suggest-list">
        {suggestions &&
          suggestions.map((item, index) => (
            <li
              key={index}
              onMouseDown={() => {
                selectSuggestion(item.name);
                setValue(inputId, item.id);
                onClickEvent && onClickEvent(item);
              }}
            >
              <div className="img">
                <Image
                  src={
                    item.profileImage !== null
                      ? item.profileImage
                      : '/static/img/noImg.svg'
                  }
                  alt="profile-img"
                  width={48}
                  height={48}
                />
              </div>
              <div className="info">
                <span className="name">
                  {item.name}
                  <span className="position">{item.grade}</span>
                </span>
                <span className="email">{item.email}</span>
              </div>
            </li>
          ))}
      </SUl>
    </SAutoFormInput>
  );
}

AutoFormInput.defaultProps = {
  type: 'text',
  error: {},
  required: false,
};

AutoFormInput.Group = Group;
AutoFormInput.Dash = Dash;

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
  .form-delete {
    position: absolute;
    top: 18px;
    right: 20px;
    font-size: 20px;
    color: ${(p) => p.theme.gray40};
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
    color: ${(p) => p.theme.gray60};
    border-bottom: 2px dotted ${(p) => p.theme.gray70};

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

const SAutoFormInput = styled.div`
  position: relative;
`;

const SUl = styled.ul`
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: ${(p) => p.theme.white};
  box-shadow: ${(p) => p.theme.boxShadow};
  border-radius: 0 0 20px 20px;
  box-sizing: border-box;
  z-index: 100;
  li {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
    .img {
      flex: 0 0 48px;
      width: 48px;
      height: 48px;
      img {
        border-radius: 100%;
      }
    }
    .info {
      flex: 0 0 auto;
      width: calc(100% - 60px);
      margin-left: 10px;
      .name {
        margin-right: 5px;
      }
      .position {
        margin-left: 5px;
        font-size: 14px;
        color: ${(p) => p.theme.gray40};
      }
      .email {
        font-size: 12px;
        color: ${(p) => p.theme.gray40};
      }
    }
    &:hover {
      background: ${(p) => p.theme.gray80};
    }
  }
`;

export default AutoFormInput;
