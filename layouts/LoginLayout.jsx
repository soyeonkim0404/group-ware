import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

function LoginLayout(props) {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: '(max-width:767px)' });

  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  return (
    <SCleanLayout className={isMobile ? 'mobile' : 'pc'}>
      <SVideo>
        <video
          muted="muted"
          autoPlay="autoPlay"
          loop="loop"
          playsInline
          width="100%"
          height="100%"
          poster="/static/img/login-bg.png"
        >
          <source
            src="https://m.emotion.co.kr/mo/media/emotion_mobile.37457db9.mp4"
            type="video/mp4"
          />
        </video>
      </SVideo>
      <SCleanContent>{props.children}</SCleanContent>
    </SCleanLayout>
  );
}
const SVideo = styled.div`
  width: 100vw;
  height: 100vh;
  video {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
  }
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    /*.mobile & {
      display: none;
    }*/
  }
`;
const SCleanLayout = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;

const SCleanContent = styled.div`
  .mobile & {
    margin: 0 auto;
    box-sizing: border-box;
  }
`;

export default LoginLayout;
