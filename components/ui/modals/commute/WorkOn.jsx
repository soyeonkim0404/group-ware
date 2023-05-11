import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import Modal from '@components/ui/modals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import CheckBox from '@components/ui/CheckBox';
import styled from 'styled-components';
import getGeolocation from '@lib/geolocation';
import { apiPostWorkOn } from '@api';
import React, { useContext, useState } from 'react';
import { ToastContext } from '@components/ui/Toast';

const WorkOn = ({ onClose, onSubmit, resolve, size }) => {
  const { defaultErrorHandler } = useErrorHandler();
  const [isHome, setIsHome] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { addToast } = useContext(ToastContext);

  const onChange = (e) => {
    setIsHome(e.target.checked);
  };

  const onSubmitModal = async () => {
    try {
      setDisabled(true);
      const [latitude, longitude] = await getGeolocation();

      const res = await apiPostWorkOn({ latitude, longitude, isHome });
      addToast('info', '환영합니다.');
      onSubmit();
    } catch (err) {
      defaultErrorHandler(err, onClose);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        <Modal.Header closeButton={onClose} />
        <Modal.Body>
          <SWorkOn>
            <p className="title">좋은 아침입니다 😀</p>
            <div className="checkbox">
              <span>오늘 재택이세요?</span>
              <CheckBox
                key={'isHome'}
                id={'isHome'}
                checked={isHome}
                onChange={onChange}
                label={'YES!'}
              />
            </div>
          </SWorkOn>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} resolve={resolve} color="gray">
            취소
          </Button>
          <Button onClick={onSubmitModal} color="blue" disabled={disabled}>
            출근
          </Button>
        </Modal.Footer>
      </div>
    </ReactModal>
  );
};
const SWorkOn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .title {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    font-size: 25px;
    font-weight: bold;
  }

  .checkbox {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0 20px;
    span {
      color: ${(p) => p.theme.gray30};
      & + label {
        margin-left: 40px;
      }
    }
  }
`;

export default WorkOn;
