import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import Pagination from '@components/ui/Pagination';
import Loading from '@components/ui/Loading';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import TableItem from '@components/ui/TableItem';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Link from 'next/link';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import usePageable from '@lib/hooks/usePageable';

import { apiGetClientList } from '@api';
import Input from '@components/ui/Input';

const Index = () => {
  const { pageable, setPageable } = usePageable();

  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchOptionList] = useState([
    { code: '', value: '전체' },
    { code: 'companyName', value: '회사명' },
    { code: 'businessNumber', value: '사업자 번호' },
    { code: 'ceo', value: '대표명' },
    { code: 'phone', value: '전화번호' },
    { code: 'fax', value: '팩스번호' },
    { code: 'address', value: '주소' },
  ]);

  useEffect(() => {
    search(0, pageable.initialPage + 1);
  }, []);

  const getPage = (page) => {
    if (page !== pageable.page) {
      search(page - 1, pageable.initialPage);
    }
  };

  const search = async (page, newInitialPage) => {
    setLoading(true);

    const params = {
      page: page,
      size: pageable.size,
      searchOption: searchOption,
      searchValue: searchValue,
    };

    try {
      const response = await apiGetClientList(params);
      setClientData(response.data.content);

      setPageable({
        ...pageable,
        total: response.data.totalElements,
        totalPages: response.data.totalPages,
        page: page + 1,
      });
      if (newInitialPage !== pageable.initialPage) {
        setPageable({
          ...pageable,
          total: response.data.totalElements,
          totalPages: response.data.totalPages,
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
              <Select.Group>
                <Select
                  getSelectData={searchOptionList}
                  label="검색 조건"
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                />
                <div className="search-area">
                  <Input
                    name="검색 값"
                    label="검색어를 입력해주세요."
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
                </div>
              </Select.Group>
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">고객사</TableCell>
                  <TableCell align="center">사업자번호</TableCell>
                  <TableCell align="center">대표자</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientData?.length > 0 ? (
                  clientData.map((item, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">
                        {pageable.total - ((pageable.page - 1) * pageable.size + idx)}
                      </TableCell>
                      <TableCell align="center">
                        {item.companyNameKr}
                        <Link href={`/client/view?id=${item.id}`}>
                          <StyledLink>link</StyledLink>
                        </Link>
                      </TableCell>
                      <TableCell align="center">{item.businessNumber}</TableCell>
                      <TableCell align="center">{item.ceoName}</TableCell>
                    </TableRow>
                  ))
                ) : (
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
            link={`/client/register`}
            menuCode="MN009"
            auth="W"
          >
            고객사 등록
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

const SHeaderWrap = styled.div`
  margin: 0 0 20px;
  .select {
    .mobile & {
      width: 100%;
    }
  }
  .mobile & {
    margin-right: 0;
    .select {
      padding-bottom: 0 !important;
    }
    .dropdown {
      margin: 20px 0 0;
      width: 100%;

      .main-menu {
        width: 100%;
      }
    }
  }
  .search-area {
    display: flex;
    width: calc(100% - 280px);
    .input {
      min-width: 280px;
    }
    button {
      margin-top: 13px;
      margin-left: 20px;
    }
    .mobile & {
      width: 100%;
      margin-left: 0;
      margin-top: 20px;
    }
  }
`;

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  font-size: 0;
`;

export default Index;
