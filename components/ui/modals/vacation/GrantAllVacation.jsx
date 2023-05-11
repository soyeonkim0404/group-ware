import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import ModalComponents from '@components/ui/modals';
import Input from '@components/ui/Input';
import Loading from '@components/ui/Loading';
import { calculateByte } from '@lib/validation/support';

const GrantAllVacation = ({ onClose, onSubmit, size }) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const onChangeComment = (e) => {
    const maxByte = 1000;

    if (calculateByte(e.target.value) <= maxByte) setComment(e.target.value);
  };

  const onClickSubmit = () => {
    setIsLoading(true);
    onSubmit(comment, () => setIsLoading(false));
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        <ModalComponents.Header closeButton={onClose}>
          연차 일괄 부여
        </ModalComponents.Header>
        <ModalComponents.Body align="center">
          <Input.Group>
            <Input name="사유" label="사유" value={comment} onChange={onChangeComment} />
          </Input.Group>
        </ModalComponents.Body>
        <ModalComponents.Footer>
          <Button onClick={onClose} color="primary">
            취소
          </Button>
          <Button onClick={onClickSubmit} color="gray">
            확인
          </Button>
          {isLoading ? <Loading /> : <></>}
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default GrantAllVacation;
