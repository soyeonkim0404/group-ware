import ReactModal from 'react-modal';
import ModalComponents, { modals } from '@components/ui/modals/index';
import { useState } from 'react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { apiPostModifyDepartment } from '@api';
import useModals from '@lib/hooks/useModals';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const ModifySector = ({ onClose, onSubmit, text, size }) => {
  const [inputBusiness, setInputBusiness] = useState(text.sector);
  const onChangeBusiness = (e) => {
    setInputBusiness(e.target.value);
  };
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();

  const onSubmitModal = async () => {
    await apiPostModifyDepartment({
      parentCode: 'BS',
      code: text.sectorCode,
      name: inputBusiness,
      isDelete: false,
      memberList: null,
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

export default ModifySector;
