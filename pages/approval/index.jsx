import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Card, { CardLayout } from '@components/ui/Card';
import Pagination from '@components/ui/Pagination';
import Loading from '@components/ui/Loading';
import Select from '@components/ui/Select';
import { getPersonalApproval, parallelApi } from '@api';
import moment from 'moment/moment';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Dropdown from '@components/ui/Dropdown';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import usePageable from '@lib/hooks/usePageable';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { ToastContext } from '@components/ui/Toast';
import numberUnit from '@lib/common/common';
import { useRouter } from 'next/router';

const Index = ({ data }) => {
  const { openedModal } = useModals();

  const { pageable, setPageable } = usePageable();

  const { defaultErrorHandler } = useErrorHandler();

  const { addToast } = useContext(ToastContext);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [approvalData, setApprovalData] = useState({});
  const [approvalType, setApprovalType] = useState('');
  const { dashboardApprovalStatus } = router.query;
  const [approvalStatus, setApprovalStatus] = useState(
    dashboardApprovalStatus || 'AP100001'
  );
  const [approvalDetailTypeList, setApprovalDetailTypeList] = useState([]);
  const [approvalDetailType, setApprovalDetailType] = useState('');

  useEffect(() => {
    search(0, pageable.initialPage + 1);
  }, [approvalType, approvalStatus, approvalDetailType]);

  const getPage = (page) => {
    if (page !== pageable.page) {
      search(page - 1, pageable.initialPage);
    }
  };

  const onClickApprovalDetail = (item) => {
    openedModal(modals.ApprovalDetail, {
      props: {
        id: item.id,
        code: item.approvalTypeCode,
        passable: item.isPassable,
        recoverable: item.isRecoverable,
      },
      onSubmit: async (message) => {
        addToast('info', message);
        await search(0, pageable.initialPage + 1);
      },
    });
  };

  const onChangeApprovalStatus = (e) => {
    setApprovalStatus(e.target.value);
  };

  const onChangeApprovalType = (e) => {
    setApprovalType(e.target.value);

    if (e.target.value === 'AP200001') {
      setApprovalDetailTypeList(data.vacationType);
    } else if (e.target.value === 'AP200002') {
      setApprovalDetailTypeList(data.individualType);
    } else if (e.target.value === 'AP200004') {
      setApprovalDetailTypeList(data.corporationType);
    } else if (e.target.value === 'AP200005') {
      setApprovalDetailTypeList(data.letterType);
    } else {
      setApprovalDetailTypeList([]);
      setApprovalDetailType('');
    }
  };

  const onChangeApprovalDetailType = (e) => {
    setApprovalDetailType(e.target.value);
  };

  const search = async (page, newInitialPage) => {
    setLoading(true);

    const params = {
      page: page,
      size: pageable.size,
      approvalType: approvalType,
      approvalStatus: approvalStatus,
      approvalDetailType: approvalDetailType,
    };

    try {
      const response = await getPersonalApproval(params, null);
      setApprovalData(response.data.content);

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
                  getSelectData={data.approvalStatus}
                  label="결재 상태"
                  labelId="approvalStatusLabelId"
                  selectId="approvalStatusSelectId"
                  value={approvalStatus}
                  onChange={onChangeApprovalStatus}
                />
                <Select
                  getSelectData={data.approvalType}
                  label="결재 종류"
                  labelId="approvalTypeLabelId"
                  selectId="approvalTypeSelectId"
                  value={approvalType}
                  onChange={onChangeApprovalType}
                />
                <Select
                  getSelectData={approvalDetailTypeList}
                  label="결재 상세 종류"
                  labelId="approvalDetailTypeLabelId"
                  selectId="approvalDetailTypeSelectId"
                  value={approvalDetailType}
                  onChange={onChangeApprovalDetailType}
                  disabled={approvalDetailTypeList.length === 0}
                />
                <Dropdown
                  menuData={data.approvalTypeLink}
                  title="등록"
                  menuCode={'MN005'}
                  auth={'W'}
                />
              </Select.Group>
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">no.</TableCell>
                  <TableCell align="center">결재 구분</TableCell>
                  <TableCell align="center">결재 내용</TableCell>
                  <TableCell align="center">결재 상태</TableCell>
                  <TableCell align="center">신청자</TableCell>
                  <TableCell align="center">신청일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvalData.length > 0 ? (
                  approvalData.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">{item.no}</TableCell>
                      <TableCell align="center">
                        {item.approvalDetailType
                          ? `${item.approvalType} [${item.approvalDetailType}]`
                          : item.approvalType}
                      </TableCell>

                      <TableCell
                        align="center"
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: '#1976d2',
                        }}
                        onClick={() => onClickApprovalDetail(item)}
                      >
                        {item.approvalTypeCode === 'AP200002'
                          ? numberUnit(item.contents)
                          : item.contents}
                      </TableCell>

                      <TableCell align="center">{item.approvalStatus}</TableCell>
                      <TableCell align="center">{item.requestUser}</TableCell>
                      <TableCell align="center">
                        {moment(item.requestDatetime).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={5}>
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableItem>
          </Card.Body>
        </Card>
      </CardLayout>
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
  const parallelData = [
    {
      name: 'approvalStatus',
      url: '/api/v1/code/select/approval/status',
      method: 'get',
    },
    {
      name: 'approvalType',
      url: '/api/v1/code/select/approval/type',
      method: 'get',
    },
    {
      name: 'vacationType',
      url: '/api/v1/code/select/vacation/type',
      method: 'get',
    },
    {
      name: 'individualType',
      url: '/api/v1/code/select/payment/individual/type',
      method: 'get',
    },
    {
      name: 'letterType',
      url: '/api/v1/code/select/letter/type',
      method: 'get',
    },
    {
      name: 'corporationType',
      url: '/api/v1/code/select/corporation/type',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const allOption = { name: '전체', code: '' };
  const data = {};

  data['approvalStatus'] = response['approvalStatus'].map((e) => ({
    name: e.value,
    code: e.code,
  }));
  data['approvalStatus'].unshift(allOption);

  data['approvalType'] = response['approvalType'].map((e) => ({
    name: e.value,
    code: e.code,
  }));
  data['approvalType'].unshift(allOption);

  data['approvalTypeLink'] = response['approvalType'].map((e) => ({
    label: e.value,
    value: e.code,
    path: e.link,
  }));

  const flatArray = (arr) => {
    let result = [];
    if (!Array.isArray(arr)) return result;

    arr.forEach((item) => {
      if (item.child && item.child.length > 0) {
        result = result.concat(flatArray(item.child));
      } else {
        result = result.concat(item);
      }
    });

    return result;
  };
  data['vacationType'] = flatArray(response['vacationType']);
  data['vacationType'].unshift(allOption);

  data['individualType'] = flatArray(response['individualType']);
  data['individualType'].unshift(allOption);

  data['letterType'] = flatArray(response['letterType']);
  data['letterType'].unshift(allOption);

  data['corporationType'] = flatArray(response['corporationType']);
  data['corporationType'].unshift(allOption);

  return {
    props: { data: data },
  };
});

const SHeaderWrap = styled.div`
  margin: 0 0 20px;
  .dropdown {
    margin-top: 15px;
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
`;

export default Index;
