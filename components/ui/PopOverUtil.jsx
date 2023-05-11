import styled from 'styled-components';
import Link from 'next/link';
import { gsap } from 'gsap';
import { getParents } from '../../util/dom';
import { useSelector } from 'react-redux';
import { authCheck } from '../../util/authCheck';

const Btn = ({ children, url, controlModal }) => {
  return !url ? (
    <SUtilBtn onClick={controlModal}>{children}</SUtilBtn>
  ) : (
    <SUtilBtn as="div">
      <Link href={url}>
        <a>{children}</a>
      </Link>
    </SUtilBtn>
  );
};

const Content = (props) => {
  return <SUtils>{props.children}</SUtils>;
};

const position = {
  from: -100,
  to: -115,
};

const PopOverUtil = (props) => {
  const store = useSelector((store) => store);

  const show = (e) => {
    const btn = e.currentTarget;
    const { left, top, height } = btn.getBoundingClientRect();
    const popContent = btn.nextElementSibling;

    // 이벤트 기본 동작 방어
    e.stopPropagation();
    e.preventDefault();

    gsap.set(popContent, {
      top: top + height,
      left,
    });

    if (btn.classList.contains('on')) {
      gsap.to(popContent, {
        x: position.from,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          btn.classList.remove('on');
          popContent.style.display = 'none';
        },
      });
    } else {
      gsap.to(popContent, {
        x: position.to,
        opacity: 1,
        duration: 0.2,
        onStart: () => {
          popContent.style.display = 'block';

          const openedPopoverUtilsBtn = document.querySelectorAll(
            '.pop-over-util-wrap > button.on'
          );

          if (openedPopoverUtilsBtn.length < 1) return;
          const openedPopoverUtils = openedPopoverUtilsBtn[0].nextElementSibling;

          gsap.to(openedPopoverUtils, {
            x: position.from,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              openedPopoverUtils.style.display = 'none';
              openedPopoverUtilsBtn[0].classList.remove('on');
            },
          });
        },
        onComplete: () => {
          btn.classList.add('on');
          const onClick = (e) => {
            // 이벤트 기본 동작 방어
            e.stopPropagation();
            e.preventDefault();

            const target = e.target;
            if (getParents(target, '.pop-over-util-wrap') === null) {
              gsap.to(popContent, {
                x: position.from,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                  btn.classList.remove('on');
                  popContent.style.display = 'none';
                },
              });
            }
          };
          document.body.addEventListener('click', onClick, { once: true });
          document.addEventListener(
            'scroll',
            () => {
              gsap.to(popContent, {
                x: position.from,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                  btn.classList.remove('on');
                  popContent.style.display = 'none';
                },
              });
            },
            { once: true }
          );
        },
      });
    }
  };

  const outFocus = (e) => {
    if (e.relatedTarget === null) {
      const btn = e.currentTarget;
      const popContent = btn.nextElementSibling;

      gsap.to(popContent, {
        x: position.from,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          btn.classList.remove('on');
          popContent.style.display = 'none';
        },
      });
    }
  };

  return (
    authCheck(store, props.menuCode, props.auth, props.userId) && (
      <SUtilWrap className={'pop-over-util-wrap'}>
        <SBtn onClick={show} onBlur={outFocus}>
          <span>관리</span>
        </SBtn>
        {props.children}
      </SUtilWrap>
    )
  );
};

const SUtilWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const SBtn = styled.button.attrs(() => ({ type: 'button' }))`
  box-sizing: content-box;
  width: 12px;
  height: 12px;
  padding: 22px;
  font-size: 0;
  transition: all 0.3s;
  span {
    display: block;
    position: relative;
    width: 4px;
    height: 4px;
    margin: 0 auto;
    border-radius: 50%;
    background: ${(p) => p.theme.gray30};
    transition: all 0.3s;
    &::before {
      display: block;
      content: '';
      position: absolute;
      top: -8px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: ${(p) => p.theme.gray30};
      transition: all 0.3s;
    }
    &::after {
      display: block;
      content: '';
      position: absolute;
      bottom: -8px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: ${(p) => p.theme.gray30};
      transition: all 0.3s;
    }
  }
  &:hover,
  &:focus {
    span {
      background: ${(p) => p.theme.gray20};
      &::before,
      &::after {
        background: ${(p) => p.theme.gray20};
      }
    }
  }
  &.open {
    span {
      background: ${(p) => p.theme.blue};
      &::before {
        background: ${(p) => p.theme.blue};
      }
      &::after {
        background: ${(p) => p.theme.blue};
      }
    }
  }
`;

const SUtils = styled.div`
  display: none;
  position: fixed;
  z-index: 200;
  box-sizing: border-box;
  box-shadow: ${(p) => p.theme.boxShadow};
  max-width: 150px;
  width: auto;
  border: 1px solid ${(p) => p.theme.gray50};
  border-radius: 5px;
  padding: 5px;
  background: #fff;
  text-align: right;
  opacity: 0;
  transform: translate(-100px, -50px);
`;

const SUtilBtn = styled.button.attrs(() => ({ type: 'button' }))`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  transition: all 0.3s;
  text-align: left;
  color: ${(p) => p.theme.gray20};
  &:hover,
  &:focus {
    background: ${(p) => p.theme.gray80};
  }
  a {
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
    color: ${(p) => p.theme.gray20};
  }
  svg {
    flex: 0 0 auto;
  }
  span {
    flex: 1;
    margin-left: 10px;
    white-space: nowrap;
  }
`;

PopOverUtil.Btn = Btn;
PopOverUtil.Content = Content;

export default PopOverUtil;
