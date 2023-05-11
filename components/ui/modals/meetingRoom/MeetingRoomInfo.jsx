import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import Modal, { modals } from '@components/ui/modals';
import styled from 'styled-components';
import React, { useState } from 'react';
import DataView from '@components/ui/DataView';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import FormInput from '@components/ui/FormInput';
import { FormDatePickerPeriod } from '@components/ui/DatePicker';
import FormSelect from '@components/ui/FormSelect';
import { apiPostMeetingRoomDelete, apiPostMeetingRoomUpdate } from '@lib/api/module';
import useModals from '@lib/hooks/useModals';
import { useRouter } from 'next/router';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const MeetingRoomInfo = ({ props, onClose, resolve, size, getMeetingRoom }) => {
  const { openedModal, closeModal } = useModals();
  const { setValue } = useForm();
  const { defaultErrorHandler } = useErrorHandler();
  const methods = useForm();
  const router = useRouter();
  const profile = useSelector((profile) => profile);

  const [disableEdit, setDisableEdit] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [meetingContent, setMeetingContent] = useState('');
  const [defaultDate, setDefaultDate] = useState(null);

  useEffect(() => {
    setMeetingContent(props.meetingContent);
    setDefaultDate(null);
  }, [disableEdit]);

  const type = [
    { id: 'MT100001', value: 'GEEK' },
    { id: 'MT100002', value: 'MELLOW' },
  ];

  const params = {
    year: new Date().getFullYear(),
  };

  const onSubmitModal = async (data) => {
    data.id = props.id;
    data.meetingContent = meetingContent;
    data.createUserId = props.createUserId;
    data.createUserName = profile.profile.name;

    try {
      await apiPostMeetingRoomUpdate(data);

      const alertComponent = modals.Alert;
      openedModal(alertComponent, {
        text: { body: '수정이 완료되었습니다.' },
        onClose: () => {
          closeModal(alertComponent);
          onClose();
          getMeetingRoom(params);
          router.push('/meetingroom');
        },
      });
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  const removeConfirmModal = (data) => {
    openedModal(modals.Modal, {
      closeButton: true,
      text: {
        body: '삭제하시겠습니까?',
      },
      onSubmit: () => {
        apiPostMeetingRoomDelete({
          id: props.id,
          createUserId: props.createUserId,
        })
          .then(() => {
            const alert = modals.Alert;
            openedModal(alert, {
              text: { body: '삭제가 완료되었습니다.' },
              onclose: () => {
                closeModal(alert);
              },
            });
            onClose();
            getMeetingRoom(params);
            router.push('/meetingroom');
          })
          .catch((err) => {
            defaultErrorHandler(err, onClose);
          });
      },
    });
  };

  const handleEdit = () => {
    setDisableEdit((prev) => !prev);
  };

  const contentHandler = (e) => {
    setMeetingContent(e.target.value);
  };

  return (
    <>
      {disableEdit ? (
        <ReactModal onRequestClose={onClose}>
          <div className={`modal-wrap ${size}`}>
            <Modal.Header closeButton={onClose} />
            <Modal.Body>
              <Contents>
                <DataView>
                  <DataView.Item label="회의실">
                    {props.meetingRoomType === 'MT100001' ? 'GEEK' : 'MELLOW'}
                  </DataView.Item>
                  <DataView.Item label="예약 일시">
                    {props.beginDate} ~ {props.endDate}
                  </DataView.Item>
                  <DataView.Item label="예약자">{props.createUser}</DataView.Item>
                  <DataView.Item label="회의 내용">{props.meetingContent}</DataView.Item>
                </DataView>
              </Contents>
            </Modal.Body>
            <Modal.Footer>
              {profile.profile.id === props.createUserId && (
                <Button type="button" color="blue" onClick={handleEdit}>
                  수정
                </Button>
              )}
              {profile.profile.id === props.createUserId && (
                <Button color="red" onClick={removeConfirmModal}>
                  삭제
                </Button>
              )}
              <Button onClick={onClose} resolve={resolve} color="gray">
                닫기
              </Button>
            </Modal.Footer>
          </div>
        </ReactModal>
      ) : (
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
                      error={'errorMsg'}
                      defaultValue={props.meetingRoomType}
                    />
                  </li>
                  <li className="startAndEnd">
                    <FormDatePickerPeriod
                      startDate="beginDate"
                      endDate="endDate"
                      label={['시작 시간', '종료 시간']}
                      require={true}
                      error={errorMsg}
                      defaultDate={defaultDate}
                    />
                  </li>
                  <li className="meetingContent">
                    <FormInput
                      inputId="meetingContent"
                      label="회의 내용"
                      error={methods.formState.errors}
                      defaultValue={props.meetingContent}
                      onChangeEvent={contentHandler}
                      length={85}
                    />
                  </li>
                </Contents>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="submit"
                  onClick={methods.handleSubmit(onSubmitModal, (err) => setErrorMsg(err))}
                  color="blue"
                >
                  수정
                </Button>
                <Button type="button" color="red" onClick={handleEdit}>
                  취소
                </Button>
                <Button onClick={onClose} resolve={resolve} color="gray">
                  닫기
                </Button>
              </Modal.Footer>
            </div>
          </ReactModal>
        </FormProvider>
      )}
    </>
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
  .meetingContent {
    margin-top: 0px !important;
  }
`;

export default MeetingRoomInfo;
