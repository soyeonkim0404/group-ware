import styled from 'styled-components';
import SideBar from '@layouts/SideBar';
import { useEffect, useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';

const Header = () => {
  const [mbToggle, setMbToggle] = useState(false);
  const router = useRouter();
  const sidebarToggle = () => {
    setMbToggle(!mbToggle);
    if (!mbToggle) {
      document.body.classList.remove('fff');
    } else {
      document.body.classList.add('fff');
    }
  };
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setMbToggle(false);
      document.body.classList.remove('fff');
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
  return (
    <>
      <HeadWrap>
        <MdMenu className="menu-icon" onClick={sidebarToggle} />
      </HeadWrap>
      <MobileSidebar className={mbToggle && 'open'}>
        <Dim onClick={sidebarToggle} />
        <Inner>
          <SideBar />
          <MdClose className="mb-close" onClick={sidebarToggle} />
        </Inner>
      </MobileSidebar>
    </>
  );
};

const HeadWrap = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #ffffff;
  z-index: 99;
  padding: 0 30px;
  box-sizing: border-box;
  .menu-icon {
    display: flex;
    font-size: 24px;
    color: #212529;
  }
`;

const MobileSidebar = styled.div`
  position: relative;
  z-index: 100;
`;
const Dim = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: all 0.3s;
  .open & {
    opacity: 1;
    visibility: visible;
  }
`;

const Inner = styled.div`
  position: fixed;
  width: 70%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s;
  .sidebar {
    flex: none;
    margin: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    .toggle-btn {
      display: none;
    }
    .profile {
      width: 100%;
      left: 0;
      bottom: 0;
      border-radius: 0;
    }
  }
  .mb-close {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 25px;
    z-index: 101;
  }
  .open & {
    transform: translateX(0);
  }
`;

export default Header;
