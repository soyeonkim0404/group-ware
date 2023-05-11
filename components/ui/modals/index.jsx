import loadable from '@loadable/component';
import { useContext, Children } from 'react';
import styled from 'styled-components';
import { ModalsDispatchContext, ModalsStateContext } from '@lib/context/ModalsContext';
import { MdClose } from 'react-icons/md';

/*
 * 일반 모달 컴포넌트들 모음
 * 모달 컴포넌트 로딩시 모든 모달이 불러와지는걸 방지하기 위해
 * 각각의 모달 컴포넌트를 loadable을 이용하여 불러옵니다.
 *
 * 사용예시)
 * import { modals } from '@components/ui/modals';
 * import useModals from '@lib/hooks/useModals';
 *
 * const { openedModal } = useModals();
 * openedModal(modals.Modal, { // 열고자 하는 모달을 불러옴. 수염괄호 안에 props로 내려줄 옵션 설정
 *  text: {
 *    body: '수정하시겠습니까?'
 *  }
 * })
 */
export const modals = {
  Modal: loadable(() => import('./Modal')), //취소와 확인이 버튼이 있는 일반적인 모달 껍데기
  Alert: loadable(() => import('./Alert')), //확인 버튼만 있는 알럿창 같은 모달
  Registration: loadable(() => import('./Registration')), //등록 모달
  RegisterSector: loadable(() => import('./department/RegisterSector')), // 조직 관리 > 부문 등록 목달
  RegisterHeadQuarter: loadable(() => import('./department/RegisterHeadQuarter')), // 조직 관리 > 본부 등록 모달
  RegisterTeam: loadable(() => import('./department/RegisterTeam')), // 조직 관리 > 팀 등록
  RegisterMember: loadable(() => import('./department/RegisterMember')), // 조직 관리 > 팀원 등록
  ModifySector: loadable(() => import('./department/ModifySector')), // 부문 수정
  ModifyHeadQuarter: loadable(() => import('./department/ModifyHeadQuarter')), // 본부 수정
  ModifyTeam: loadable(() => import('./department/ModifyTeam')), // 팀 수정
  DeleteDepartment: loadable(() => import('./department/Delete')), // 조직 관리 삭제

  ApprovalDetail: loadable(() => import('./approval/ApprovalDetail')), // 결재 상세
  ApprovalAdd: loadable(() => import('./approval/ApprovalAdd')), // 결재선 추가

  GrantAllVacation: loadable(() => import('./vacation/GrantAllVacation')), // 연차 부여
  VacationUpdate: loadable(() => import('./vacation/VacationUpdate')),
  VacationHistory: loadable(() => import('./vacation/VacationHistory')),

  WorkOn: loadable(() => import('./commute/WorkOn')), // 출근
  WorkOff: loadable(() => import('./commute/WorkOff')), // 퇴근

  MeetingRoomAdd: loadable(() => import('./meetingRoom/MeetingRoomAdd')), // 회의실 예약
  MeetingRoomInfo: loadable(() => import('./meetingRoom/MeetingRoomInfo')), // 회의실 상세
};

const modalHeader = ({ children, closeButton }) => {
  return (
    <SHeader className="modal-header">
      {children}
      {closeButton ? (
        <button className={'close'}>
          <MdClose onClick={closeButton} />
        </button>
      ) : (
        ''
      )}
    </SHeader>
  );
};
const modalBody = ({ children }) => {
  return <SBody className="modal-body">{children}</SBody>;
};
const modalFooter = ({ children, align = 'center' }) => {
  let isCenter = Children.count(children) > 1;
  if (align === 'right') isCenter = false;
  if (align === 'center') isCenter = true;

  return (
    <SFooter className="modal-footer" isCenter={isCenter}>
      {children}
    </SFooter>
  );
};

const ModalComponents = () => {
  const openedModals = useContext(ModalsStateContext);
  const { close } = useContext(ModalsDispatchContext);

  return openedModals.map((modal, idx) => {
    const { Component, props } = modal;

    const { onSubmit, ...restProps } = props;
    const onClose = () => {
      close(Component);

      // 비동기 작업시 resolve 키를 확인함
      // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty('resolve')) {
        const { resolve } = props;
        resolve('success');
      }
    };
    const handleSubmit = async (...params) => {
      if (typeof onSubmit === 'function') {
        await onSubmit(...params);
        onClose();
      }
    };

    return (
      <Component key={idx} onClose={onClose} onSubmit={handleSubmit} {...restProps} />
    );
  });
};

/*
 * 모달 컴포넌트 스타일정의
 */
const SHeader = styled.div`
  position: sticky;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  border-radius: 20px 20px 0 0;
  box-sizing: border-box;
  background: #fff;
  z-index: 1;
  /*backdrop-filter: blur(50px);*/
  /* & + div {
    margin-top: 20px;
  }*/

  &:empty + div {
    margin-top: 0;
  }

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    background: #ced4da;
    border-radius: 100%;
    cursor: pointer;

    svg {
      font-size: 20px;
      color: #ffffff;
    }
  }
`;
const SBody = styled.div`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`;
const SFooter = styled.div`
  padding: 0 0 20px;
  text-align: ${(props) => (props.isCenter ? 'center' : 'right')};
  box-sizing: border-box;
  border-radius: 0 0 20px 20px;
`;

ModalComponents.Header = modalHeader;
ModalComponents.Body = modalBody;
ModalComponents.Footer = modalFooter;

export default ModalComponents;
