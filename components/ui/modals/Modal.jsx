import React from 'react';
import ReactModal from 'react-modal';
import Button from '../Button';
import ModalComponents from './index';
import Parser from 'html-react-parser';

const Modal = ({ onClose, onSubmit, text, closeButton, size }) => {
  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        {text.header && closeButton ? (
          <ModalComponents.Header closeButton={onClose}>
            {text.header}
          </ModalComponents.Header>
        ) : (
          <ModalComponents.Header>{text.header}</ModalComponents.Header>
        )}
        {text.body && (
          <ModalComponents.Body>
            {React.isValidElement(text.body) ? text.body : Parser(text.body)}
          </ModalComponents.Body>
        )}
        <ModalComponents.Footer>
          <Button onClick={onClose} color="gray">
            취소
          </Button>
          <Button onClick={onSubmit} color="red">
            확인
          </Button>
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default Modal;
