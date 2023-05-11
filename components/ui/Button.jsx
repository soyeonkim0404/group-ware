import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { authCheck } from '../../util/authCheck';

const Button = ({
  children,
  size,
  color,
  outline,
  fullWidth,
  text,
  link,
  icon,
  menuCode,
  auth,
  userId,
  ...rest
}) => {
  const store = useSelector((store) => store);

  return link
    ? authCheck(store, menuCode, auth, userId) && (
        <Link href={link}>
          <SButtonStyled
            size={size}
            color={color}
            outline={outline}
            fullWidth={fullWidth}
            text={text}
            icon={icon}
            {...rest}
          >
            <span>{children}</span>
          </SButtonStyled>
        </Link>
      )
    : authCheck(store, menuCode, auth, userId) && (
        <SButtonStyled
          size={size}
          color={color}
          outline={outline}
          fullWidth={fullWidth}
          text={text}
          icon={icon}
          {...rest}
        >
          <span>{children}</span>
        </SButtonStyled>
      );
};

const Wrap = ({ children }) => {
  return <SButtonWrap>{children}</SButtonWrap>;
};

const Group = ({ children }) => {
  return <SButtonGroup className="group">{children}</SButtonGroup>;
};

const colors = {
  primary: {
    color: '#343a40',
  },
  gray: {
    color: '#868e96',
  },
  red: {
    color: '#f03e3e',
  },
  blue: {
    color: '#1976d2',
  },
  yellow: {
    color: '#FAE100',
    font: '#111',
  },
  green: {
    color: '#2e7d32',
  },
  lightGray: {
    color: '#e9ecef',
  },
};

const sizes = {
  large: {
    height: '42px',
    fontSize: '15px',
  },
  medium: {
    height: '36px',
    fontSize: '14px',
  },
  small: {
    minWidth: '64px',
    height: '30px',
    fontSize: '13px',
  },
  tiny: {
    minWidth: '60px',
    height: '24px',
    fontSize: '12px',
  },
  heightAuto: {
    height: '100%',
    fontSize: '14px',
  },
};

const sizeStyle = css`
  ${({ size }) => css`
    min-width: ${sizes[size].minWidth};
    height: ${sizes[size].height};

    span {
      font-size: ${sizes[size].fontSize};
      font-weight: 400;
    }
  `}
  ${({ size }) =>
    size === 'heightAuto' &&
    css`
      span {
        flex-wrap: wrap;
      }
    `}
`;

const colorStyle = css`
  ${({ color }) => css`
    background: ${colors[color].color};

    &:hover {
      opacity: 0.5;
    }

    ${(props) =>
      props.outline &&
      css`
        color: ${colors[color].color};
        background: #ffffff;
        border: 1px solid ${colors[color].color};
      `}
    ${(props) =>
      props.text &&
      css`
        color: ${colors[color].color};
        background: #ffffff;
        padding: 6px 0;

        &:disabled {
          background: transparent;
        }
      `}
    ${(props) =>
      props.color === 'yellow' &&
      css`
        color: ${colors[color].font};
      `}
  `}
`;

const fullWidthStyle = css`
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
      margin-left: 0;
    `}
`;

const iconStyle = css`
  ${(props) =>
    props.icon &&
    css`
      width: ${(props) => props.icon}px;
      height: ${(props) => props.icon}px;
      min-width: auto;
      padding: 0;
      border-radius: 100%;
      box-sizing: border-box;
      span {
        font-size: 0;
        svg {
          font-size: calc(${(props) => props.icon}px / 2);
          color: ${(p) => p.theme.white};
          margin: 0;
        }
      }
    `}
`;

const SButtonStyled = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 95px;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  color: #ffffff;
  background-color: ${(p) => p.theme.black};
  cursor: pointer;
  box-sizing: border-box;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    svg {
      margin-right: 5px;
    }
  }

  & + & {
    margin-left: 10px;
    .mobile & {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  &:disabled {
    background-color: ${(p) => p.theme.gray60};
    color: ${(p) => p.theme.gray40};
    cursor: default;

    &:hover {
      opacity: 1;
    }
  }

  ${sizeStyle}
  ${colorStyle}
  ${fullWidthStyle}
  ${iconStyle}
`;

const SButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  button {
    & + button {
      margin-left: 0;
    }
  }
  .mobile & {
    & + .group {
      margin-top: 10px;
    }
  }
`;

const SButtonWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  justify-content: space-between;
  position: fixed;
  width: calc(100% - 340px);
  bottom: 0;
  right: 0;
  margin: 40px 0 0 0;
  padding: 20px 40px 20px 10px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.836594012605042) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  gap: 10px;
  z-index: 99;
  box-sizing: border-box;
  button {
    margin-top: 0;
    & + button {
      margin-left: 10px;
    }
  }
  .mobile & {
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin: 40px 0 0;
    padding: 20px 20px;
    background: #fff;
    /* backdrop-filter: blur(80px);*/
    gap: 0;
    button {
      width: 100%;
    }
  }
`;

Button.Group = Group;
Button.Wrap = Wrap;

Button.defaultProps = {
  size: 'medium',
  color: 'primary',
};

export default Button;
