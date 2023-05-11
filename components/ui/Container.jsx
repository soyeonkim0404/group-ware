import styled from 'styled-components';
import { useRouter } from 'next/router';
import { naviLink } from '@data/dummy';
import { pathLink } from '@data/pageLink';
import NextBreadcrumbs from '@components/ui/NextBreadcrumbs';
import * as menuActions from '@store/modules/menu';
import { useSelector } from 'react-redux';

function Container({ children }) {
  const router = useRouter();
  let title = '';
  const thisHome = router.pathname === '/home';
  const menu = useSelector(({ menu }) => menu.menu);

  pathLink.columns.forEach((item) => {
    const path = item.link?.split('?')[0] || '';
    path === router.pathname &&
      (title = (
        <h2 className="title" key={item.name}>
          {item.name}
        </h2>
      ));
  });

  menu.forEach((m) => {
    let path = m.uri;
    path === router.pathname &&
      (title = (
        <h2 className="title" key={m.name}>
          {m.name}
        </h2>
      ));

    if (router.pathname.includes('/board')) {
      const urlPath = router.asPath.split('/').filter((v) => v.length > 0);
      const menuPath = path.split('/').filter((v) => v.length > 0);
      menuPath[1] === urlPath[1] &&
        (title = (
          <h2 className="title" key={m.name}>
            {m.name}
          </h2>
        ));
    }
    if (router.pathname.includes('/mypage')) {
      title = <h2 className="title">마이페이지</h2>;
    }

    if (router.pathname === '/approval/leave') {
      title = null;
    }
  });

  return (
    <SContainerWrap>
      {!thisHome && (
        <>
          <NextBreadcrumbs />
          {title && (
            <SHead>
              <SPageTitle>{title}</SPageTitle>
            </SHead>
          )}
        </>
      )}
      {children}
    </SContainerWrap>
  );
}

const SContainerWrap = styled.div`
  width: 100%;
  padding: 30px 30px 30px 0;
  box-sizing: border-box;
  .mobile & {
    padding: 30px 20px 0;
  }
`;

const SHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 0;
  box-sizing: border-box;
  .mobile & {
    flex-direction: column;
  }
`;

const SPageTitle = styled.div`
  flex: 1 1 auto;

  .title {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    font-size: 30px;
    text-transform: uppercase;
  }
  .mobile & {
    height: 80px;
  }
`;

export default Container;
