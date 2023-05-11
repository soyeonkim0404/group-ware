import styled, { keyframes } from 'styled-components';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function FormCheckBox({ inputId, label, disabled, defaultValue, onChangeEvent }) {
  const { control, getValues } = useForm();
  const { register } = useFormContext();
  const [check, setCheck] = useState(defaultValue);

  const handleCheckbox = () => {
    setCheck((prevState) => !prevState);
  };

  useEffect(() => {
    setCheck(defaultValue || false);
  }, []);

  return (
    <Controller
      name="formCheckbox"
      control={control}
      render={() => (
        <SChkLabel htmlFor={inputId}>
          <input
            type="checkbox"
            id={inputId}
            disabled={disabled}
            checked={check}
            {...register(inputId)}
            onClick={handleCheckbox}
          />
          <span className="chk-pulse" />
          <span className="chk-button">
            <span className="chk-button-inner" />
          </span>
          <span className="chk-label">{label}</span>
        </SChkLabel>
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

const SChkLabel = styled.label`
  flex: 1 0 auto;
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  .chk-pulse {
    position: absolute;
    display: none;
    top: -1px;
    left: -4px;
    z-index: 0;
    opacity: 0;
    width: 28px;
    height: 28px;
    background: rgba(25, 118, 210, 0.2);
    animation: ${pulse} 0.5s linear;
  }
  .chk-button {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid ${(p) => p.theme.gray50};
    box-sizing: border-box;
    .chk-button-inner {
      display: block;
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      background: ${(p) => p.theme.blue};
      visibility: hidden;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 5px;
        border: 2px solid #fff;
        border-top-style: none;
        border-right-style: none;
        transform: translate(3px, 3px) rotate(-45deg);
      }
    }
  }
  .chk-label {
    font-size: 16px;
    margin-left: 10px;
    margin-top: 3px;
  }
  /* & + & {
    margin-left: 20px;
  }*/
  input {
    position: absolute;
    transform: scale(0);
    &:checked ~ .chk-button .chk-button-inner {
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
    &:checked ~ .chk-pulse {
      display: block;
    }
    &:checked ~ .chk-button {
      border-color: ${(p) => p.theme.blue};
    }
    &:disabled ~ .chk-button,
    &:disabled ~ .chk-label {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`;

FormCheckBox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

FormCheckBox.defaultProps = {
  type: 'checkbox',
  label: '',
  onChange: () => {},
};

export default FormCheckBox;
