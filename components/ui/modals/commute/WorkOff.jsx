import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import Modal from '@components/ui/modals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import styled from 'styled-components';
import getGeolocation from '@lib/geolocation';
import { apiPostWorkOff } from '@api';

import React, { useContext } from 'react';
import { ToastContext } from '@components/ui/Toast';

const WorkOff = ({ onClose, onSubmit, text, resolve, size }) => {
  const { defaultErrorHandler } = useErrorHandler();

  const { addToast } = useContext(ToastContext);

  // 퇴근 이벤트 핸들러
  const onSubmitModal = async () => {
    const [latitude, longitude] = await getGeolocation();
    try {
      const resp = await apiPostWorkOff({ latitude, longitude });
      addToast('info', '고생하셨습니다.');
      onSubmit();
    } catch (err) {
      defaultErrorHandler(err, onClose);
    }
  };
  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        <Modal.Header closeButton={onClose} />
        <Modal.Body>
          <SWorkOff>
            오늘도
            <br /> 수고많으셨습니다~!👍🏻
          </SWorkOff>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} resolve={resolve} color="gray">
            취소
          </Button>
          <Button onClick={onSubmitModal} color="primary">
            퇴근
          </Button>
        </Modal.Footer>
      </div>
    </ReactModal>
  );
};

const SWorkOff = styled.div`
  width: 100%;
  text-align: center;
  margin: 30px 0 30px;
  font-size: 25px;
  font-weight: bold;
`;

export default WorkOff;
