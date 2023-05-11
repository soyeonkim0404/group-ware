import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import TableItem from '@components/ui/TableItem';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Pagination from '@components/ui/Pagination';
import Loading from '@components/ui/Loading';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import { apiGetBoardInfo, apiGetPostPage } from '@api';
import usePageable from '@lib/hooks/usePageable';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import moment from 'moment';
import Input from '@components/ui/Input';

const Index = ({ boardInfo }) => {
  const router = useRouter();
  const { board } = router.query;

  const { pageable, setPageable } = usePageable();

  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    search(0, pageable.initialPage + 1, true);

    return () => {
      setSearchValue('');
      setPosts([]);
      setNotices([]);
    };
  }, [boardInfo]);

  const getPage = (page) => {
    if (page !== pageable.page) {
      search(page - 1, pageable.initialPage);
    }
  };

  const search = async (page, newInitialPage, isFirst = false) => {
    setLoading(true);

    const params = {
      page: page,
      size: pageable.size,
      boardId: boardInfo.id,
      searchOption: '',
      searchValue: isFirst ? '' : searchValue,
    };

    try {
      const response = await apiGetPostPage(params, null);
      setPosts(response.page.content);
      setNotices(response.notice);

      setPageable({
        ...pageable,
        total: response.page.totalElements,
        totalPages: response.page.totalPages,
        page: page + 1,
      });
      if (newInitialPage !== pageable.initialPage) {
        setPageable({
          ...pageable,
          total: response.page.totalElements,
          totalPages: response.page.totalPages,
          page: page + 1,
          initialPage: newInitialPage,
        });
      }
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SHeaderWrap>
              <Input.Group>
                <Input
                  name="검색 값"
                  label="검색"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) =>
                    (e.key === 'Enter' || e.keyCode === 13) &&
                    search(0, pageable.initialPage + 1)
                  }
                  length={333}
                />
                <Button
                  color="primary"
                  size="large"
                  onClick={() => search(0, pageable.initialPage + 1)}
                >
                  검색
                </Button>
              </Input.Group>
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '17%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">번호</TableCell>
                  <TableCell align="center">제목</TableCell>
                  <TableCell align="center">작성자</TableCell>
                  <TableCell align="center">조회수</TableCell>
                  <TableCell align="center">날짜</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.length > 0 &&
                  notices.map((post) => (
                    <TableRow
                      key={post.id}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">공지</TableCell>
                      <TableCell
                        align="center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/board/${board}/view?id=${post.id}`)}
                      >
                        {post.title}
                      </TableCell>
                      <TableCell align="center">{post.user}</TableCell>
                      <TableCell align="center">{post.hit}</TableCell>
                      <TableCell align="center">
                        {moment(post.date).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))}

                {posts.length > 0 &&
                  posts.map((post) => (
                    <TableRow
                      key={post.id}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">{post.no}</TableCell>
                      <TableCell
                        align="center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/board/${board}/view?id=${post.id}`)}
                      >
                        {post.title}
                      </TableCell>
                      <TableCell align="center">{post.user}</TableCell>
                      <TableCell align="center">{post.hit}</TableCell>
                      <TableCell align="center">
                        {moment(post.date).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))}

                {notices.length <= 0 && posts.length <= 0 && (
                  <TableRow>
                    <TableCell align="center" colSpan={3}>
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableItem>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button
            color="blue"
            size="large"
            link={`/board/${board}/register`}
            menuCode={boardInfo.menuCode}
            auth={'W'}
          >
            등록
          </Button>
        </Button.Group>
      </Button.Wrap>
      <Pagination
        totalPages={pageable.totalPages}
        initPage={pageable.initialPage}
        getPage={getPage}
      />
      {loading && <Loading />}
    </>
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const { board } = context.query;
  const boardInfo = await apiGetBoardInfo({ name: board }, context);

  return {
    props: { boardInfo },
  };
});

const SHeaderWrap = styled.div`
  margin: 0 0 20px;
  .input {
    margin-right: 20px;
  }
  .mobile & {
    .input {
      margin-right: 0;
      padding-bottom: 0 !important;
    }
    button {
      margin: 20px 0 0;
      width: 100%;
    }
  }
  .input-group {
    align-items: flex-end;
    margin-bottom: 40px;
    .input {
      padding-bottom: 0;
    }
  }
`;

export default Index;
