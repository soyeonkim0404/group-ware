import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import styled, { keyframes } from 'styled-components';
import { cancelAxios } from '@http';

const textArray = [
  '오늘부터 내 꿈은 너야 우리 꼭 또 보자, 박연진',
  '나만의 체육관에 온 걸 환영해, 연진아',
  '매일 생각했어, 연진아',
  '오늘부터 모든 날이 흉흉할거야',
  '근데 재준아, 넌 모르잖아. 알록달록한 세상',
  '우리같이 천천히 말라 죽어보자 연진아',
  '여기까지 오는데 우연은 단 한 줄도 없었어',
  '이판사판은 원래 불교 용어야',
  '너네 주님 개빡쳤어, 너 지옥행이래',
  '화이팅 박연진!! 브라보~! 멋지다, 연진아',
  '입을 찢어버려야 하나?',
];

const ErrorUi = (props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    cancelAxios();
  }, []);
  useEffect(() => {
    const intervalDelayMilliseconds = textArray[index].length * 500;
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        return prevIndex + 1 < textArray.length ? prevIndex + 1 : 0;
      });
    }, intervalDelayMilliseconds);
    return () => clearInterval(interval);
  }, [index]);
  return (
    <CardLayout>
      <Card col="12">
        <Card.Body>
          <SError>
            <h1>{props.status}</h1>
            <p className="sub">{props.text}</p>
            <STextTransition>
              <div className="text" key={textArray[index]}>
                {textArray[index]}
              </div>
            </STextTransition>
            <Button size="large" link={`/home`}>
              Home
            </Button>
          </SError>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

const Typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const BlinkCaret = keyframes`
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #f03e3e;
  }
`;

const SError = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 60px 30px;
  .mobile & {
    padding: 30px;
  }
  h1 {
    font-size: 200px;
    line-height: 1;
    font-weight: 900;
    font-family: 'Noto Sans KR', sans-serif !important;
    .mobile & {
      font-size: 100px;
    }
  }
  .sub {
    text-align: center;
    font-size: 25px;
    font-weight: 100;
    font-family: 'Noto Sans KR', sans-serif !important;
    color: ${(p) => p.theme.gray50};
    .mobile & {
      margin-top: 0;
      font-size: 20px;
    }
  }
`;

const STextTransition = styled.div`
  margin: 50px 0;
  .text {
    font-size: 20px;
    line-height: 1.1;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid ${(p) => p.theme.red};
    margin: 0 auto;
    animation: ${Typing} 3.5s steps(30, end), ${BlinkCaret} 0.5s step-end infinite;
  }
  .mobile & {
    margin: 30px 0;
    .text {
      font-size: 12px;
    }
  }
`;

export default ErrorUi;
