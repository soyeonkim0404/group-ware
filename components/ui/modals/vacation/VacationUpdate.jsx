import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import ModalComponents from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import FormRadio from '@components/ui/FormRadio';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const VacationUpdate = ({ onClose, onSubmit }) => {
  const methods = useForm();

  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: '(max-width:767px)' });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap lg`}>
        <ModalComponents.Header closeButton={onClose}>
          연차 발생/조정
        </ModalComponents.Header>
        <ModalComponents.Body align="center">
          <FormProvider {...methods}>
            <SCardBody style={isMobile ? { flexDirection: 'column' } : {}}>
              <SCardBody>
                <FormRadio
                  getRadioData={[
                    { value: 'VA100001', label: '발생' },
                    { value: 'VA100003', label: '조정' },
                    { value: 'VA100006', label: '소멸' },
                  ]}
                  inputId="type"
                  label="유형"
                  error={methods.formState.errors}
                  required={true}
                  defaultValue={'VA100001'}
                />
                <FormInput
                  inputId="count"
                  name="개수"
                  label="개수"
                  type="number"
                  required={true}
                />
              </SCardBody>
              <FormInput inputId="comment" name="사유" label="사유" length={333} />
            </SCardBody>
          </FormProvider>
        </ModalComponents.Body>
        <ModalComponents.Footer>
          <Button onClick={methods.handleSubmit(onSubmit)} color="gray">
            확인
          </Button>
          <Button onClick={onClose} color="primary">
            취소
          </Button>
          {isLoading ? <Loading /> : <></>}
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

const SCardBody = styled.div`
  display: flex;
  align-items: center;

  .form-radio {
    width: 60%;
    label {
      margin-left: 0;
    }
  }
  .form-input {
    padding-right: 10px;
  }
`;

export default VacationUpdate;
