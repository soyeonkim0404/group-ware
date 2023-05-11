import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Card, { CardLayout } from '@components/ui/Card';
import Pagination from '@components/ui/Pagination';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import Select from '@components/ui/Select';
import Input from '@components/ui/Input';
import { MdAccountCircle } from 'react-icons/md';
import { apiGetEmployees, parallelApi } from '@api';
import usePageable from '@lib/hooks/usePageable';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { useRouter } from 'next/router';

const Index = ({ data }) => {
  const navigate = useRouter();
  const { pageable, setPageable } = usePageable();

  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState('MB200001');
  const [status, setStatus] = useState('MB100001');
  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  //const [page, setPage] = useState(location.state?.currentPage || 1);

  useEffect(() => {
    search(0, pageable.initialPage + 1);
  }, [organization, type, status]);

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
      organization: organization,
      type: type,
      status: status,
      searchOption: searchOption,
      searchValue: searchValue,
    };

    try {
      const response = await apiGetEmployees(params);
      setEmployeeData(response.data.content);

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

  /* const handelSetPage = (pageNum) => {
    navigate('/employee', { state: { currentPage: pageNum } });
    setPage(pageNum);
  };*/

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SHeaderWrap>
              <Select.Group>
                <Select
                  getSelectData={data.organization}
                  label="본부"
                  labelId="organizationLabelId"
                  selectId="organizationSelectId"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <Select
                  getSelectData={data.type}
                  label="고용 형태"
                  labelId="typeLabelId"
                  selectId="typeSelectId"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
                <Select
                  getSelectData={data.status}
                  label="재직 상태"
                  labelId="statusLabelId"
                  selectId="statusSelectId"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </Select.Group>
              <Select.Group>
                <Input
                  name="검색 값"
                  label="이름 또는 사번을 입력해주세요."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) =>
                    (e.key === 'Enter' || e.keyCode === 13) &&
                    search(0, pageable.initialPage + 1)
                  }
                  length={20}
                />
                <Button.Group>
                  <Button
                    color="primary"
                    size="large"
                    onClick={() => search(0, pageable.initialPage + 1)}
                  >
                    검색
                  </Button>
                </Button.Group>
              </Select.Group>
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">사진</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">본부</TableCell>
                  <TableCell align="center">직급</TableCell>
                  <TableCell align="center">직책</TableCell>
                  <TableCell align="center">휴대폰 번호</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData?.length > 0 ? (
                  employeeData.map((item, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">
                        {(pageable.page - 1) * pageable.size + idx + 1}
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/employee/view?id=${item.id}`}>
                          {item.profileImage ? (
                            <Image
                              src={item.profileImage}
                              alt="profile-img"
                              width={50}
                              height={50}
                              className="employee-img"
                            />
                          ) : (
                            <MdAccountCircle
                              style={{ width: 50, height: 50, color: '#ced4da' }}
                            />
                          )}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/employee/view?id=${item.id}`}>{item.name}</Link>
                      </TableCell>
                      <TableCell align="center">{item.organization}</TableCell>
                      <TableCell align="center">{item.grade}</TableCell>
                      <TableCell align="center">{item.position}</TableCell>
                      <TableCell align="center">
                        <a href={'tel:' + `${item.mobilePhone}`}>{item.mobilePhone}</a>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
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
            color="gray"
            size="large"
            link={`/employee/vacation`}
            menuCode="MN001"
            auth="W"
          >
            연차 부여
          </Button>
          <Button
            color="blue"
            size="large"
            link={`/employee/register`}
            menuCode="MN001"
            auth="W"
          >
            등록
          </Button>
        </Button.Group>
      </Button.Wrap>
      <Pagination
        totalPages={pageable.totalPages}
        initPage={pageable.initialPage}
        getPage={getPage}
        //setPage={handelSetPage}
      />
      {loading && <Loading />}
    </>
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'organization',
      url: '/api/v1/organization/selectList/part',
      method: 'get',
    },
    {
      name: 'type',
      url: '/api/v1/code/select/member/type',
      method: 'get',
    },
    {
      name: 'status',
      url: '/api/v1/code/select/member/status',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const allOption = { name: '전체', code: '' };
  const data = {
    organization: [allOption, ...response['organization']],
    type: [allOption, ...response['type']],
    status: [allOption, ...response['status']],
    searchOption: [
      { name: '전체', code: '' },
      { name: '이름', code: 'name' },
      { name: '사번', code: 'employeeNum' },
    ],
  };

  return {
    props: { data: data },
  };
});

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 17%);
  height: 100%;
  z-index: 10;
  font-size: 0;
`;

const SHeaderWrap = styled.div`
  margin: 0 0 20px;
  .mobile & {
    margin-right: 0;
    .select {
      padding-bottom: 0 !important;
    }
  }
  .group:has(button) {
    margin-left: 20px;
    padding-top: 17px;
  }
`;

export default Index;
