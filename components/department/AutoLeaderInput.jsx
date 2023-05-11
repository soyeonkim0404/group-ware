import styled from 'styled-components';
import moment from 'moment';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { MdOutlineCalendarToday, MdError } from 'react-icons/md';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getEmployeeALl } from '@api';
import Image from 'next/image';
import Loading from '@components/department/Loading';
import _ from 'lodash';

const Group = ({ children }) => {
  return <SInputGroup>{children}</SInputGroup>;
};

const Dash = ({ children }) => {
  return <SInputDash>{children}</SInputDash>;
};

function AutoLeaderInput({
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
  organization,
  maxHeight,
  length,
}) {
  const { control } = useForm();
  const [cloneDefaultValue, setCloneDefaultValue] = useState(_.clone(defaultValue)); // 기본 값 복사
  const { register, setValue } = useFormContext();
  const [employee, setEmployee] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [event, setEvent] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const calculateByte = (text, max) => {
    const byte = new TextEncoder().encode(text).length;
    return byte < max;
  };
  const autoCompleteArea = useRef(null);

  useEffect(() => {
    getEmployeeALl({ organization }).then((res) => {
      setEmployee(res.data);
    });
  }, []);

  /**
   * 직원정보를 모두 로딩했을 때 마킹
   */
  useEffect(() => {
    if (employee) setLoaded(true);
  }, [employee]);

  /**
   * 직원 데이터를 완전히 로딩했을 때 이전 이벤트가 있는지 확인하기 위한 사이트 이펙트
   */
  useEffect(() => {
    if (event) {
      search(event);
    }
  }, [isLoaded]);

  /**
   * 검색
   */
  const search = async (e) => {
    autoCompleteArea.current.style.display = 'block';
    setSelectedName(null);

    let suggestedDataList = [];
    let textValue = e.target.value;

    // 빈 문자가 들어올 경우 초기화
    if (textValue == '') {
      setCloneDefaultValue(null);
    }
    const regex = new RegExp(`^${textValue}`, 'i');

    if (isLoaded) {
      suggestedDataList = employee.filter((e) => regex.test(e.name));
      setSuggestions(suggestedDataList);
    } else {
      setEvent(e);
    }
  };

  /**
   * 임직원 선택
   */
  const select = (callback) => {
    callback();
    autoCompleteArea.current.style.display = 'none';
  };

  return (
    <SAutoLeaderInput className="auto-input">
      <Controller
        name="formInput"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SLabelField
            htmlFor={inputId}
            value={value || defaultValue || ''}
            hidden={hidden}
            onChange={onChange}
            onClick={() => {}}
          >
            {/* 실제 값을 저장하는 input */}
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
              value={value || cloneDefaultValue?.id || ''}
            />

            {/* 이름을 출력하는 input */}
            <SInputField
              type={type}
              step={step}
              hidden={hidden}
              disabled={disabled}
              className={(value || defaultValue) && 'isValue'}
              max={max}
              value={selectedName || value || cloneDefaultValue?.name || ''}
              maxLength={length}
              onChange={(e) => {
                search(e);
              }}
            />

            {label && <SLabelTxt className="label">{label}</SLabelTxt>}
            {error[inputId] &&
              (error[inputId].message ? (
                <SErrorMsg>
                  <MdError />
                  <span>{error[inputId].message}</span>
                </SErrorMsg>
              ) : (
                <SErrorMsg>
                  <MdError />
                  <span>{error[inputId][0]}</span>
                </SErrorMsg>
              ))}
          </SLabelField>
        )}
      />

      {/* 검색된 사용자 목록 */}
      <SUl ref={autoCompleteArea} maxHeight={maxHeight}>
        {isLoaded ? (
          suggestions?.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                select(() => {
                  setValue(inputId, item.id);
                  setSelectedName(item.name);
                });
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
                  <span className="position">{item.position}</span>
                </span>
                <span className="email">{item.email}</span>
              </div>
            </li>
          ))
        ) : (
          <Loading />
        )}
      </SUl>
    </SAutoLeaderInput>
  );
}

AutoLeaderInput.defaultProps = {
  type: 'text',
  error: {},
  required: false,
};

AutoLeaderInput.Group = Group;
AutoLeaderInput.Dash = Dash;

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

const SAutoLeaderInput = styled.div`
  position: relative;
`;

const SUl = styled.ul`
  display: none;
  position: absolute;
  top: 60px;
  left: 0;
  width: 500px;
  max-height: ${(p) => p.maxHeight + 'px'};
  overflow-y: scroll;
  background: ${(p) => p.theme.white};
  box-shadow: ${(p) => p.theme.boxShadow};

  border-radius: 0;
  box-sizing: border-box;
  z-index: 99;
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
      font-size: 12px;
      .name {
        margin-right: 5px;
      }
      .position {
        margin-left: 5px;
        color: ${(p) => p.theme.gray40};
      }
      .email {
        color: ${(p) => p.theme.gray40};
      }
    }
    &:hover {
      background: ${(p) => p.theme.gray80};
    }
  }
`;

export default AutoLeaderInput;
