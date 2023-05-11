import styled from 'styled-components';
import Button from '@components/ui/Button';
import Card, { CardLayout } from '@components/ui/Card';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import { apiPostNewCommute } from '@api';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import { useRouter } from 'next/router';
import AutoFormInput from '@components/ui/AutoFormInput';

const Index = () => {
  const methods = useForm();
  const router = useRouter();
  // 모달 훅
  const { openedModal, closeModal } = useModals();

  // 등록 이벤트
  const onSubmit = async (data) => {
    try {
      // 정상적으로 등록하면 출퇴근 목록으로 이동
      await apiPostNewCommute(data);
      const alertComponent = modals.Alert;
      openedModal(alertComponent, {
        text: { body: '성공' },
        onClose: () => {
          closeModal(alertComponent);
          router.push('/commute');
        },
      });
    } catch (err) {
      // 에러는 3가지 형태로 옴
      // 1. 유효성 실패
      // 2. 예외
      // 3. axios 오류
      if (err.data) {
        if (err.data.code == 'V000' && typeof err.data.message != 'string') {
          Object.keys(err.data.message).forEach((key, idx) => {
            // 타입은 두개만 존재 배열 아니면 오브젝트
            methods.setError(key, {
              type: 'custom',
              message: err.data.message[key][0].substr(6),
            });
          });
        } else {
          openedModal(modals.Alert, { text: { body: err.data.message } });
        }
      } else {
        openedModal(modals.Alert, { text: { body: err.message } });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, (errors) => console.log(errors))}>
        <CardLayout>
          <Card col="12">
            <Card.Head>
              <Card.Title>출퇴근 등록</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <AutoFormInput
                    inputId="userId"
                    label="사용자"
                    required
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onDate"
                    label="출근일"
                    type="date"
                    required
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onTime"
                    label="출근시간"
                    type="time"
                    required
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="onAddress"
                    label="출근 주소"
                    type="text"
                    required
                    error={methods.formState.errors}
                  />
                </li>

                <li>
                  <FormInput
                    inputId="offDate"
                    type="date"
                    label="퇴근일"
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="offTime"
                    label="퇴근시간"
                    type="time"
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="offAddress"
                    label="퇴근 주소"
                    type="text"
                    error={methods.formState.errors}
                  />
                </li>
              </SFormList>
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button color="gray" size="large" link={'/commute'}>
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

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
  }
`;
export default Index;
