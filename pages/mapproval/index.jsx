import { useState, useEffect, useContext } from 'react';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Card, { CardLayout } from '@components/ui/Card';
import Pagination from '@components/ui/Pagination';
import Loading from '@components/ui/Loading';
import {
  apiApprovalConfirm,
  apiApprovalConfirmPage,
  apiGetVacationExcel,
  parallelApi,
} from '@api';
import moment from 'moment/moment';
import CheckBox from '@components/ui/CheckBox';
import SelectItem from '@components/ui/Select';
import styled from 'styled-components';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import Button from '@components/ui/Button';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';
import usePageable from '@lib/hooks/usePageable';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import Select from '@components/ui/Select';
import { ToastContext } from '@components/ui/Toast';
import Input from '@components/ui/Input';
import Dropdown from '@components/ui/Dropdown';
import { dropdownMenu, dropdownMenu2 } from '@data/dummy';
import { createExcel, downloadExcel } from '@lib/common/excel';

const Index = ({ data }) => {
  const { openedModal } = useModals();

  const { pageable, setPageable } = usePageable();

  const { defaultErrorHandler } = useErrorHandler();

  const { addToast } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  const [approvalType, setApprovalType] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalDetailTypeList, setApprovalDetailTypeList] = useState([]);
  const [approvalDetailType, setApprovalDetailType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [excelYear, setExcelYear] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = 0; i < 5; i++) {
      yearList.push({
        path: '#',
        label: `${currentYear - i}년`,
        value: currentYear - i,
        event: async (e) => {
          e.preventDefault();

          await onClickExcelDownload(currentYear - i);
        },
      });
    }

    setExcelYear(yearList);
  }, []);

  useEffect(() => {
    search(0, pageable.initialPage + 1);
  }, [approvalType, approvalStatus, approvalDetailType]);

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
      approvalType: approvalType,
      approvalStatus: approvalStatus,
      approvalDetailType: approvalDetailType,
      searchValue: searchValue,
    };

    try {
      const response = await apiApprovalConfirmPage(params, null);
      response.data.content.forEach((item) => (item.isChecked = false));
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

  const onClickApprovalDetail = (item) => {
    openedModal(modals.ApprovalDetail, {
      props: { id: item.id, code: item.approvalTypeCode, manager: true },
      onSubmit: async (message) => {
        if (message === '완료되었습니다.') {
          addToast('info', message);
        } else {
          addToast('error', message);
        }
        await search(0, pageable.initialPage + 1);
      },
    });
  };

  const onChangeApprovalType = (e) => {
    setApprovalType(e.target.value);
    setApprovalDetailType('');

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
    }
  };

  const onChangeApprovalStatus = (e) => {
    setApprovalStatus(e.target.value);
  };

  const onChangeApprovalDetailType = (e) => {
    setApprovalDetailType(e.target.value);
  };

  const onChangeAllCheckbox = (e) => {
    const data = approvalData.map((item) =>
      item.approvalStatusCode === 'AP100005'
        ? { ...item, isChecked: e.target.checked }
        : { ...item }
    );

    setApprovalData(data);
  };

  const onChangeCheckbox = (e, id) => {
    const data = approvalData.map((item) =>
      item.id === id ? { ...item, isChecked: e.target.checked } : item
    );

    setApprovalData(data);
  };

  const onClickAllConfirm = async (e) => {
    const approvalList = approvalData.filter(
      (item) => item.isChecked && item.approvalStatusCode === 'AP100005'
    );

    if (approvalList.length <= 0) return;

    setLoading(true);

    try {
      const approvalIdList = approvalList.map((o) => o.id);
      await apiApprovalConfirm({ approvalIds: approvalIdList });

      openedModal(modals.Alert, {
        text: { body: '완료되었습니다.' },
      });
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }

    await search(0, pageable.initialPage + 1);
  };

  const onClickExcelDownload = async (year) => {
    let data = await apiGetVacationExcel({ year: year });
    data = data.map((row) => ({
      ...row,
      history: (row.history || '').replaceAll(' | ', '\r\n'),
    }));

    const header = [
      { header: '성명', key: 'name', width: 10 },
      { header: '본부', key: 'organization', width: 15 },
      { header: '직책', key: 'position', width: 10 },
      { header: '직급', key: 'grade', width: 10 },
      { header: '입사일', key: 'joinDate', width: 12 },
      { header: '종류', key: 'vacationType', width: 12 },
      { header: '지급', key: 'grant', width: 8 },
      { header: '조정', key: 'modify', width: 8 },
      { header: '사용', key: 'use', width: 8 },
      { header: '소멸', key: 'delete', width: 8 },
      { header: '사용 내역', key: 'history', width: 50, style: { wrapText: true } },
      { header: '잔여', key: 'remain', width: 8 },
    ];

    const workbook = createExcel(header, data, '연차 사용 내역');
    const worksheet = workbook.getWorksheet('연차 사용 내역');

    worksheet.eachColumnKey(
      (column) => (column.alignment = { horizontal: 'center', vertical: 'middle' })
    );
    worksheet.getColumn('history').alignment = {
      wrapText: true,
    };
    worksheet.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A1' }];

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.lastColumn.number },
    };

    await downloadExcel(workbook, `${year}년 연차 사용 현황`);
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SHeaderWrap>
              <Select.Group>
                <SelectItem
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
                <Select
                  getSelectData={data.approvalStatus}
                  label="결재 상태"
                  labelId="approvalStatusLabelId"
                  selectId="approvalStatusSelectId"
                  value={approvalStatus}
                  onChange={onChangeApprovalStatus}
                />
              </Select.Group>
              <div className="section">
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
                {excelYear.length > 0 && (
                  <Dropdown
                    menuData={excelYear}
                    title="연차 현황(엑셀)"
                    menuCode="MN006"
                    auth="W"
                  />
                )}
              </div>
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <CheckBox onChange={onChangeAllCheckbox} />
                  </TableCell>
                  <TableCell align="center">결재 구분</TableCell>
                  <TableCell align="center">내용</TableCell>
                  <TableCell align="center">상태</TableCell>
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
                      <TableCell align="center">
                        <CheckBox
                          checked={item.isChecked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onChangeCheckbox(e, item.id)}
                          disabled={item.approvalStatusCode !== 'AP100005'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.approvalDetailType
                          ? `${item.approvalType} [${item.approvalDetailType}]`
                          : item.approvalType}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => onClickApprovalDetail(item)}
                      >
                        {item.contents}
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
      <Button.Wrap>
        <Button.Group>
          <Button
            onClick={onClickAllConfirm}
            color="blue"
            size="large"
            disabled={approvalData.filter((item) => item.isChecked).length === 0}
            menuCode={'MN006'}
            auth={'W'}
          >
            일괄 확인
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
  const parallelData = [
    {
      name: 'approvalType',
      url: '/api/v1/code/select/approval/type',
      method: 'get',
    },
    {
      name: 'approvalStatus',
      url: '/api/v1/code/select/approval/status',
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

  data['approvalType'] = response['approvalType'].map((e) => ({
    name: e.value,
    code: e.code,
  }));
  data['approvalType'].unshift(allOption);

  data['approvalStatus'] = response['approvalStatus'].map((e) => ({
    name: e.value,
    code: e.code,
  }));
  data['approvalStatus'].unshift(allOption);

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
  .section {
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    .input-group {
      flex: 0 1 calc(100% - 210px);
      align-items: flex-end;
      margin-right: 10px;
      .input {
        padding-bottom: 0;
      }
    }
    .mobile & {
      display: block;
      .input-group {
        flex: none;
        display: flex;
        margin-right: 0;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        .input {
          flex: 0 0 calc(100% - 110px);
        }
        button {
          flex: 0 0 100px;
        }
      }
      .dropdown {
        margin-left: auto;
      }
    }
  }
  .input {
    margin-right: 10px;
  }
  .mobile & {
    margin-right: 0;
    .select,
    .input {
      padding-bottom: 0 !important;
    }
    button {
      margin: 20px 0 0;
      width: 100%;
    }
  }
`;

export default Index;
