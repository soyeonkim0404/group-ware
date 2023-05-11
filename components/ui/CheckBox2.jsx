import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

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
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
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
  & + & {
    margin-left: 20px;
  }
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
  &.all {
    display: flex;
    margin-bottom: 10px;
    border-bottom: 1px solid ${(p) => p.theme.gray60};
    padding-bottom: 10px;
    .chk-label {
      font-weight: 700;
    }
    & + label {
      margin-left: 0;
    }
  }
`;

const CheckBox = ({
  id,
  name,
  label,
  checked,
  disabled,
  onChange,
  allText,
  children,
}) => {
  return (
    <SChkLabel checked={checked} htmlFor={id} className={allText && 'all'}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="chk-pulse" />
      <span className="chk-button">
        <span className="chk-button-inner" />
      </span>
      <span className="chk-label">{label}</span>
      {children}
    </SChkLabel>
  );
};

CheckBox.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

CheckBox.defaultProps = {
  id: '',
  name: '',
  label: '',
  checked: false,
  disabled: false,
  onChange: () => {},
};

export default CheckBox;
