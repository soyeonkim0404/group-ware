import { useForm, FormProvider } from 'react-hook-form';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import AutoFormInput from '@components/ui/AutoFormInput';
import React, { useEffect, useState } from 'react';
import FormSelect from '@components/ui/FormSelect';
import { getProjectOptions, postProjectRegister } from '@api';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import { MdAdd, MdRemove } from 'react-icons/md';
import { useRouter } from 'next/router';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const Register = ({ optionDatas }) => {
  const methods = useForm();
  const router = useRouter();
  const { formErrorHandler } = useErrorHandler();
  const [errorMsg, setErrorMsg] = useState({});
  const [members, setMembers] = useState([]);
  const [partners, setPartners] = useState([]);

  const onSubmit = async (data) => {
    const _members = _.cloneDeep(members);
    data.members = Object.keys(_members).map((_) => {
      delete _members[_].key;
      delete _members[_].roleList;
      return _members[_];
    });

    const _partners = _.cloneDeep(partners);
    data.partners = Object.keys(_partners).map((_) => {
      delete _partners[_].key;
      return _partners[_];
    });

    await postProjectRegister(data)
      .then(() => {
        alert('프로젝트 추가가 완료되었습니다.');
        router.push('/management');
      })
      .catch((err) => {
        if (err.data && err.data.code === 'V000') {
          formErrorHandler(err, methods.setError);
        } else if (err.data.code) {
          setErrorMsg({});
          alert(err.data.message);
        } else {
          setErrorMsg({});
          alert('관리자에게 문의하세요.');
        }
      });
  };

  const addPerson = (e) => {
    e.preventDefault();
    setMembers((prevState) => [...prevState, { key: uuidv4(), roleList: [] }]);
  };

  const removePerson = (item) => {
    setMembers((prevState) => [...prevState.filter((o) => o.key !== item.key)]);
  };

  const addPartner = (e) => {
    e.preventDefault();
    setPartners((prevState) => [...prevState, { key: uuidv4() }]);
  };

  const removePartner = (item) => {
    setPartners((prevState) => [...prevState.filter((o) => o.key !== item.key)]);
  };

  const handleRoleCode = (e, key) => {
    methods.setValue(`members[${key}].memberRole`, '');

    const roleList =
      optionDatas.role.filter(
        (role) =>
          role.code === (methods.getValues(`members[${key}].projectRole-one`) || '')
      )?.[0]?.child || [];

    setMembers((prevState) =>
      prevState.map((item) => (item.key === key ? { ...item, roleList: roleList } : item))
    );
  };

  return (
    <>
      <FormProvider {...methods}>
        <CardLayout>
          <Card col="4">
            <Card.Head>
              <Card.Title>프로젝트 등록</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <FormInput
                    inputId="projectName"
                    label="프로젝트명"
                    length={85}
                    error={methods.formState.errors}
                    required={true}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.type}
                    labelId="projectType-label"
                    selectId="projectType"
                    label="프로젝트 타입"
                    error={methods.formState.errors}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput.Group>
                    <FormInput
                      inputId="beginDate"
                      label="프로젝트 시작일"
                      type="date"
                      error={methods.formState.errors}
                      required={true}
                    />
                    <FormInput.Dash />
                    <FormInput
                      inputId="endDate"
                      label="프로젝트 종료일"
                      type="date"
                      error={methods.formState.errors}
                      required={true}
                    />
                  </FormInput.Group>
                </li>
                <SPartner>
                  <li>
                    <FormSelect
                      getSelectData={optionDatas.client}
                      labelId="projectClient-label"
                      selectId="client"
                      label="클라이언트"
                      error={methods.formState.errors}
                      required={true}
                    />
                    <Button icon="40" color="lightGray" onClick={addPartner}>
                      <MdAdd />
                    </Button>
                  </li>
                </SPartner>
                {partners.length > 0 && (
                  <SPartner>
                    {partners.map((partner, index) => {
                      const fieldName = `partners[${partner.key}]`;
                      return (
                        <li key={partner.key}>
                          <FormSelect
                            getSelectData={optionDatas.client}
                            labelId={`${fieldName}.id`}
                            selectId={`${fieldName}.id`}
                            label={`협력사 ${index + 1}`}
                            error={methods.formState.errors}
                            required={true}
                            onChange={(e) =>
                              setPartners((prevState) =>
                                prevState.map((state) =>
                                  state.key === partner.key
                                    ? {
                                        ...state,
                                        id: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <Button
                            icon="40"
                            color="lightGray"
                            onClick={() => removePartner(partner)}
                          >
                            <MdRemove />
                          </Button>
                        </li>
                      );
                    })}
                  </SPartner>
                )}

                <li>
                  <FormInput
                    style="price"
                    inputId="amount"
                    label="수주금액"
                    name="numberFormat"
                    error={methods.formState.errors}
                    required={true}
                    length={15}
                  />
                </li>
                <li>
                  <FormInput inputId="description" label="추가 설명" length={333} />
                </li>
              </SFormList>
            </Card.Body>
          </Card>
          <Card col="8">
            <Card.Head>
              <Card.Title>프로젝트 구성</Card.Title>
            </Card.Head>
            <Card.Body>
              <SProject>
                <div className="top">
                  <Button size="large" onClick={addPerson}>
                    구성원 추가
                  </Button>
                </div>
                <ul className="list">
                  {members &&
                    members.map((item) => {
                      const fieldName = `members[${item.key}]`;
                      return (
                        <li key={fieldName} className="item">
                          <div className="options">
                            <AutoFormInput
                              inputId={`${fieldName}.memberId`}
                              label="구성원"
                              length={85}
                              required={true}
                              error={errorMsg}
                              onClickEvent={(e) =>
                                setMembers((prevState) =>
                                  prevState.map((state) =>
                                    state.key === item.key
                                      ? {
                                          ...state,
                                          memberId: e.id,
                                        }
                                      : { ...state }
                                  )
                                )
                              }
                            />
                            <FormInput
                              type="number"
                              inputId={`${fieldName}.expectManMonth`}
                              label="예상 M/M"
                              required={true}
                              placeholder="00.00"
                              pattern={/\d{1,2}\.\d{2}/g}
                              patternMessage={'00.00 형식으로 작성해주세요.'}
                              error={errorMsg}
                              onChangeEvent={(e) =>
                                setMembers((prevState) =>
                                  prevState.map((state) =>
                                    state.key === item.key
                                      ? {
                                          ...state,
                                          expectManMonth: e.target.value,
                                        }
                                      : { ...state }
                                  )
                                )
                              }
                            />
                            <FormSelect
                              getSelectData={optionDatas.grade}
                              labelId="projectType-label"
                              selectId={`${fieldName}.memberGrade`}
                              label="등급"
                              required={true}
                              error={errorMsg}
                              onChange={(e) =>
                                setMembers((prevState) =>
                                  prevState.map((state) =>
                                    state.key === item.key
                                      ? {
                                          ...state,
                                          memberGrade: e.target.value,
                                        }
                                      : { ...state }
                                  )
                                )
                              }
                            />
                            <FormSelect
                              getSelectData={optionDatas.role}
                              label="부분"
                              selectId={`${fieldName}.projectRole-one`}
                              onChange={(e) => {
                                handleRoleCode(e, item.key);
                              }}
                              required={true}
                              error={errorMsg}
                            />
                            <FormSelect
                              getSelectData={item.roleList}
                              selectId={`${fieldName}.memberRole`}
                              label="역할"
                              required={true}
                              error={errorMsg}
                              onChange={(e) =>
                                setMembers((prevState) =>
                                  prevState.map((state) =>
                                    state.key === item.key
                                      ? {
                                          ...state,
                                          memberRole: e.target.value,
                                        }
                                      : { ...state }
                                  )
                                )
                              }
                            />
                            <Button
                              icon="40"
                              color="lightGray"
                              onClick={() => removePerson(item)}
                            >
                              <MdRemove />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </SProject>
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button color="gray" size="large" link={'/management'}>
              목록
            </Button>
            <Button
              type="submit"
              color="blue"
              size="large"
              onClick={methods.handleSubmit(onSubmit, setErrorMsg)}
            >
              등록
            </Button>
          </Button.Group>
        </Button.Wrap>
      </FormProvider>
    </>
  );
};

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
  }
`;

const SProject = styled.div`
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
          width: 20%;
          margin-right: 20px;
          .suggest-list {
            width: calc(100% + 200px);
          }
        }
        .select {
          width: 20%;
          min-width: auto;
        }
        .form-input {
          width: 15%;
          margin-right: 20px;
        }
        button:not(.form-delete) {
          flex: 0 0 40px;
          width: 40px;
          margin-left: 20px;
          margin-top: -20px;
          background: ${(p) => p.theme.gray50};
        }
      }
      & + .item {
        margin-top: 0;
      }
    }
  }
`;

const SPartner = styled.div`
  li {
    display: flex;

    button {
      flex: 0 0 40px;
      width: 40px;
      margin-top: 10px;
    }
  }

  & + & {
    padding-left: 15px;
    border-left: 2px solid #d0d9e3;
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const optionDatas = await getProjectOptions(context);
  optionDatas.client = optionDatas.client.sort((a, b) =>
    a.companyNameKr > b.companyNameKr ? 1 : -1
  );
  return {
    props: { optionDatas },
  };
});

export default Register;
