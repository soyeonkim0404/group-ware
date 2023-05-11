import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { MdCheckCircle, MdInfo, MdError, MdWarning } from 'react-icons/md';

export const ToastContext = createContext();
let id = 0;

const toastInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const toastBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const SToastContent = styled.div`
  position: fixed;
  width: 100%;
  right: 0;
  bottom: 50px;
  z-index: 100;
`;

const SToastInner = styled.div`
  display: flex;
  justify-content: flex-end;
  &.bottom {
    justify-content: center;
    > div {
      animation: ${toastBottom} 0.7s;
      background: rgba(33, 37, 41, 0.8);
      color: ${(p) => p.theme.white};
      justify-content: center;
      width: auto;
      height: auto;
      margin-right: 0;
      padding: 10px 20px;
      border-radius: 40px;
      font-size: 14px;
    }
  }
`;

const SItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  margin-top: 16px;
  width: 300px;
  height: 70px;
  position: relative;
  padding: 10px 20px 10px 10px;
  border-radius: 10px;
  background: ${(p) => p.theme.white};
  box-shadow: ${(p) => p.theme.boxShadow};
  animation: ${toastInRight} 0.7s;
  box-sizing: border-box;
  .line {
    width: 4px;
    height: 100%;
    background: #212529;
    border-radius: 10px;
  }
  .icon {
    width: 25px;
    height: 25px;
    font-size: 25px;
    margin-left: 15px;
  }
  .flex {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    .title {
      color: ${(p) => p.theme.black};
      font-size: 16px;
      font-weight: 700;
    }
    .text {
      color: ${(p) => p.theme.gray40};
      font-size: 14px;
      font-weight: 300;
    }
  }
`;

const ToastItem = ({ children, id }) => {
  const { removeToast } = useContext(ToastContext);
  useEffect(() => {
    const interval = setInterval(() => {
      removeToast(id);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [id, removeToast]);
  return <SItem>{children}</SItem>;
};

const ToastContent = ({ toasts }) => {
  return ReactDOM.createPortal(
    <SToastContent>
      {toasts.map((item) => (
        <SToastInner key={item.id} className={item.position ? item.position : ''}>
          <ToastItem id={item.id}>
            {item.title !== 'Simple' ? (
              <>
                <span
                  className="line"
                  style={{ backgroundColor: item.backgroundColor }}
                />
                <span className="icon" style={{ color: item.backgroundColor }}>
                  {item.icon}
                </span>
                <div className="flex">
                  <span className="title">{item.title}</span>
                  <span className="text">{item.content}</span>
                </div>
              </>
            ) : (
              <span>{item.content}</span>
            )}
          </ToastItem>
        </SToastInner>
      ))}
    </SToastContent>,
    document.body
  );
};

const Toast = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  let toastProperties = null;

  const addToast = (type, content) => {
    switch (type) {
      case 'success':
        toastProperties = {
          id: id++,
          title: 'Success',
          content: content,
          backgroundColor: '#2e7d32',
          icon: <MdCheckCircle />,
        };
        break;
      case 'error':
        toastProperties = {
          id: id++,
          title: 'Error',
          content: content,
          backgroundColor: '#f03e3e',
          icon: <MdError />,
        };
        break;
      case 'info':
        toastProperties = {
          id: id++,
          title: 'Info',
          content: content,
          backgroundColor: '#1976d2',
          icon: <MdInfo />,
        };
        break;
      case 'warning':
        toastProperties = {
          id: id++,
          title: 'Warning',
          content: content,
          backgroundColor: '#ed6c02',
          icon: <MdWarning />,
        };
        break;
      case 'simple':
        toastProperties = {
          id: id++,
          title: 'Simple',
          content: content,
          position: 'bottom',
        };
        break;
      default:
        toastProperties = [];
    }
    setToasts([...toasts, toastProperties]);
  };

  const removeToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContent toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

export default Toast;
