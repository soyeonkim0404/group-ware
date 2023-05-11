import styled, { keyframes } from 'styled-components';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { MdError } from 'react-icons/md';

function FormRadio({
  getRadioData,
  inputId,
  disabled,
  required,
  defaultValue,
  label,
  onChangeEvent,
}) {
  const { control } = useForm();
  const { register } = useFormContext();
  const [check, setCheck] = useState(defaultValue);

  const handleRadio = (e) => {
    setCheck(e.target.value);
  };

  return (
    <Controller
      name="formRadio"
      control={control}
      render={() => (
        <SRadioGroup className="form-radio">
          <SRadioGroupTit>{label}</SRadioGroupTit>
          {getRadioData.map((item, idx) => {
            return (
              <SRadioLabel htmlFor={item.value} key={idx}>
                <input
                  type="radio"
                  name={inputId}
                  id={item.value}
                  disabled={disabled}
                  checked={check === item.value}
                  value={item.value}
                  {...register(inputId, {
                    required: required,
                  })}
                  onClick={(e) => handleRadio(e)}
                  onChange={(e) => onChangeEvent && onChangeEvent(e)}
                />
                <span className="radio-pulse" />
                <span className="radio-button">
                  <span className="radio-button-inner" />
                </span>
                <span className="radio-label">{item.label}</span>
              </SRadioLabel>
            );
          })}
          {required && !defaultValue && !check && (
            <SErrorMsg>
              <MdError />
              <span>필수 입력값입니다.</span>
            </SErrorMsg>
          )}
        </SRadioGroup>
      )}
    />
  );
}

const pulse = keyframes`
  0%{
    opacity: 0;
    transform: scale(0.5);
  }
  50%{
    opacity: 0.25;
  }
  100%{
    opacity: 0;
    transform: scale(1.75);
  }
`;
const SRadioGroup = styled.div`
  position: relative;
  padding-bottom: 20px;
`;
const SRadioGroupTit = styled.p`
  font-size: 12px;
  line-height: 24px;
  color: ${(p) => p.theme.gray40};
`;
const SRadioLabel = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .radio-pulse {
    position: absolute;
    display: none;
    top: -1px;
    left: -4px;
    z-index: 0;
    opacity: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(25, 118, 210, 0.2);
    animation: ${pulse} 0.5s linear;
  }
  .radio-button {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    padding: 4px;
    border-radius: 50%;
    border: 1px solid ${(p) => p.theme.gray50};
    box-sizing: border-box;
    .radio-button-inner {
      display: block;
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${(p) => p.theme.blue};
      visibility: hidden;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s;
    }
  }
  .radio-label {
    font-size: 16px;
    margin-left: 10px;
    margin-top: 3px;
  }
  & + & {
    margin-left: 20px;
  }
  input {
    position: absolute;
    transform: scale(0);
    &:checked ~ .radio-button .radio-button-inner {
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
    &:checked ~ .radio-pulse {
      display: block;
    }
    &:checked ~ .radio-button {
      border-color: ${(p) => p.theme.blue};
    }
    &:disabled ~ .radio-button,
    &:disabled ~ .radio-label {
      opacity: 0.3;
      cursor: not-allowed;
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

FormRadio.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

FormRadio.defaultProps = {
  type: 'radio',
  label: '',
  onChange: () => {},
};

export default FormRadio;
