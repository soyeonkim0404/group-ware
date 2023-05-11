import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@components/ui/Button';
import { apiApprovalTaxLetter, apiCheckApproval } from '@api';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import FileUpload from '@components/ui/FileUpload';
import FormInput from '@components/ui/FormInput';
import Tooltip from '@components/ui/Tooltip';
const ToastEditor = dynamic(() => import('@components/ui/ToastEditor'), {
  ssr: false,
});
const Tax = () => {
  const { openedModal } = useModals();

  const methods = useForm();

  const router = useRouter();

  const [resultFileData, setResultFileData] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState(
    `1. 거래처명: 
2. 품목: 
3. 작성일자:  
4. 금액
    * 공급가: 
    * 부가세(VAT): 
    * 합계금액: 
5. 담당자
    * 이름: 
    * 이메일:  
6. 입금예정일: `
  );
  const [template, setTemplate] = useState('');

  const fileData = (data) => {
    setResultFileData(data);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (!data.delegate || data.delegate?.length === 0) {
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

    data.contents = editor;
    data.files = resultFileData;

    apiApprovalTaxLetter(data)
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
              <Card.Title>세금계산서 발행</Card.Title>
            </Card.Head>
            <Card.Body>
              <SBoardTop>
                <FormInput
                  inputId="title"
                  label="제목"
                  length={85}
                  error={errorMsg}
                  required={true}
                />
              </SBoardTop>
            </Card.Body>
          </Card>
          <Card col="12">
            <Card.Body>
              <SFormList>
                <ToastEditor
                  initialValue={editor}
                  setEditor={setEditor}
                  changeEditor={template}
                />
              </SFormList>
            </Card.Body>
          </Card>
          <Card col="12">
            <Card.Head>
              <Card.Title>첨부파일</Card.Title>
            </Card.Head>
            <Card.Body>
              <FileUpload fileData={fileData} />
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button color="gray" size="large" link={'/approval'}>
              취소
            </Button>
            <Button
              type="submit"
              color="blue"
              size="large"
              onClick={methods.handleSubmit(onSubmit, (err) => setErrorMsg(err))}
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
      </FormProvider>
    </>
  );
};

const SToolTipTitle = styled.div`
  span {
    margin-left: 5px;
    color: ${(p) => p.theme.gray30};
  }
`;

const SBoardTop = styled.div`
  display: flex;
  .select {
    flex: 0 1 30%;
  }
  .form-input {
  }
  .mobile & {
    flex-wrap: wrap;
    .select {
      flex: none;
    }
  }
`;

const SFormList = styled.div`
  .toastui-editor-contents {
    font-size: large;
    table {
      th {
      }
      td {
        min-width: 120px;
      }
    }
  }
`;

export default Tax;
