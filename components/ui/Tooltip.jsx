import React from 'react';
import styled, { css } from 'styled-components';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef, useContext, createContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineErrorOutline } from 'react-icons/md';

const SIcon = styled.i`
  display: inline-block;
  margin-right: 2px;
  vertical-align: text-top;
  span ~ & {
    margin: 0 0 0 2px;
  }
`;
const SText = styled.span`
  cursor: default;
`;
const SContent = styled.div`
  display: block;
  position: absolute;
  z-index: 1200;
  box-shadow: ${(p) => p.theme.boxShadow};
  width: auto;
  margin-top: 5px;
  border: 1px solid ${(p) => p.theme.gray50};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.4;
  color: ${(p) => p.theme.gray10};
  background: #fff;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
  overflow-wrap: break-word;
  word-break: keep-all;
  top: ${(props) => props.position.top + props.position.height}px;
  max-width: 300px;
  ${(props) =>
    props.position.side === 'right' &&
    css`
      right: ${props.position.right}px;
      margin-left: ${useMediaQuery({ query: '(max-width:767px)' }) ? 60 : 350}px;
    `}
  ${(props) =>
    props.position.side === 'left' &&
    css`
      left: ${props.position.left}px;
      margin-right: ${useMediaQuery({ query: '(max-width:767px)' }) ? 60 : 100}px;
    `}
   &.attached {
    opacity: 1;
    transform: translateY(0);
  }
`;
const SContainer = styled.span`
  color: ${(props) =>
    props.color === 'red' ? '#f03e3e' : props.color === 'gray' ? '#868e96' : 'inherit'};
`;

// useContext
const TooltipContext = createContext();

// Component
const TooltipIcon = () => {
  return (
    <SIcon>
      <MdOutlineErrorOutline></MdOutlineErrorOutline>
    </SIcon>
  );
};

const TooltipText = ({ children }) => {
  return <SText>{children}</SText>;
};

const TooltipContent = (props) => {
  const option = useContext(TooltipContext);
  const [attached, setAttached] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAttached(true);
    }, 100);
    return () => {
      setAttached(false);
    };
  }, [option.isVisible]);
  if (option.isVisible) {
    return ReactDOM.createPortal(
      <SContent className={attached && 'attached'} position={option.position}>
        {props.children}
      </SContent>,
      document.body
    );
  }
};

const Tooltip = (props) => {
  const [option, setOption] = useState({
    isVisible: false,
    position: {},
  });
  const textRef = useRef();

  const show = () => {
    const side =
      textRef.current.offsetLeft + textRef.current.offsetWidth > window.innerWidth / 2
        ? 'right'
        : 'left';
    setOption({
      isVisible: true,
      position: {
        windowWidth: window.innerWidth,
        width: textRef.current.getBoundingClientRect().width,
        height: textRef.current.getBoundingClientRect().height,
        top: textRef.current.getBoundingClientRect().top,
        left: textRef.current.getBoundingClientRect().left,
        right:
          window.innerWidth -
          (textRef.current.getBoundingClientRect().left +
            textRef.current.getBoundingClientRect().width),
        side: side,
      },
    });
  };
  const hide = () => {
    setOption({
      isVisible: false,
      position: {},
    });
  };
  return (
    <TooltipContext.Provider value={option}>
      <SContainer
        onMouseEnter={() => show()}
        onMouseLeave={() => hide()}
        ref={textRef}
        color={props.color}
      >
        {props.children}
      </SContainer>
    </TooltipContext.Provider>
  );
};

Tooltip.Icon = TooltipIcon;
Tooltip.Text = TooltipText;
Tooltip.Content = TooltipContent;

export default Tooltip;
