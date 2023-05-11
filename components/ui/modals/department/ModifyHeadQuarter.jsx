import ReactModal from 'react-modal';
import ModalComponents, { modals } from '@components/ui/modals/index';
import React, { useEffect, useState } from 'react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { apiPostModifyDepartment } from '@api';
import useModals from '@lib/hooks/useModals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { MdAdd, MdRemove } from 'react-icons/md';
import TableItem from '@components/ui/TableItem';
import _ from 'lodash';
import styled from 'styled-components';
import { useForm, FormProvider } from 'react-hook-form';
import AutoLeaderInput from '@components/department/AutoLeaderInput';
import { ReadyContext } from '@lib/context/ReadyContext';

const ModifyHeadQuarter = ({ onClose, onSubmit, text, size }) => {
  const methods = useForm();
  const [hq, setHq] = useState(_.clone(text.hq));
  const [inputHQ, setInputHQ] = useState(hq.name);
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();
  const onChangeHQ = (e) => {
    setInputHQ(e.target.value);
  };
  const onSubmitHandler = async (data) => {
    // 요청 데이터 맞게 수정
    const copyMemberList = hq.memberList?.map((member) => ({
      userId: member.userId,
    }));

    await apiPostModifyDepartment({
      parentCode: hq.parentCode,
      code: hq.code,
      name: inputHQ,
      leader: data.leader,
      secondLeader: data.secondLeader,
      isDelete: false,
      memberList: copyMemberList,
    })
      .then(() => {
        const alert = modals.Alert;
        openedModal(alert, {
          text: { body: '수정이 완료되었습니다.' },
          onClose: () => {
            onSubmit();
            closeModal(alert);
          },
        });
      })
      .catch((err) => defaultErrorHandler(err, onClose));
  };

  const deleteMember = (userId) => {
    const newMemberList = hq.memberList?.filter((member) =>
      member && member.userId != userId ? true : false
    );
    setHq({ ...hq, memberList: newMemberList });
  };

  // 조직원 등록 모달
  const modalRegisterMember = (hq) => {
    openedModal(modals.RegisterMember, {
      size: 'lg',
      text: {
        header: '팀원 등록',
        data: hq,
        sectorName: text.sectorName,
        hqName: text.hqName,
      },
      onSubmit: (checkedList) => {
        checkedList.map((it) => (it['userId'] = it.id));
        if (hq.memberList) {
          setHq({ ...hq, memberList: [...hq.memberList, ...checkedList] });
        } else {
          setHq({ ...hq, memberList: checkedList });
        }
      },
    });
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <FormProvider {...methods}>
        <form
          className={`modal-wrap ${size}`}
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <ModalComponents.Header closeButton={onClose}>
            <SHeaderWrap>
              <SHeader className={'register'}>
                <SInput>
                  <Input name={hq.code} value={inputHQ} onChange={onChangeHQ} />
                </SInput>
              </SHeader>
              <SHeader>
                <div>
                  <AutoLeaderInput
                    inputId="leader"
                    label="리더"
                    organization={hq.code}
                    defaultValue={{ id: hq.leader?.userId, name: hq.leader?.name }}
                    byte={255}
                  />
                </div>

                <div>
                  <AutoLeaderInput
                    inputId="secondLeader"
                    label="대리인"
                    organization={hq.code}
                    defaultValue={{
                      id: hq.secondLeader?.userId,
                      name: hq.secondLeader?.name,
                    }}
                    byte={255}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    size={'small'}
                    color="gray"
                    onClick={() => {
                      modalRegisterMember(hq);
                    }}
                  >
                    팀원 검색
                  </Button>
                </div>
              </SHeader>
            </SHeaderWrap>
          </ModalComponents.Header>
          <ModalComponents.Body>
            <TableItem>
              <colgroup>
                <col style={{ width: '' }} />
                <col style={{ width: '' }} />
                <col style={{ width: '' }} />
                <col style={{ width: '' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">직급</TableCell>
                  <TableCell align="center">이메일</TableCell>
                  <TableCell align="center">핸드폰</TableCell>
                  <TableCell align="center">입사일</TableCell>
                  <TableCell align="center">삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hq.memberList
                  ?.sort((a, b) => a.positionSort - b.positionSort)
                  .map((p) => (
                    <TableRow key={p.userId}>
                      <TableCell align="center">{p.name}</TableCell>
                      <TableCell align="center">{p.position}</TableCell>
                      <TableCell align="center">{p.email}</TableCell>
                      <TableCell align="center">{p.mobilePhone}</TableCell>
                      <TableCell align="center">{p.joinDate}</TableCell>
                      <TableCell align="center">
                        <Button
                          icon="40"
                          color="lightGray"
                          onClick={() => {
                            deleteMember(p.userId);
                          }}
                        >
                          <MdRemove />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </TableItem>
          </ModalComponents.Body>
          <ModalComponents.Footer align="right">
            <Button type="submit" color="blue">
              등록
            </Button>
          </ModalComponents.Footer>
        </form>
      </FormProvider>
    </ReactModal>
  );
};

const SRegister = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  .text {
    color: ${(p) => p.theme.gray40};
    margin-right: 20px;
    margin-top: 5px;
    font-size: 16px;
    font-weight: 400;
  }
`;

const SHeaderWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const SHeader = styled.div`
  display: flex;
  align-items: center;
  -ms-flex: auto;
  flex: 0 0 100%;
  :nth-child(2) > div:nth-child(2) {
    margin-left: 50px;
  }
  :nth-child(2) > div:nth-child(3) {
    margin-left: auto;
  }
`;

const SInput = styled.div`
  -ms-flex: auto;
  flex: auto;
  margin-right: 10px;
`;

export default ModifyHeadQuarter;
