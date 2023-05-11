import React, { useEffect, useState } from 'react';
import {
  MdOutlineChevronLeft,
  MdOutlineChevronRight,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
} from 'react-icons/md';
import styled from 'styled-components';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { authCheck } from '../../util/authCheck';

const Dropdown = ({ menuData, title, menuCode, auth, userId }) => {
  const store = useSelector((store) => store);

  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [arrLength, setArrLength] = useState(0);
  const [option, setOption] = useState('');
  const [result, setResult] = useState('');
  const onChange = (e) => {
    setOption(e.target.value);
  };
  useEffect(() => {
    setArrLength(menuData.length);
  }, []);

  const ToggleDropdown = (el) => {
    setResult(el);
    setDropdownToggle(!dropdownToggle);
  };
  const ToggleSubMenu = (menu) => {
    if (menu) {
      const subMenus = document.getElementsByClassName('sub-menu');
      for (let s of subMenus) {
        s.classList.remove('open');
      }
      const subMenu = document.getElementById(menu);
      subMenu?.classList.add('open');
    }
    const mainMenu = document.getElementById('menu-inner');
    mainMenu?.classList.toggle('open');
  };
  return (
    authCheck(store, menuCode, auth, userId) && (
      <SDropdown className={dropdownToggle ? 'dropdown open' : 'dropdown'}>
        <button className="btn-dropdown" onClick={ToggleDropdown}>
          {title}
          {dropdownToggle ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
        </button>
        <div
          className="menu"
          style={{
            height: dropdownToggle ? `${arrLength * 56}px` : 0,
          }}
        >
          <div id="menu-inner" className="menu-inner">
            <div className="main-menu">
              {menuData &&
                menuData.map((item, index) =>
                  item.child ? (
                    <button
                      key={index}
                      onClick={() => {
                        ToggleSubMenu(item.value);
                      }}
                      className="item"
                    >
                      {item.label || item.value}
                      <MdOutlineChevronRight />
                    </button>
                  ) : (
                    <Link href={`${item.path}`} key={item.value}>
                      <a className="item" onClick={(e) => item.event && item.event(e)}>
                        {item.label || item.value}
                      </a>
                    </Link>
                  )
                )}
            </div>
            {menuData &&
              menuData.map((menu) => (
                <div id={menu.value} className="sub-menu" key={menu.value}>
                  <button onClick={ToggleSubMenu} className="item">
                    <MdOutlineChevronLeft />
                    back
                  </button>
                  {menu.child &&
                    menu.child.map((v) =>
                      v.path ? (
                        <Link href={`${v.path}`} key={v.value}>
                          <a className="item">{v.label || v.value}</a>
                        </Link>
                      ) : (
                        <button
                          key={v.value}
                          className="item"
                          onClick={() => ToggleDropdown(v)}
                        >
                          {v.label || v.value}
                        </button>
                      )
                    )}
                </div>
              ))}
          </div>
        </div>
      </SDropdown>
    )
  );
};

const SDropdown = styled.div`
  position: relative;
  width: 200px;
  .btn-dropdown {
    position: relative;
    width: 100%;
    padding: 6px 15px 6px 20px;
    z-index: 2;
    transition: 0.3s;
    color: ${(p) => p.theme.white};
    background: ${(p) => p.theme.blue};
    box-sizing: border-box;
    &:hover {
      opacity: 0.5;
    }
    svg {
      font-size: 30px;
    }
  }
  &.open {
    > button {
      background: ${(p) => p.theme.blue};
    }
    .menu {
      opacity: 1;
      translate: 0;
      visibility: visible;
      z-index: 10;
    }
  }
  button,
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    color: ${(p) => p.theme.gray10};
    background: ${(p) => p.theme.white};
    border: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .menu {
    position: absolute;
    overflow: hidden;
    z-index: 1;
    top: 56px;
    left: 0;
    width: 100%;
    height: 0;
    opacity: 0;
    visibility: hidden;
    border-radius: 4px;
    border-top: 0;
    background: ${(p) => p.theme.gray90};
    translate: 0 -20px;
    transition: 0.4s;
    box-shadow: ${(p) => p.theme.boxShadow};
    button,
    .item {
      border: 0;
      width: 100%;
      height: 56px;
      border-radius: 0;
      padding: 0 15px 0 20px;
      box-sizing: border-box;
      &:hover {
        opacity: 0.5;
      }
    }
    button {
      svg {
        font-size: 20px;
      }
    }
  }
  .main-menu {
    width: 200px;
  }
  .menu-inner {
    position: absolute;
    width: 400px;
    display: flex;
    transition: 0.3s;
    &.open {
      translate: -50%;
    }
  }
  .sub-menu {
    display: none;
    width: 230px;
    &.open {
      display: block;
    }
    button,
    .item {
      padding: 0 20px 0 30px;
    }
  }
`;

export default Dropdown;
