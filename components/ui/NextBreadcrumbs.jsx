import styled from 'styled-components';
import { Breadcrumbs, Link } from '@mui/material';
import { useRouter } from 'next/router';

const NextBreadcrumbs = () => {
  const router = useRouter();
  const generateBreadcrumbs = () => {
    const breadcrumbPath = router.asPath.split('/').filter((v) => v.length > 0);

    const crumblist = breadcrumbPath.map((subpath, idx) => {
      const href = '/' + breadcrumbPath.slice(0, idx + 1).join('/');
      let title = subpath;
      if (title.indexOf('?') > -1) {
        title = title.substring(0, title.indexOf('?'));
      }
      return { href, title };
    });
    return [{ title: 'Home', href: '/home' }, ...crumblist];
  };
  return (
    <SBreadcrumb className="breadcrumb">
      <Breadcrumbs aria-label="breadcrumb">
        {generateBreadcrumbs().map((path, idx) => {
          return (
            /*<Link key={idx} href={path.href}>*/
            <Link key={idx} href="#">
              <SBreadcrumbDetail>{path.title}</SBreadcrumbDetail>
            </Link>
          );
        })}
      </Breadcrumbs>
    </SBreadcrumb>
  );
};

const SBreadcrumb = styled.div`
  nav {
    padding-left: 30px;
    a {
      text-decoration: none;
    }
    li {
      font-size: 12px;
    }
    li:last-child {
      span {
        color: ${(p) => p.theme.gray10};
      }
    }
  }
`;
const SBreadcrumbDetail = styled.span`
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  color: ${(p) => p.theme.gray30};
`;

export default NextBreadcrumbs;
