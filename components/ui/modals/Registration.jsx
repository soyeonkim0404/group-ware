import ReactModal from 'react-modal';
import ModalComponents from './index';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { useState } from 'react';

const Registration = ({ onClose, onSubmit, text, size }) => {
  const [inputBusiness, setInputBusiness] = useState('');
  const [inputHQ, setInputHQ] = useState('');
  const onChangeBusiness = (e) => {
    setInputBusiness(e.target.value);
  };
  const onChangeHQ = (e) => {
    setInputHQ(e.target.value);
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
              name="사업부"
              label="사업부"
              value={inputBusiness}
              onChange={onChangeBusiness}
              placeholder="사업부를 입력해주세요"
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
        <ModalComponents.Footer align="right">
          <Button onClick={onSubmit} color="gray">
            등록
          </Button>
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default Registration;
