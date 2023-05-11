import ReactModal from 'react-modal';
import ModalComponents from '@components/ui/modals/index';
import React, { useContext, useEffect, useState } from 'react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { apiPostModifyDepartment } from '@api';
import useModals from '@lib/hooks/useModals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { modals } from '@components/ui/modals/index';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { MdAdd, MdRemove } from 'react-icons/md';
import TableItem from '@components/ui/TableItem';
import styled from 'styled-components';
import _ from 'lodash';
import AutoLeaderInput from '@components/department/AutoLeaderInput';
import { useForm, FormProvider } from 'react-hook-form';
import { ReadyContext } from '@lib/context/ReadyContext';

const ModifyTeam = ({ onClose, onSubmit, text, size }) => {
  const methods = useForm();
  const [team, setTeam] = useState(_.clone(text.team));
  const [inputTeam, setInputTeam] = useState(team.name);
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();
  const [isReady, setReady] = useContext(ReadyContext);
  const onSubmitHandler = (data) => {
    setReady(false);
    // 요청 데이터 맞게 수정
    const copyMemberList = team.memberList?.map((member) => ({
      userId: member.userId,
    }));

    // 조직원 수정 api 호출
    apiPostModifyDepartment({
      parentCode: team.parentCode,
      code: team.code,
      name: inputTeam,
      memberList: copyMemberList,
      leader: data.leader,
      secondLeader: data.secondLeader,
      isDelete: false,
    })
      .then(() => {
        setReady(true);
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
  // 팀 이름 수정
  const changeTeamName = (e) => {
    setInputTeam(e.target.value);
  };

  // 조직원 삭제
  const deleteMember = (userId) => {
    const newMemberList = team.memberList?.filter((member) =>
      member && member.userId != userId ? true : false
    );
    setTeam({ ...team, memberList: newMemberList });
  };

  // 조직원 등록 모달
  const modalRegisterMember = (team) => {
    openedModal(modals.RegisterMember, {
      size: 'lg',
      text: {
        header: '팀원 등록',
        data: team,
        sectorName: text.sectorName,
        hqName: text.hqName,
      },
      onSubmit: (checkedList) => {
        checkedList.map((it) => (it['userId'] = it.id));
        if (team.memberList) {
          setTeam({ ...team, memberList: [...team.memberList, ...checkedList] });
        } else {
          setTeam({ ...team, memberList: checkedList });
        }
      },
    });
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          className={`modal-wrap ${size}`}
          style={{ width: '900px' }}
        >
          <ModalComponents.Header closeButton={onClose}>
            <SHeaderWrap>
              <SHeader className={'register'}>
                <SInput>
                  <Input
                    name={team.code}
                    value={inputTeam}
                    onChange={changeTeamName}
                    length={85}
                  />
                </SInput>
              </SHeader>
              <SHeader>
                <div>
                  <AutoLeaderInput
                    inputId="leader"
                    label="리더"
                    organization={team.parentCode}
                    defaultValue={{ id: team.leader?.userId, name: team.leader?.name }}
                    byte={255}
                    length={10}
                  />
                </div>

                <div>
                  <AutoLeaderInput
                    inputId="secondLeader"
                    label="대리인"
                    organization={team.parentCode}
                    defaultValue={{
                      id: team.secondLeader?.userId,
                      name: team.secondLeader?.name,
                    }}
                    byte={255}
                    length={10}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    size={'small'}
                    color="gray"
                    onClick={() => {
                      modalRegisterMember(team);
                    }}
                  >
                    팀원 검색
                  </Button>
                </div>
              </SHeader>
            </SHeaderWrap>
          </ModalComponents.Header>
          <div className="inner">
            <ModalComponents.Body>
              <TableItem>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '' }} />
                  <col style={{ width: 'auto' }} />
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
                  {team.memberList
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
          </div>
          <ModalComponents.Footer align="center">
            <Button type="submit" color="blue">
              등록
            </Button>
          </ModalComponents.Footer>
        </form>
      </FormProvider>
    </ReactModal>
  );
};

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

const SButton = styled.div`
  margin-right: 25px;
`;

export default ModifyTeam;
