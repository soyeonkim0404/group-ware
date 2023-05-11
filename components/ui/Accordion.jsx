/* eslint-disable no-extra-boolean-cast */
import styled from 'styled-components';
import { gsap } from 'gsap';

const Head = ({ children }) => {
  const accClickHandler = (e) => {
    const accordionHeader = e.currentTarget.parentElement;
    const accordionBody = accordionHeader.nextElementSibling;
    const accordion = accordionHeader.parentElement;
    const accordionWrap = accordion.parentElement;

    if (!!accordionWrap.dataset.autoclose) {
      [...accordionWrap.querySelectorAll(':scope > .on')].map((el) => {
        gsap.to(el.querySelector('.accordion-body'), {
          height: 0,
          duration: 0.3,
          onStart: () => {
            el.classList.remove('on');
          },
        });
      });
    }

    if (accordion.classList.contains('on')) {
      gsap.to(accordionBody, {
        height: 0,
        duration: 0.3,
        onComplete: () => {
          accordion.classList.remove('on');
        },
      });
    } else {
      gsap.to(accordionBody, {
        height: `${accordionBody.children[0].offsetHeight}px`,
        duration: 0.3,
        onStart: () => {
          accordion.classList.add('on');
        },
        onComplete: () => {
          accordionBody.style.height = 'auto';
        },
      });
    }
  };

  return (
    <SHead className={'accordion-head'}>
      <SInner>{children}</SInner>
      <SArrow className={'arrow'} onClick={accClickHandler} />
    </SHead>
  );
};

const Title = ({ children }) => {
  return <STitle>{children}</STitle>;
};

const Body = ({ children }) => {
  return (
    <SBodyWrap className={'accordion-body'}>
      <SBody>{children}</SBody>
    </SBodyWrap>
  );
};

const Accordion = ({ children }) => {
  return <SAccordion>{children}</SAccordion>;
};

export const AccordionList = ({ children, autoClose }) => {
  return (
    <SList autoClose={autoClose} className={'accordion'}>
      {children}
    </SList>
  );
};

const SList = styled.div.attrs((props) => ({
  'data-autoclose': props.autoClose,
}))``;

const SHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  font-size: 14px;
  text-align: left;
  box-sizing: border-box;
  .mobile & {
    padding: 20px 10px 20px 20px;
  }
`;

const SAccordion = styled.div`
  border-top: 1px solid ${(p) => p.theme.gray40};
  border-bottom: 1px solid ${(p) => p.theme.gray60};
  & + & {
    border-top: none;
  }
`;

const SInner = styled.div``;

const STitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  * + & {
    margin-top: 10px;
  }
`;

const SBody = styled.div`
  overflow: hidden;
  display: block;
  width: 100%;
  box-sizing: border-box;
  max-height: ${({ elementHeight }) => (elementHeight === 0 ? 0 : elementHeight + 40)}px;
  border-color: ${(p) => p.theme.gray60};
  padding: 20px;
  background: ${(p) => p.theme.gray90};
  text-align: left;
  transition: all 0.2s;
  .on & {
    border-top: 1px solid ${(p) => p.theme.gray60};
  }
`;

const SBodyWrap = styled.div`
  overflow: hidden;
  height: 0;
`;

const SArrow = styled.button.attrs(() => ({ type: 'button' }))`
  position: relative;
  width: 30px;
  height: 30px;
  &::before {
    display: block;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.gray40};
    transition: all 0.2s;
    transform: translate(calc(-50% - 6px), -50%) rotate(45deg);
  }
  &::after {
    display: block;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.gray40};
    transition: all 0.2s;
    transform: translate(calc(-50% + 6px), -50%) rotate(-45deg);
  }
  .on & {
    &::before {
      background: ${(p) => p.theme.gray20};
      transform: translate(calc(-50% + 6px), -50%) rotate(45deg);
    }
    &::after {
      background: ${(p) => p.theme.gray20};
      transform: translate(calc(-50% - 6px), -50%) rotate(-45deg);
    }
  }
  .mobile & {
    transform: scale(0.7);
  }
`;

Accordion.Head = Head;
Accordion.Title = Title;
Accordion.Body = Body;

export default Accordion;
