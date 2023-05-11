import ReactModal from 'react-modal';
import { apiDeleteDepartment } from '@api';
import Button from '@components/ui/Button';
import Modal, { modals } from '@components/ui/modals';
import Parser from 'html-react-parser';
import useModals from '@lib/hooks/useModals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { ReadyContext } from '@lib/context/ReadyContext';
import React, { useContext, useEffect, useState } from 'react';

const Delete = ({ onClose, onSubmit, text, resolve }) => {
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();
  const [isReady, setReady] = useContext(ReadyContext);

  const onSubmitModal = () => {
    setReady(false);
    apiDeleteDepartment({
      code: text.code,
    })
      .then(() => {
        setReady(true);
        const alert = modals.Alert;
        openedModal(modals.Alert, {
          text: { body: '삭제가 완료되었습니다.' },
          onClose: () => {
            closeModal(alert);
            onSubmit();
          },
        });
      })
      .catch((err) => {
        setReady(true);
        defaultErrorHandler(err, onClose);
      });
  };
  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap`}>
        <Modal.Body align="center">{Parser(text.body)}</Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} resolve={resolve} color="gray">
            취소
          </Button>
          <Button onClick={onSubmitModal} color="red">
            확인
          </Button>
        </Modal.Footer>
      </div>
    </ReactModal>
  );
};

export default Delete;
