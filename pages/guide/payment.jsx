import React, { useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import { useForm, FormProvider } from 'react-hook-form';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import { inputOption2, selectOption } from '@data/dummy';
import TextArea from '@components/ui/TextArea';
import FileUpload from '@components/ui/FileUpload';

const dummySelect = [
  { code: 'dum01', value: '프로젝트 유' },
  { code: 'dum02', value: '프로젝트 무' },
];

const Payment = () => {
  const [resultFileData, setResultFileData] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});
  const [isProject, setIsProject] = useState(false);
  const methods = useForm();
  const fileData = (data) => {
    setResultFileData(data);
  };

  const handleTypeCode = (e) => {
    console.log(e.target.value);
    if (e.target.value === 'dum01') {
      setIsProject(true);
    } else {
      setIsProject(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>대금 품의서</Card.Title>
          </Card.Head>
          <Card.Body>
            <SFormList>
              <li>
                <FormSelect
                  getSelectData={dummySelect}
                  labelId="project-label"
                  error={errorMsg}
                  selectId="projectCode"
                  label="프로젝트명"
                  onChange={(e) => {
                    handleTypeCode(e);
                  }}
                />
              </li>
              <li>
                <FormInput
                  inputId="company"
                  label="지급처명"
                  type="text"
                  error={methods.formState.errors}
                  disabled={isProject !== true}
                />
              </li>
              <li>
                <FormInput
                  inputId="bank"
                  label="은행명"
                  type="text"
                  error={methods.formState.errors}
                  disabled={isProject !== true}
                />
              </li>
              <li>
                <FormInput
                  inputId="bank-number"
                  label="지급처계좌"
                  type="number"
                  error={methods.formState.errors}
                  placeholder="-제외 입력해주세요"
                  disabled={isProject !== true}
                />
              </li>
              <li>
                <FormInput
                  inputId="price"
                  label="지급요청액(VAT포함)"
                  type="text"
                  error={methods.formState.errors}
                />
              </li>
              <li>
                <FormInput
                  inputId="name"
                  label="예금주"
                  type="text"
                  error={methods.formState.errors}
                />
              </li>
              <li>
                <FormSelect
                  getSelectData={inputOption2}
                  labelId="price-method"
                  error={methods.formState.errors}
                  selectId="isPrice"
                  label="결제방법"
                />
              </li>
              <li>
                <FormSelect
                  getSelectData={inputOption2}
                  labelId="standard"
                  error={methods.formState.errors}
                  selectId="isStandard"
                  label="구분"
                />
              </li>
            </SFormList>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>지급 상세 내역</Card.Title>
          </Card.Head>
          <Card.Body>
            <TextArea placeholder="서비스 사용 기간 또는 정품 구입 상세 내용을 입력해주세요" />
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>증빙 첨부 파일</Card.Title>
          </Card.Head>
          <Card.Body>
            <FileUpload fileData={fileData} />
          </Card.Body>
        </Card>
      </CardLayout>
    </FormProvider>
  );
};

const SFormList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  li {
    flex: 0 0 calc(50% - 20px);
    width: calc(50% - 20px);
  }
  .mobile & {
    gap: 0;
    li {
      flex: 0 0 100%;
      width: 100%;
    }
  }
`;

export default Payment;
