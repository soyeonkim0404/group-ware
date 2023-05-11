import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import {
  apiApprovalIndividualPayment,
  apiCheckApproval,
  getProjectByUser,
  parallelApi,
} from '@api';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import { useRouter } from 'next/router';
import DatePicker from '@components/ui/DatePicker';
import AutoFormInput from '@components/ui/AutoFormInput';
import { MdRemove } from 'react-icons/md';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import FileUpload from '@components/ui/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Tooltip from '@components/ui/Tooltip';

const Individual = ({ data }) => {
  const { openedModal } = useModals();

  const methods = useForm();

  const router = useRouter();

  const { formErrorHandler } = useErrorHandler();

  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [resultFileData, setResultFileData] = useState([]);
  const [fileError, setFileError] = useState('');
  const [personError, setPersonError] = useState('');

  const onClickAddPerson = (e) => {
    e.preventDefault();
    setMembers((prevState) => [...prevState, { key: uuidv4() }]);
  };

  const onClickRemovePerson = (item) => {
    setMembers((prevState) => [...prevState.filter((o) => o.key !== item.key)]);
  };

  const onSelectUser = async (item, user) => {
    try {
      methods.setValue(`paymentUsers[${item.key}].project`, '');
      setMembers((prevState) => [
        ...prevState.map((o) => (o.key === item.key ? { ...o, project: [] } : o)),
      ]);

      const response = await getProjectByUser({ id: user.id });
      const projectList = response.map((project) => ({
        id: project.id,
        value: project.projectName,
      }));
      projectList.unshift({ id: -1, value: '공통' });

      setMembers((prevState) => [
        ...prevState.map((o) =>
          o.key === item.key ? { ...o, projectList: projectList } : o
        ),
      ]);
    } catch (err) {
      if (err.data && err.data.code === 'V000') {
        formErrorHandler(err, methods.setError);
      } else if (err.data.code) {
        setErrorMsg({});
        alert(err.data.message);
      } else {
        setErrorMsg({});
        alert('관리자에게 문의하세요.');
      }
    }
  };

  const fileData = (data) => {
    setResultFileData(data);
  };

  const onSubmit = async (data) => {
    if (!resultFileData || resultFileData.length === 0) {
      return setFileError('1개 이상의 파일을 등록해야 합니다.');
    } else {
      setFileError('');
    }

    if (!members || members.length === 0) {
      return setPersonError('1명 이상의 인원을 추가해야 합니다.');
    } else {
      setPersonError('');
    }

    const _members = _.cloneDeep(members);
    const _errorMsg = {};

    Object.keys(_members).map((_) => {
      if (isNaN(_members[_].price) || _members[_].price < 1) {
        _errorMsg[`paymentUsers[${_members[_].key}].price`] = {
          message: '금액을 확인해주세요',
        };
      }
    });

    if (!_.isEmpty(_errorMsg)) {
      return setErrorMsg(_errorMsg);
    }

    data.paymentUsers = Object.keys(_members).map((_) => {
      delete _members[_].key;
      delete _members[_].projectList;
      return _members[_];
    });

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

    data.files = resultFileData;
    apiApprovalIndividualPayment(data)
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
      <CardLayout>
        <FormProvider {...methods}>
          <Card col="5">
            <Card.Head>
              <Card.Title>
                <SToolTipTitle>
                  결제신청
                  <Tooltip>
                    <Tooltip.Icon></Tooltip.Icon>
                    <Tooltip.Content>
                      <strong>품의종류</strong> : 개인지출(식대,교통비)
                      <br />
                      <strong>마감일</strong> : 익월 3일까지 <br />
                      <strong>정산일</strong> : 10일 <br />
                      <strong>작성시 유의사항</strong> :<br /> - 야근식대, 교통비만
                      품의가능
                      <br />- 그 외 용도 사용 시 사전품의 필수
                    </Tooltip.Content>
                  </Tooltip>
                </SToolTipTitle>
              </Card.Title>
            </Card.Head>
            <Card.Body>
              <FormSelect
                getSelectData={data.paymentType}
                labelId="payment-type"
                selectId="paymentType"
                label="종류"
                error={errorMsg}
                required={true}
              />
              <DatePicker.Group>
                <DatePicker
                  inputId="workDate"
                  label="근무일"
                  maxToday
                  error={errorMsg}
                  require
                />
              </DatePicker.Group>
              <FormInput inputId="comment" label="사유" length={333} error={errorMsg} />
              <FileUpload fileData={fileData} max={1} error={fileError} />
            </Card.Body>
          </Card>
          <Card col="7">
            <Card.Head>
              <Card.Title>
                인원 등록{personError && <SError>{personError}</SError>}
              </Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <div className="top">
                  <Button size="large" onClick={onClickAddPerson}>
                    구성원 추가
                  </Button>
                </div>
                <ul className="list">
                  {members.map((item) => {
                    const fieldName = `paymentUsers[${item.key}]`;

                    return (
                      <li key={fieldName} className="item">
                        <div className="options">
                          <AutoFormInput
                            inputId={`${fieldName}.user`}
                            label="구성원"
                            length={10}
                            required={true}
                            error={errorMsg}
                            onClickEvent={(user) => {
                              onSelectUser(item, user);

                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        user: user.id,
                                      }
                                    : { ...state }
                                )
                              );
                            }}
                          />
                          <FormSelect
                            getSelectData={item.projectList || []}
                            labelId={`${fieldName}.project`}
                            selectId={`${fieldName}.project`}
                            label="프로젝트"
                            error={errorMsg}
                            disabled={!item.projectList || item.projectList.length <= 0}
                            required={true}
                            onChange={(e) =>
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        project: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            style="price"
                            inputId={`${fieldName}.price`}
                            label="금액"
                            name="numberFormat"
                            error={errorMsg}
                            required={true}
                            byte={1000000000000}
                            length={10}
                            onChangeEvent={(e) =>
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        price: methods.getValues(`${fieldName}.price`),
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <Button
                            icon="40"
                            color="lightGray"
                            onClick={() => onClickRemovePerson(item)}
                            className={'option-delete'}
                          >
                            <MdRemove />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </SFormList>
            </Card.Body>
          </Card>
        </FormProvider>
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
            onClick={methods.handleSubmit(onSubmit, (err) => {
              console.log(err);
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

const SToolTipTitle = styled.div`
  span {
    margin-left: 5px;
    color: ${(p) => p.theme.gray30};
  }
`;

const SFormList = styled.ul`
  .top {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }
  .list {
    .item {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid ${(p) => p.theme.gray70};
      padding: 20px 20px 0 20px;
      margin-top: 20px;
      background: ${(p) => p.theme.gray90};
      box-sizing: border-box;
      .options {
        display: flex;
        width: 100%;
        align-items: center;
        .auto-input {
          width: 100%;
          margin-right: 20px;
          .suggest-list {
            width: calc(100% + 200px);
          }
        }
        .option-delete {
          flex: 0 0 40px;
          width: 40px;
          margin-left: 20px;
          margin-top: -20px;
          background: ${(p) => p.theme.gray50};
        }
        .form-delete {
          bottom: 30px;
          right: 12px;
          top: auto;
        }
      }
      & + .item {
        margin-top: 0;
      }
    }
  }
`;

const SError = styled.span`
  display: block;
  font-size: 11px;
  color: ${(p) => p.theme.red};
  margin-top: 10px;
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'paymentType',
      url: '/api/v1/code/select/payment/individual/type',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const data = {
    paymentType: response['paymentType'],
  };

  return {
    props: { data: data },
  };
});
export default Individual;
