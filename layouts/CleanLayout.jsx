import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

function CleanLayout(props) {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: '(max-width:767px)' });

  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  return (
    <SCleanLayout className={isMobile ? 'mobile' : 'pc'}>
      <SCleanContent>{props.children}</SCleanContent>
    </SCleanLayout>
  );
}

const SCleanLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: ${(p) => p.theme.gray90};
`;

const SCleanContent = styled.div`
  padding: 30px 30px 30px 0;
  .mobile & {
    width: 100%;
    margin: 0 auto;
    padding: 30px 20px 0;
    box-sizing: border-box;
  }
`;

export default CleanLayout;
