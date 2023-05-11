import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import { apiApprovalPayment, apiCheckApproval, parallelApi } from '@api';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import { useRouter } from 'next/router';
import FileUpload from '@components/ui/FileUpload';
import TextArea from '@components/ui/TextArea';
import banks from '@lib/banks';
import { Switch } from '@mui/material';

const Payment = ({ data }) => {
  const { openedModal } = useModals();

  const methods = useForm();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const [resultFileData, setResultFileData] = useState([]);
  const [selectedData, setSelectData] = useState({});
  const [bankName, setBankName] = useState('');
  const [detailContents, setDetailContents] = useState('');
  const [manual, setManual] = useState(false);

  useEffect(() => {
    setSelectData(data.projectType.find((o) => o.id === -1));
  }, []);

  useEffect(() => {
    setManual(false);

    if (selectedData.id !== -1) {
      const bankId = methods.getValues('bank') || '';
      const bank = selectedData.banks?.find((o) => o.id === bankId);
      methods.setValue('client', selectedData.client);
      methods.setValue('account', bank?.account || '');
      methods.setValue('owner', bank?.name || '');

      setBankName(bank?.bankName || '');
    } else {
      methods.setValue('client', '');
      methods.setValue('owner', '');
      methods.setValue('account', '');
    }
  }, [selectedData]);

  useEffect(() => {
    if (selectedData.id !== -1) {
      methods.setValue('client', '');
      methods.setValue('owner', '');
      methods.setValue('account', '');
    }
  }, [manual]);

  const fileData = (data) => {
    setResultFileData(data);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    data.delegate = data.delegate || [];
    try {
      if (data.delegate?.length === 0) {
        const check = await apiCheckApproval();
        if (!check) {
          openedModal(modals.Alert, {
            text: { body: '관리자에게 문의하세요.' },
          });

          return;
        }
      }
    } catch (e) {
      if (e.data.code === 'E030') {
        openedModal(modals.ApprovalAdd, {
          title: '결재자 지정',
          onSubmit: (users) => {
            onSubmit({ ...data, delegate: users.map((user) => user.userId) });
          },
        });
      } else {
        openedModal(modals.Alert, {
          text: { body: e.data.message },
        });
      }

      return setLoading(false);
    }

    data.detail = detailContents;
    data.files = resultFileData;
    data.bank = bankName;

    apiApprovalPayment(data)
      .then((result) => {
        openedModal(modals.Alert, {
          text: { body: '결재 신청되었습니다.' },
          resolve: () => router.push('/approval'),
        });
      })
      .catch((err) => {
        if (err.data && err.data.code === 'V000') {
          setErrorMsg(err.data.message);
          return;
        }
        const message = err.data.message || '관리자한테 문의하세요.';
        openedModal(modals.Alert, {
          text: { body: message },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <FormProvider {...methods}>
        <CardLayout>
          <Card col="12">
            <Card.Head>
              <Card.Title>대금 품의서</Card.Title>
              <div>
                <Switch
                  checked={manual}
                  onChange={(e) => setManual(!manual)}
                  disabled={selectedData.id === -1}
                />
                직접 입력
              </div>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <FormSelect
                    getSelectData={data.projectType}
                    selectId="projectId"
                    error={errorMsg}
                    label="프로젝트명"
                    defaultValue={-1}
                    required={true}
                    onChange={(e) => {
                      setSelectData(
                        data.projectType.find((o) => o.id === e.target.value)
                      );
                    }}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="client"
                    placeholder={selectedData.isProject && !manual ? '지급처명' : ''}
                    label={selectedData.isProject && !manual ? '' : '지급처명'}
                    type="text"
                    error={errorMsg}
                    disabled={selectedData.isProject && !manual}
                    required={true}
                    length={85}
                  />
                </li>
                <li>
                  {selectedData.id !== -1 && !manual ? (
                    <FormSelect
                      getSelectData={
                        selectedData.banks?.map((bank) => ({
                          code: bank.id,
                          value: `${bank.clientName} - (${bank.bankName}) ${bank.account} [${bank.name}]`,
                        })) || []
                      }
                      selectId="bank"
                      label="은행"
                      error={errorMsg}
                      required={selectedData.banks?.length > 0}
                      onChange={(e) => {
                        const bank = selectedData.banks.find(
                          (o) => o.id === e.target.value
                        );
                        methods.setValue('account', bank?.account || '');
                        methods.setValue('owner', bank?.name || '');

                        setBankName(bank?.bankName || '');
                      }}
                    />
                  ) : (
                    <FormSelect
                      getSelectData={banks}
                      selectId="bank"
                      label="은행명"
                      type="text"
                      error={errorMsg}
                      required={!selectedData.banks?.length > 0}
                      onChange={(e) => {
                        const bank = banks.find((o) => o.code === e.target.value);
                        setBankName(bank?.name || '');
                      }}
                    />
                  )}
                </li>
                <li>
                  <FormInput
                    inputId="account"
                    placeholder={selectedData.isProject && !manual ? '지급처계좌' : ''}
                    label={selectedData.isProject && !manual ? '' : '지급처계좌'}
                    type="text"
                    error={errorMsg}
                    disabled={selectedData.isProject && !manual}
                    required={true}
                    length={85}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="price"
                    label="지급요청액(VAT포함)"
                    type="text"
                    style="price"
                    error={errorMsg}
                    required={true}
                    length={15}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="owner"
                    placeholder={selectedData.isProject && !manual ? '예금주' : ''}
                    label={selectedData.isProject && !manual ? '' : '예금주'}
                    type="text"
                    error={errorMsg}
                    disabled={selectedData.isProject && !manual}
                    required={true}
                    length={85}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={data.paymentMethods}
                    selectId="method"
                    error={errorMsg}
                    label="결제방법"
                    required={true}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={data.paymentType}
                    selectId="type"
                    error={errorMsg}
                    label="구분"
                    required={true}
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
              <TextArea
                placeholder="서비스 사용 기간 또는 정품 구입 상세 내용을 입력해주세요"
                onChange={(e) => setDetailContents(e.target.value)}
              />
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
      <Button.Wrap>
        <Button.Group>
          <Button color="gray" size="large" link={'/approval'}>
            취소
          </Button>
          <Button
            type="submit"
            color="blue"
            size="large"
            onClick={methods.handleSubmit(onSubmit, (err) => {
              setErrorMsg(err);
            })}
          >
            신청
          </Button>
        </Button.Group>
        <Button.Group>
          <Button color="primary" size="large" link={`/approval`}>
            목록
          </Button>
        </Button.Group>
      </Button.Wrap>
      {loading && <Loading />}
    </>
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

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'projectType',
      url: '/api/v1/project/select/my',
      method: 'get',
    },
    {
      name: 'paymentType',
      url: '/api/v1/code/select/payment/type',
      method: 'get',
    },
    {
      name: 'paymentMethods',
      url: '/api/v1/code/select/payment/methods',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const data = {
    paymentType: response['paymentType'],
    paymentMethods: response['paymentMethods'],
    projectType: response['projectType'].map((project) => ({
      ...project,
      value: project.projectName,
      isProject: true,
    })),
  };

  data.projectType.unshift({
    id: -1,
    value: '공통',
    isProject: false,
  });

  return {
    props: { data: data },
  };
});

export default Payment;
