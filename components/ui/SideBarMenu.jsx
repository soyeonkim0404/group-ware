import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import * as ReactIcons from 'react-icons/md';
import { Icons } from '@public/static/img';

const SideBarMenu = (props) => {
  const router = useRouter();

  const [menuList, setMenuList] = useState(props.menu);
  useEffect(() => {
    setMenuList(props.menu.map((item) => ({ ...item, openDepth: false })));
  }, []);

  useEffect(() => {
    setMenuList(props.menu);
  }, [props.menu]);

  const showDepth = (i) => {
    setMenuList(
      menuList.map((item, index) =>
        index === i && menuList[i].openDepth === false
          ? { ...item, openDepth: true }
          : { ...item, openDepth: false }
      )
    );
  };

  const getIconComponent = (iconName) => {
    let IconComponent = ReactIcons['MdArticle'];
    if (iconName && Icons[iconName]) {
      IconComponent = Icons[iconName];
    } else if (iconName && ReactIcons[iconName]) {
      IconComponent = ReactIcons[iconName];
    }

    return <IconComponent />;
  };

  return (
    <>
      {menuList.map((item, index) => {
        return (
          <li className="menu-item" key={index}>
            {item.subMenus ? (
              <>
                <button
                  type="button"
                  className={`depth-btn ${item.openDepth ? 'open' : ''}`}
                  onClick={item.subMenus && (() => showDepth(index))}
                >
                  <span className="icon">{getIconComponent(item.icon)}</span>
                  <span className="text">{item.name}</span>
                  <span className="arrow">
                    {item.openDepth ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </span>
                </button>
                <ul className={`depths-list ${item.openDepth ? ' open' : ''}`}>
                  {item.subMenus.map((depth, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          router.pathname === (depth.path?.split('?')[0] || '')
                            ? 'depth-item active'
                            : 'depth-item'
                        }
                      >
                        <Link href={depth.path}>
                          <a>
                            <span className="text">{depth.name}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <Link href={item.uri}>
                <a
                  className={
                    router.asPath.split('?')[0].startsWith(item.uri?.split('?')[0] || '')
                      ? 'active'
                      : ''
                  }
                  target={item.uri.includes('http') ? '_blank' : '_self'}
                >
                  <span className="icon">{getIconComponent(item.icon)}</span>
                  <span className="text">{item.name}</span>
                </a>
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

export default SideBarMenu;
