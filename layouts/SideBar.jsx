import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SideBarMenu from '@components/ui/SideBarMenu';
import { useRouter } from 'next/router';
import { MdMenuOpen, MdOutlineMenu } from 'react-icons/md';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'js-cookie';
import * as profileActions from '@store/modules/profile';
import * as menuActions from '@store/modules/menu';
import { naviLink } from '@data/dummy';

const SideBar = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const profile = useSelector(({ profile }) => profile);

  const menu = useSelector(({ menu }) => menu.menu);

  const [toggle, setToggle] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [sidebarClick, setSidebarClick] = useState('');
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setMenuList(router.pathname.includes('/guide') ? naviLink : menu);
    } else {
      setMenuList(menu);
    }
  }, []);
  //사이드 바 토글
  const sidebarToggle = () => {
    setToggle(!toggle);
    setIsClicked(!isClicked);
  };
  //사이드 바 마우스 이벤트
  const sidebarEnter = () => {
    if (isClicked) {
      setIsClicked(!isClicked);
      setSidebarClick('mini');
    } else {
      toggle && setSidebarClick('mini mouse-enter');
    }
  };

  //사이드 바 마우스 이벤트
  const sidebarLeave = () => {
    !toggle ? setSidebarClick('') : setSidebarClick('mini');
  };

  const logout = () => {
    dispatch(profileActions.logout());
    dispatch(menuActions.destroy());
    cookies.remove('token');
    router.push('/');
  };

  return (
    <div
      className={`sidebar ${sidebarClick}`}
      onMouseEnter={() => {
        sidebarEnter();
      }}
      onMouseLeave={() => {
        sidebarLeave();
      }}
    >
      <div className="inner">
        <div className="top">
          <Link href="/home">
            <a className="logo">
              <SLogoImage>
                <Image src="/static/img/logo.png" alt="logo" layout="fill" />
              </SLogoImage>
            </a>
          </Link>
          <button className="toggle-btn" onClick={sidebarToggle}>
            {toggle ? <MdOutlineMenu /> : <MdMenuOpen />}
          </button>
        </div>
        <div className="category">
          <div className="cate-inner">
            <SFixCate>
              <ul className="menu-list">
                <li className="menu-item">
                  <Link href="/home">
                    <a>
                      <span className="icon">
                        <Image src="/static/img/ic-home.svg" alt="home" layout="fill" />
                      </span>
                      <span className="text">Home</span>
                    </a>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/mypage">
                    <a>
                      <span className="icon">
                        <Image
                          src="/static/img/ic-mypage.svg"
                          alt="mypage"
                          layout="fill"
                        />
                      </span>
                      <span className="text">Mypage</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </SFixCate>
            <ul className="menu-list">
              <SideBarMenu menu={menuList} />
            </ul>
          </div>
        </div>
        <div className="profile">
          <div className="user">
            <div className="img">
              <Link href={'/mypage'}>
                <a>
                  <Image
                    src={
                      profile && profile.profileImage
                        ? profile.profileImage
                        : '/static/img/noImg.svg'
                    }
                    alt="profile-img"
                    width={100}
                    height={100}
                  />
                </a>
              </Link>
            </div>
            {sidebarClick !== 'mini' && (
              <div className="info">
                <span className="name">
                  {profile && profile.name} {profile && profile.grade}
                </span>
                <span className="team">
                  {profile && `${profile.organization || ''} ${profile.part || ''}`}
                </span>
              </div>
            )}
          </div>
          {sidebarClick !== 'mini' && (
            <div className="bottom">
              <button className="logout" onClick={logout}>
                <Image src="/static/img/ic-logout.svg" alt="logout" layout="fill" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SFixCate = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(p) => p.theme.gray70};
  .menu-list {
    .menu-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      > a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        min-height: 40px;
        box-sizing: border-box;
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 30px;
          width: 20px;
          height: 20px;
          span {
            position: relative !important;
            width: 20px !important;
            height: 20px !important;
          }
        }
      }
      & + .menu-item {
        margin-top: 5px !important;
      }
    }
  }
`;

const SLogoImage = styled.div`
  width: 100px;
  height: 30px;
  position: relative;
  img {
    width: 100% !important;
    height: auto !important;
    object-fit: contain;
  }
`;

export default SideBar;
