import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import FileUpload from '@components/ui/FileUpload';
import Button from '@components/ui/Button';
const Expense = () => {
  const methods = useForm();
  const [approval, setApproval] = useState();
  const [errorMsg, setErrorMsg] = useState({});
  const onSubmit = () => {};
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>결재신청</Card.Title>
          </Card.Head>
          <Card.Body>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <FormInput.Group>
                  {/*프로젝트 셀렉트로 변경하기*/}
                  <FormInput
                    inputId="email"
                    label="프로젝트명"
                    error={errorMsg}
                    required={true}
                  />
                  {/*프로젝트 셀렉트로 변경하기*/}
                  <FormInput
                    inputId="name"
                    label="사용자"
                    error={errorMsg}
                    required={true}
                  />
                </FormInput.Group>
                <SFormList>
                  <li>
                    <FormInput
                      inputId="useDate"
                      label="사용일"
                      type="date"
                      error={errorMsg}
                      required={true}
                    />
                  </li>
                  <li>
                    <FormInput
                      inputId="amount"
                      label="금액"
                      pattern={/(\d)(?=(?:\d{3})+(?!\d))/g}
                      error={errorMsg}
                      required={true}
                    />
                  </li>
                  <li>
                    <FormInput
                      inputId="company"
                      label="거래처"
                      error={errorMsg}
                      required={true}
                    />
                  </li>
                  <li>
                    <FileUpload />
                  </li>
                </SFormList>
              </form>
            </FormProvider>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          {/*링크*/}
          <Button color="gray" size="large" link={'/'}>
            취소
          </Button>
          <Button
            type="submit"
            color="blue"
            size="large"
            onClick={methods.handleSubmit(onSubmit)}
          >
            등록
          </Button>
        </Button.Group>
        <Button.Group>
          <Button color="primary" size="large" link={`/employee`}>
            목록
          </Button>
        </Button.Group>
      </Button.Wrap>
    </>
  );
};

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
    &:last-child {
      margin-top: 27px;
    }
  }
`;

export default Expense;
