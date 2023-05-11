import ReactModal from 'react-modal';
import ModalComponents from '@components/ui/modals/index';
import { useState } from 'react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { apiPostCreateDepartment } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';

const RegisterSector = ({ onClose, onSubmit, text, size }) => {
  const [inputBusiness, setInputBusiness] = useState('');
  const onChangeBusiness = (e) => {
    setInputBusiness(e.target.value);
  };
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();

  const onSubmitModal = async () => {
    await apiPostCreateDepartment({
      parentCode: 'BS',
      name: inputBusiness,
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
          <Input
            name="부문"
            label="부문"
            value={inputBusiness}
            onChange={onChangeBusiness}
            placeholder="부문명을 입력해주세요"
            length={85}
          />
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

export default RegisterSector;
