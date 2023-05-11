import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import Modal, { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import styled from 'styled-components';
import React, { useState } from 'react';
import FormSelect from '@components/ui/FormSelect';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import { FormDatePickerPeriod } from '@components/ui/DatePicker';
import { apiPostMeetingRoomCreate } from '@lib/api/module';
import { useRouter } from 'next/router';

const MeetingRoomAdd = ({ onClose, resolve, size, getMeetingRoom }) => {
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();
  const methods = useForm();
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [meetingContent, setMeetingContent] = useState('');

  const type = [
    { id: 'MT100001', value: 'GEEK' },
    { id: 'MT100002', value: 'MELLOW' },
  ];

  const params = {
    year: new Date().getFullYear(),
  };

  const onSubmitModal = async (data) => {
    data.meetingContent = meetingContent;

    try {
      setDisabled(true);

      await apiPostMeetingRoomCreate(data);

      const alertComponent = modals.Alert;
      openedModal(alertComponent, {
        text: { body: '예약이 완료되었습니다.' },
        onClose: () => {
          closeModal(alertComponent);
          onClose();
          getMeetingRoom(params);

          const timer = setInterval(() => {
            getMeetingRoom(params);
          }, 60000);

          setTimeout(() => {
            clearInterval(timer);
          }, 600000);
          router.push('/meetingroom');
        },
      });
    } catch (err) {
      defaultErrorHandler(err);
    } finally {
      setDisabled(false);
    }
  };

  const contentHandler = (e) => {
    setMeetingContent(e.target.value);
  };

  return (
    <FormProvider {...methods}>
      <ReactModal onRequestClose={onClose}>
        <div className={`modal-wrap ${size}`}>
          <Modal.Header closeButton={onClose} />
          <Modal.Body>
            <Contents>
              <li className="meetingRoomType">
                <FormSelect
                  getSelectData={type}
                  label="회의실 선택"
                  selectId="meetingRoomType"
                  required={true}
                  error={errorMsg}
                />
              </li>
              <li className="startAndEnd">
                <FormDatePickerPeriod
                  startDate="beginDate"
                  endDate="endDate"
                  label={['시작 시간', '종료 시간']}
                  require={true}
                  error={errorMsg}
                  setDiffDay={(day) => {
                    methods.setValue('usedCount', day);
                  }}
                />
              </li>
              <li className="meetingContent">
                <FormInput
                  inputId="meetingContent"
                  label="회의 내용"
                  type="text"
                  error={methods.formState.errors}
                  required
                  onChangeEvent={contentHandler}
                  length={85}
                />
              </li>
            </Contents>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={methods.handleSubmit(onSubmitModal, (err) => setErrorMsg(err))}
              color="blue"
              disabled={disabled}
            >
              예약하기
            </Button>
            <Button onClick={onClose} resolve={resolve} color="gray">
              닫기
            </Button>
          </Modal.Footer>
        </div>
      </ReactModal>
    </FormProvider>
  );
};

const Contents = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
    &:last-child {
      margin-top: 27px;
    }
  }
  .startAndEnd {
    margin-top: 0px;
  }
  .startAndEnd div {
    margin: 0px !important;
  }
  .meetingRoomType {
    padding-bottom: 24px;
  }
  .meetingContent {
    margin-top: 0px !important;
  }
`;

export default MeetingRoomAdd;
