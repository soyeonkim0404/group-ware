import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@components/ui/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ModalComponents from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import AutoFormInput from '@components/ui/AutoFormInput';
import { MdClose } from 'react-icons/md';
import Content from '@components/ui/Content';
import { useSelector } from 'react-redux';

const ApprovalAdd = ({ title, onClose, onSubmit, already = [] }) => {
  const methods = useForm();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [approvalUser, setApprovalUser] = useState([]);
  const profile = useSelector(({ profile }) => profile);

  useEffect(() => {
    setLoading(false);
  }, []);

  const onClickAutoForm = (item) => {
    if (profile.id === item.id) {
      return setErrorMsg({ person: ['본인은 결재자로 등록할 수 없습니다.'] });
    }

    if (already.includes(item.id) || approvalUser.find((user) => user.id === item.id)) {
      return setErrorMsg({ person: ['이미 등록된 결재선 입니다.'] });
    }

    setErrorMsg('');
    setApprovalUser((prevState) => [
      ...prevState,
      { ...item, no: approvalUser.length + 1 },
    ]);
  };

  const onClickDelete = (item) => {
    const newApprovalUser = approvalUser
      .filter((user) => user.id !== item.id)
      .map((user, index) => ({ ...user, no: index + 1 }));

    setApprovalUser(newApprovalUser);
  };

  const onClickSubmit = () => {
    if (approvalUser.length <= 0)
      return setErrorMsg({ person: ['결재선을 추가해주세요.'] });
    onSubmit(approvalUser.map((user) => ({ userId: user.id, sort: user.no })));
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap`}>
        <ModalComponents.Header closeButton={onClose}>{title}</ModalComponents.Header>
        <ModalComponents.Body align="center">
          <TableContainer>
            <Table sx={{ marginBottom: 3 }} aria-label="table">
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">no.</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvalUser.length > 0 ? (
                  approvalUser.map((user) => (
                    <TableRow
                      key={user.no}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">{user.no}</TableCell>
                      <TableCell align="center">{user.name}</TableCell>
                      <TableCell align="center">
                        <MdClose
                          style={{ cursor: 'pointer' }}
                          onClick={() => onClickDelete(user)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <FormProvider {...methods}>
            <AutoFormInput
              inputId="person"
              label="구성원"
              byte={255}
              onClickEvent={(item) => onClickAutoForm(item)}
              error={errorMsg}
            />
          </FormProvider>
          {loading && <Loading />}
        </ModalComponents.Body>
        <ModalComponents.Footer>
          <Button onClick={onClickSubmit} color="primary">
            확인
          </Button>
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default ApprovalAdd;
