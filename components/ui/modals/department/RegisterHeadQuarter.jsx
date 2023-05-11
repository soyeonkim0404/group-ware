import ReactModal from 'react-modal';
import ModalComponents from '@components/ui/modals/index';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import React, { useState } from 'react';
import { apiPostCreateDepartment } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import AutoLeaderInput from '@components/department/AutoLeaderInput';

const RegisterHeadQuarter = ({ onClose, onSubmit, text, size }) => {
  const [inputHQ, setInputHQ] = useState('');
  const onChangeHQ = (e) => {
    setInputHQ(e.target.value);
  };
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();

  // 본부 등록 이벤트
  const onSubmitModal = async () => {
    await apiPostCreateDepartment({
      parentCode: text.code,
      name: inputHQ,
    })
      .then(() => {
        const alert = modals.Alert;
        openedModal(alert, {
          text: { body: '등록이 완료되었습니다.' },
          onClose: () => {
            onSubmit();
            closeModal(alert);
          },
        });
      })
      .catch((err) => {
        defaultErrorHandler(err, onClose);
      });
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        <ModalComponents.Header closeButton={onClose}>
          {text.header}
        </ModalComponents.Header>
        <ModalComponents.Body>
          <Input.Group>
            <Input
              name="부문"
              label="부문"
              value={text.body}
              placeholder="사업부를 입력해주세요"
              readonly
            />
            <Input
              name="본부명"
              label="본부명"
              value={inputHQ}
              onChange={onChangeHQ}
              placeholder="본부명을 입력해주세요"
              length={85}
            />
          </Input.Group>
        </ModalComponents.Body>
        <ModalComponents.Footer align="center">
          <Button onClick={onSubmitModal} color="blue">
            등록
          </Button>
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default RegisterHeadQuarter;
