import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import Card, { CardLayout } from '@components/ui/Card';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import Button from '@components/ui/Button';
import AutoFormInput from '@components/ui/AutoFormInput';
import { MdRemove, MdOutlineRestore, MdAdd } from 'react-icons/md';
import {
  apiProjectAvailableEdit,
  getProjectDetails,
  getProjectOptions,
  postProjectUpdate,
} from '@api';
import Loading from '@components/ui/Loading';
import styled from 'styled-components';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const Edit = ({ optionDatas, prevData }) => {
  const methods = useForm();
  const router = useRouter();
  const { formErrorHandler } = useErrorHandler();
  const [errorMsg, setErrorMsg] = useState({});
  const [members, setMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const [projectViewData, setProjectViewData] = useState(prevData);

  useEffect(() => {
    if (projectViewData.amount) {
      methods.setValue('amount', projectViewData.amount);
    }

    let optionChildList = [];
    optionDatas.role.forEach(
      (role) =>
        (optionChildList = [
          ...optionChildList,
          ...role.child.map((c) => ({ code: c.code, value: c.value, parent: role.code })),
        ])
    );

    setMembers(
      projectViewData.members?.map((member, index) => {
        const roleParentCode =
          optionChildList.filter((o) => o.code === member.memberRoleCode)?.[0]?.parent ||
          '';

        const projectRole = optionDatas.role.filter(
          (role) => role.code === roleParentCode
        )?.[0];

        const roleList = projectRole?.child || [];
        const projectRoleOne = projectRole?.value || '';
        const projectRoleOneCode = projectRole?.code || '';

        return {
          key: uuidv4(),
          roleList: roleList,
          memberId: member.memberId,
          memberName: member.memberName,
          memberRole: member.memberRole,
          memberRoleCode: member.memberRoleCode,
          projectRoleOne: projectRoleOne,
          projectRoleOneCode: projectRoleOneCode,
          memberGrade: member.memberGrade,
          memberGradeCode: member.memberGradeCode,
          expectManMonth: member.expectManMonth,
          isDelete: member.isDelete,
          exists: true,
        };
      })
    );

    setPartners(
      projectViewData.partners?.map((partner, index) => {
        return {
          key: uuidv4(),
          id: partner.partnerId,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setPageReady(true);
    }
  }, [router.isReady]);

  const onSubmit = async (data) => {
    data.id = prevData.id;
    const _member = _.cloneDeep(members);
    data.members = Object.keys(_member).map((_) => {
      return {
        memberId: _member[_]['memberId'],
        expectManMonth: _member[_]['expectManMonth'],
        memberGrade: _member[_]['memberGradeCode'],
        memberRole: _member[_]['memberRoleCode'],
        isDelete: _member[_]['isDelete'] || false,
      };
    });

    const _partners = _.cloneDeep(partners);
    data.partners = Object.keys(_partners).map((_) => {
      delete _partners[_].key;
      return _partners[_];
    });

    await postProjectUpdate(data)
      .then(() => {
        alert('프로젝트 수정이 완료되었습니다.');
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
    setMembers((prevState) => [
      ...prevState,
      { key: uuidv4(), roleList: [], isDelete: false },
    ]);
  };

  const removePerson = (index) => {
    if (index.exists) {
      setMembers((prevState) => [
        ...prevState.map((item) =>
          item.key === index.key ? { ...item, isDelete: !item.isDelete } : item
        ),
      ]);
    } else {
      setMembers(members.filter((o) => o.key !== index.key));
    }
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

  return pageReady ? (
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
                    byte={255}
                    length={85}
                    error={errorMsg}
                    required={true}
                    defaultValue={projectViewData.projectName}
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
                    defaultValue={projectViewData.projectTypeCode}
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
                      defaultValue={projectViewData.beginDate}
                    />
                    <FormInput.Dash />
                    <FormInput
                      inputId="endDate"
                      label="프로젝트 종료일"
                      type="date"
                      error={methods.formState.errors}
                      required={true}
                      defaultValue={projectViewData.endDate}
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
                      defaultValue={projectViewData.clientId}
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
                            defaultValue={partner.id}
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
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={projectViewData.amount}
                    length={15}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="description"
                    label="추가 설명"
                    byte={1000}
                    length={333}
                    defaultValue={projectViewData.description}
                  />
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
                  {members.map((index) => {
                    let fieldName = `members[${index.key}]`;

                    index.memberId &&
                      methods.setValue(`${fieldName}.memberId`, index.memberId);
                    index.expectManMonth &&
                      methods.setValue(
                        `${fieldName}.expectManMonth`,
                        index.expectManMonth
                      );
                    methods.setValue(`${fieldName}.isDelete`, index.isDelete || false);

                    return (
                      <li
                        key={fieldName}
                        className={index.isDelete ? 'item disable' : 'item'}
                      >
                        <div className="options">
                          <AutoFormInput
                            inputId={`${fieldName}.memberId`}
                            label="구성원"
                            defaultValue={index.memberName}
                            required={true}
                            error={errorMsg}
                            length={85}
                            readonly={index.isDelete}
                            onClickEvent={(user) => {
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === index.key
                                    ? {
                                        ...state,
                                        memberId: user.id,
                                      }
                                    : { ...state }
                                )
                              );
                            }}
                          />
                          <FormInput
                            type="number"
                            inputId={`${fieldName}.expectManMonth`}
                            label="예상 M/M"
                            defaultValue={index.expectManMonth}
                            required={true}
                            placeholder="00.00"
                            pattern={/\d{1,2}\.\d{2}/g}
                            patternMessage={'00.00 형식으로 작성해주세요.'}
                            error={errorMsg}
                            readonly={index.isDelete}
                            onChangeEvent={(e) =>
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === index.key
                                    ? {
                                        ...state,
                                        expectManMonth: methods.getValues(
                                          `${fieldName}.expectManMonth`
                                        ),
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
                            defaultValue={index.memberGradeCode}
                            label="등급"
                            required={true}
                            error={errorMsg}
                            readonly={index.isDelete}
                            onChange={(e) =>
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === index.key
                                    ? {
                                        ...state,
                                        memberGradeCode: e.target.value,
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
                            defaultValue={index.projectRoleOneCode || ''}
                            onChange={(e) => {
                              handleRoleCode(e, index.key);
                            }}
                            required={true}
                            error={errorMsg}
                            readonly={index.isDelete}
                          />
                          <FormSelect
                            getSelectData={index.roleList}
                            selectId={`${fieldName}.memberRole`}
                            label="역할"
                            defaultValue={index.memberRoleCode}
                            required={true}
                            error={errorMsg}
                            readonly={index.isDelete}
                            onChange={(e) =>
                              setMembers((prevState) =>
                                prevState.map((state) =>
                                  state.key === index.key
                                    ? {
                                        ...state,
                                        memberRoleCode: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            type="text"
                            inputId={`${fieldName}.isDelete`}
                            label="삭제여부"
                            defaultValue={index.isDelete || false}
                            hidden
                          />
                          <Button
                            icon="40"
                            color="lightGray"
                            onClick={() => {
                              removePerson(index);
                            }}
                          >
                            {index.isDelete ? <MdOutlineRestore /> : <MdRemove />}
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
              수정
            </Button>
          </Button.Group>
        </Button.Wrap>
      </FormProvider>
    </>
  ) : (
    <Loading />
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
          z-index: 10;
        }
      }
      & + .item {
        margin-top: 0;
      }
      &.disable {
        position: relative;
        cursor: default;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.4);
          z-index: 9;
        }
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
  await apiProjectAvailableEdit(context.query, context);

  const optionDatas = await getProjectOptions(context);
  const prevData = await getProjectDetails(context.query, context);
  optionDatas.client = optionDatas.client.sort((a, b) =>
    a.companyNameKr > b.companyNameKr ? 1 : -1
  );
  return {
    props: { optionDatas, prevData },
  };
});

export default Edit;
