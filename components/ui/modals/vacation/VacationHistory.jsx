import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import Modal from '../index';
import Select from '@components/ui/Select';
import TableItem from '@components/ui/TableItem';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import styled from 'styled-components';
import { apiGetVacationList } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const VacationHistory = ({ onClose, props }) => {
  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState('');
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const joinYear = new Date(props.joinDate).getFullYear();
    const yearOption = [];

    for (let year = joinYear; year <= new Date().getFullYear(); year++) {
      yearOption.push({ code: year, value: `${year}년` });
    }
    setYearList(yearOption);

    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, [yearList]);

  useEffect(() => {
    search();
  }, [year]);

  const search = async () => {
    if (!year) return;

    const params = { year: year, user: props.user };

    try {
      setLoading(true);
      const response = await apiGetVacationList(params);
      setContents(response);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap lg`}>
        <Modal.Header closeButton={onClose}>연차 사용내역</Modal.Header>
        <Modal.Body>
          <Select
            selectId={'year'}
            getSelectData={yearList}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <SBody>
            <TableItem>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">종류</TableCell>
                  <TableCell align="center">타입</TableCell>
                  <TableCell align="center">상세</TableCell>
                  <TableCell align="center">발생/사용 연차</TableCell>
                  <TableCell align="center">잔여 연차</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {contents?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                    style={{ position: 'relative' }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{item.type}</TableCell>
                    <TableCell align="center">{item.status}</TableCell>
                    <TableCell align="center">{item.detail}</TableCell>
                    <TableCell align="center">{item.count}</TableCell>
                    <TableCell align="center">{item.remain}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableItem>
          </SBody>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} color="primary">
            확인
          </Button>
          {loading ? <Loading /> : <></>}
        </Modal.Footer>
      </div>
    </ReactModal>
  );
};

const SBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;
export default VacationHistory;
