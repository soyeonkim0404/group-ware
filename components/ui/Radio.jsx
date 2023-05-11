import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const Radio = ({ id, name, checked, onChange, label, disabled }) => {
  return (
    <SLabel checked={checked} htmlFor={id}>
      <input
        type="radio"
        id={id}
        name={name}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        value={id}
      />
      <span className="radio-pulse" />
      <span className="radio-button">
        <span className="radio-button-inner" />
      </span>
      <span className="radio-label">{label}</span>
    </SLabel>
  );
};

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

const SLabel = styled.label`
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

Radio.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  autoFocus: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

Radio.defaultProps = {
  type: 'radio',
  label: '',
  onChange: () => {},
  onFocus: () => {},
};

export default Radio;
