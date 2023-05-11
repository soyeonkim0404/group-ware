import ReactModal from 'react-modal';
import ModalComponents from '@components/ui/modals/index';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import React, { useContext, useEffect, useState } from 'react';
import { apiPostCreateDepartment, apiPostModifyDepartment } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import AutoLeaderInput from '@components/department/AutoLeaderInput';
import { useForm, FormProvider } from 'react-hook-form';
import { ReadyContext } from '@lib/context/ReadyContext';
import styled from 'styled-components';

const RegisterTeam = ({ onClose, onSubmit, text, size }) => {
  const [inputTeam, setInputTeam] = useState('');
  const [getHqData, setGetHqData] = useState(text.hqData);
  const onChangeTeam = (e) => {
    setInputTeam(e.target.value);
  };
  const { openedModal, closeModal } = useModals();
  const { defaultErrorHandler } = useErrorHandler();
  const methods = useForm();
  const [isReady, setReady] = useContext(ReadyContext);

  const onSubmitHandler = (data) => {
    setReady(false);

    apiPostCreateDepartment({
      parentCode: getHqData.code,
      name: inputTeam,
      leader: data.leader,
      secondLeader: data.secondLeader,
    })
      .then(() => {
        setReady(true);
        const alert = modals.Alert;
        openedModal(alert, {
          text: { body: '등록이 완료되었습니다.' },
          onClose: () => {
            onSubmit();
            closeModal(alert);
          },
        });
      })
      .catch((err) => defaultErrorHandler(err, onClose));
  };

  useEffect(() => {
    setGetHqData(text.hqData);
  }, []);

  return (
    <ReactModal onRequestClose={onClose}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          className={`modal-wrap ${size}`}
        >
          <ModalComponents.Header closeButton={onClose}>
            {text.header}
          </ModalComponents.Header>
          <ModalComponents.Body>
            <Input.Group>
              <Input
                name="부문"
                label="부문"
                value={getHqData.parentName}
                placeholder="사업부를 입력해주세요"
                readonly
              />
              <Input
                name="본부"
                label="본부"
                value={getHqData.name}
                placeholder="본부명을 입력해주세요"
                readonly
              />
            </Input.Group>
            <SInput>
              <Input
                name="팀명"
                label="팀명"
                value={inputTeam}
                onChange={onChangeTeam}
                placeholder="팀명을 입력해주세요"
                length={85}
              />
            </SInput>
            <SInput>
              <AutoLeaderInput
                inputId="leader"
                label="리더"
                organization={getHqData.code}
                defaultValue={{
                  id: getHqData.leader?.userId,
                  name: getHqData.leader?.name,
                }}
                byte={255}
                maxHeight={300}
                length={10}
              />
            </SInput>
            <SInput>
              <AutoLeaderInput
                inputId="secondLeader"
                label="대리인"
                organization={getHqData.code}
                defaultValue={{
                  id: getHqData.secondLeader?.userId,
                  name: getHqData.secondLeader?.name,
                }}
                byte={255}
                maxHeight={300}
                length={10}
              />
            </SInput>
          </ModalComponents.Body>
          <ModalComponents.Footer align="right">
            <Button type="submit" color="blue">
              등록
            </Button>
          </ModalComponents.Footer>
        </form>
      </FormProvider>
    </ReactModal>
  );
};

const SInput = styled.div`
  margin-bottom: 15px;
`;

export default RegisterTeam;
