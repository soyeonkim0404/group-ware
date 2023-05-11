import Header from '@layouts/Header';
import SideBar from '@layouts/SideBar';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Container from '@components/ui/Container';
import styled from 'styled-components';
import Script from 'next/script';
import Head from 'next/head';

const Index = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const mobile = useMediaQuery({ query: '(max-width:767px)' });

  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  return (
    <>
      <Head>
        <title>e-motion groupware</title>
      </Head>
      <SWrap className={isMobile ? 'mobile' : 'pc'}>
        <Script
          id="kakaoPostCodeAPI"
          src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        />
        {isMobile ? (
          <SMain>
            <Header />
            <Container>{children}</Container>
          </SMain>
        ) : (
          <>
            <SideBar>{children}</SideBar>
            <SMain>
              <Container>{children}</Container>
            </SMain>
          </>
        )}
      </SWrap>
    </>
  );
};

const SMain = styled.main`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-left: 340px;
  padding-bottom: 80px;
  box-sizing: border-box;
  .mobile & {
    padding-left: 0 !important;
    padding-bottom: 180px;
  }
`;

const SWrap = styled.div`
  display: flex;
  background: ${(p) => p.theme.gray90};
  max-height: 100%;
`;

export default Index;
