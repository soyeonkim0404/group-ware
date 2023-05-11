import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { apiGetCommuteView, apiPostUpdateComute } from '@api';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import gf_date from '@lib/date';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const Edit = ({ data }) => {
  const methods = useForm();
  const { openedModal, closeModal } = useModals();
  const router = useRouter();
  const { formErrorHandler } = useErrorHandler();

  // 수정 이벤트 핸들러
  const onSubmit = async (data) => {
    const alertComponent = modals.Alert;
    delete data.user;
    try {
      await apiPostUpdateComute(data);
      openedModal(alertComponent, {
        text: { body: '성공' },
        onClose: () => {
          closeModal(alertComponent);
          router.push('/commute');
        },
      });
    } catch (err) {
      formErrorHandler(err, methods.setError);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, (errors) => console.log(errors))}>
        <CardLayout>
          <Card col="12">
            <Card.Head>
              <Card.Title>출퇴근 수정</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <FormInput inputId="id" label="아이디" defaultValue={data?.id} hidden />
                </li>
                <li>
                  <FormInput
                    inputId="user"
                    label="사용자"
                    defaultValue={data?.userName}
                    disabled
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onAddress"
                    label="출근 주소"
                    defaultValue={data?.onAddress}
                    length={66}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onDate"
                    label="출근일"
                    type="date"
                    required
                    defaultValue={
                      data && data.onDatetime && gf_date(data.onDatetime).getDateString()
                    }
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onTime"
                    label="출근 시간"
                    type="time"
                    required
                    defaultValue={
                      data && data.onDatetime && gf_date(data.onDatetime).getTimeString()
                    }
                  />
                </li>
                <li>
                  <FormInput
                    inputId="offDate"
                    label="퇴근일"
                    type="date"
                    defaultValue={
                      data &&
                      data.offDatetime &&
                      gf_date(data.offDatetime).getDateString()
                    }
                  />
                </li>
                <li>
                  <FormInput
                    inputId="offTime"
                    label="퇴근시간"
                    type="time"
                    defaultValue={
                      data &&
                      data.offDatetime &&
                      gf_date(data.offDatetime).getTimeString()
                    }
                  />
                </li>
                <li>
                  <FormInput
                    inputId="offAddress"
                    label="퇴근 주소"
                    defaultValue={data?.offAddress}
                    length={66}
                  />
                </li>
              </SFormList>
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button
              color="gray"
              size="large"
              link={'/commute/view?id=' + router.query.id}
            >
              취소
            </Button>
            <Button type="submit" color="blue" size="large">
              등록
            </Button>
          </Button.Group>
        </Button.Wrap>
      </form>
    </FormProvider>
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const resp = await apiGetCommuteView(context.query, context);

  return {
    props: { data: resp.data },
  };
});

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
  }
`;

export default Edit;
