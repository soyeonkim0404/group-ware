import styled from 'styled-components';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Pagination from '@components/ui/Pagination';
import SelectItem from '@components/ui/Select';
import Card, { CardLayout } from '@components/ui/Card';
import Input from '@components/ui/Input';
import { useState, useEffect } from 'react';
import { apiPostCommuteList, getPartList } from '@api';
import useModals from '@lib/hooks/useModals';
import { useRouter } from 'next/router';
import Loading from '@components/ui/Loading';
import moment from 'moment/moment';
import usePageable from '@lib/hooks/usePageable';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import Button from '@components/ui/Button';

const Index = () => {
  const [part, setPart] = useState('');
  const [date, setDate] = useState('');
  const [pageReady, setPageReady] = useState(false);
  const [commuteData, setCommuteData] = useState([]);
  const [partList, setPartList] = useState([]);
  // 모달 훅
  const { openedModal } = useModals();
  const router = useRouter();
  const { pageable, setPageable } = usePageable();
  const { defaultErrorHandler } = useErrorHandler();

  const getPage = (newPage) => {
    if (newPage != pageable.page) {
      search(newPage - 1, pageable.initialPage);
    }
  };

  // 페이지 처음 로딩
  useEffect(() => {
    getPartList()
      .then((resp) => {
        const list = [{ name: '본부선택', code: '' }];
        resp.data.forEach((item, index) => {
          list.push({ name: item.name, code: item.code });
        });
        setPartList(list);
        search(0, pageable.initialPage);
      })
      .catch((err) => {
        defaultErrorHandler(err);
      });
  }, []);

  // 본부, 일자 변경에 의존한 검색
  useEffect(() => {
    search(0, pageable.initialPage + 1);
  }, [part, date]);

  // 부서 선택 핸들러
  const partHandler = (e) => {
    setPart(e.target.value);
  };

  // 데이터 핸들러
  const dateHandler = (e) => {
    setDate(e.target.value);
  };

  // 검색 기능
  const search = async (number, newInitialPage) => {
    const params = {
      page: number, // 0
      size: pageable.size,
      sort: ['id', 'desc'],
      part,
      date,
    };

    try {
      const resp = await apiPostCommuteList(params);
      setCommuteData(resp.data.content);
      setPageable({
        ...pageable,
        total: resp.data.totalElements,
        totalPages: resp.data.totalPages,
        page: number + 1,
      });
      if (newInitialPage != pageable.initialPage) {
        setPageable({
          ...pageable,
          total: resp.data.totalElements,
          totalPages: resp.data.totalPages,
          page: number + 1,
          initialPage: newInitialPage,
        });
      }
    } catch (err) {
      defaultErrorHandler(err);
    }

    // pageReady가 false 일때만 true로 변경
    if (!pageReady) {
      setPageReady(true);
    }
  };

  return pageReady ? (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SInputHead>
              <SelectItem
                getSelectData={partList}
                label="본부선택"
                labelId="partLabelId"
                selectId="partSelectId"
                value={part}
                onChange={partHandler}
              />
              <Input
                name="date"
                type="date"
                label="일자"
                value={date}
                formatDate={date}
                onChange={dateHandler}
              />
            </SInputHead>
            <TableItem>
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">본부</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">위치</TableCell>
                  <TableCell align="center">출근일시</TableCell>
                  <TableCell align="center">퇴근일시</TableCell>
                  <TableCell align="center">상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commuteData?.map((item, idx) => (
                  <TableRow
                    key={idx}
                    onClick={() => {
                      router.push('/commute/view?id=' + item.id);
                    }}
                  >
                    <TableCell align="center">
                      {pageable.total - ((pageable.page - 1) * pageable.size + idx)}
                    </TableCell>
                    <TableCell align="center">{item.part}</TableCell>
                    <TableCell align="center">{item.userName} </TableCell>
                    <TableCell align="center">{item.onAddress}</TableCell>
                    <TableCell align="center">
                      {item.onDatetime &&
                        moment(item.onDatetime).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                    <TableCell align="center">
                      {item.offDatetime &&
                        moment(item.offDatetime).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                    <TableCell align="center">{item.status}</TableCell>
                  </TableRow>
                ))}
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
            link={`/commute/register`}
            menuCode="MN004"
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
      />
    </>
  ) : (
    <Loading />
  );
};

const SInputHead = styled.div`
  display: flex;
  justify-content: flex-end;
  .select {
  }
  .input {
    margin-left: 2% !important;
    .pc & {
      max-width: 280px;
    }
  }
`;

export default Index;
