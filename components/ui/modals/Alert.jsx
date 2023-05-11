import ReactModal from 'react-modal';
import Button from '../Button';
import Modal from './index';

import styled from 'styled-components';

const Alert = ({ onClose, text, resolve }) => {
  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap sm`}>
        <Modal.Body>
          <SCenter>{text.body}</SCenter>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} resolve={resolve} color="gray">
            확인
          </Button>
        </Modal.Footer>
      </div>
    </ReactModal>
  );
};

const SCenter = styled.div`
  text-align: center;
`;

export default Alert;
