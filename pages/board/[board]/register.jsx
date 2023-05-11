import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import { apiGetBoardInfo, apiRegisterPost } from '@api';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import dynamic from 'next/dynamic';
import FileUpload from '@components/ui/FileUpload';
import { useRouter } from 'next/router';
import FormCheckBox from '@components/ui/FormCheckBox';
import Loading from '@components/ui/Loading';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';

const ToastEditor = dynamic(() => import('@components/ui/ToastEditor'), {
  ssr: false,
});

const Register = (boardInfo) => {
  const methods = useForm();

  const { defaultErrorHandler } = useErrorHandler();

  const { openedModal, closeModal } = useModals();

  const router = useRouter();
  const { board } = router.query;

  const [resultFileData, setResultFileData] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState('');

  useEffect(() => {
    setFormObject({
      boardId: boardInfo.id,
      title: '',
      body: '',
      useNotice: false,
      useComment: false,
      useVote: false,
      useMultiVote: false,
      voteStartDatetime: '',
      voteEndDatetime: '',
    });
  }, []);

  const onSubmit = async (data) => {
    const result = {};
    for (const key in formObject) {
      result[key] = data[key] ? data[key] : formObject[key];
    }

    result.body = editor;
    result.files = resultFileData;

    setLoading(true);
    try {
      await apiRegisterPost(result);

      openedModal(modals.Alert, {
        text: { body: '등록되었습니다.' },
        onClose: () => {
          closeModal(modals.Alert);
          router.push(`/board/${board}`);
        },
      });
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };
  const fileData = (data) => {
    setResultFileData(data);
  };

  return (
    <FormProvider {...methods}>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SBoard>
              <div className="board-tit">
                <FormInput
                  inputId="title"
                  label="게시판 제목"
                  length={333}
                  error={methods.formState.errors}
                  required
                />
              </div>
              <div className="options">
                <div className="item">
                  {boardInfo.isAllowNotice && (
                    <FormCheckBox
                      inputId="useNotice"
                      label="공지 여부"
                      defaultValue={false}
                      error={methods.formState.errors}
                    />
                  )}
                  {boardInfo.isAllowComment && (
                    <FormCheckBox
                      inputId="useComment"
                      label="댓글 허용"
                      defaultValue={false}
                      error={methods.formState.errors}
                    />
                  )}
                  {/*{boardInfo.isAllowVote && (*/}
                  {/*  <FormCheckBox*/}
                  {/*    inputId="useVote"*/}
                  {/*    label="투표 허용"*/}
                  {/*    error={methods.formState.errors}*/}
                  {/*  />*/}
                  {/*)}*/}
                  {/*{boardInfo.isAllowMultiVote && (*/}
                  {/*  <FormCheckBox*/}
                  {/*    inputId="useMultiVote"*/}
                  {/*    label="다중 투표 허용"*/}
                  {/*    error={methods.formState.errors}*/}
                  {/*  />*/}
                  {/*)}*/}
                </div>
              </div>
            </SBoard>
          </Card.Body>
        </Card>

        <Card col="12">
          <Card.Body>
            <ToastEditor initialValue={editor} setEditor={setEditor} />
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
          <Button color="gray" size="large" link={`/board/${board}`}>
            목록
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
      </Button.Wrap>
      {loading && <Loading />}
    </FormProvider>
  );
};

const SBoard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .options {
    margin-left: 20px;
    box-sizing: border-box;
    .mobile & {
      flex-wrap: wrap;
      gap: 0;
      .item {
        flex: 0 0 100%;
        width: 100%;
        & + .item {
          padding-left: 0;
          margin-left: 0;
          margin-top: 10px;
          padding-top: 20px;
          border: none;
          border-top: 1px solid ${(p) => p.theme.gray70};
        }
      }
    }
  }
  .board-tit {
    flex: 1;
    display: inline-flex;
    align-items: center;
  }
  @media screen and (max-width: 1300px) {
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    .board-tit {
      width: 100%;
    }
    .options {
      margin-left: 0;
    }
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const { board } = context.query;
  const boardInfo = await apiGetBoardInfo({ name: board }, context);

  return {
    props: boardInfo,
  };
});

export default Register;
