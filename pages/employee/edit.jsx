import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import Loading from '@components/ui/Loading';
import FormCheckBox from '@components/ui/FormCheckBox';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import Button from '@components/ui/Button';
import ProfileImage from '@components/ui/ProfileImage';
import { updateNewEmployee, parallelApi } from '@api';
import withGetServerSideProps from '@lib/withGetServerSideProps';

const Edit = ({ optionDatas }) => {
  const methods = useForm();
  const { setValue } = useForm();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState({});
  const [employeeViewData, setEmployeeViewData] = useState(optionDatas.prevData);
  const [pageReady, setPageReady] = useState(false);
  const [disablePassword, setDisablePassword] = useState(true);
  const [period, setPeriod] = useState(false);
  const [imageData, setImageData] = useState({});
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const flatArray = (arr) => {
      let target = Array.isArray(arr) ? arr : arr.childList;
      let result = Array.isArray(arr) ? [] : [arr];

      target
        .filter((item) => item.childList && item.childList.length > 0 && item.depth <= 3)
        .forEach(
          (item) => (result = result.concat(item).concat(flatArray(item.childList)))
        );

      return result.map((item) => ({
        name: item.name,
        code: item.code,
        depth: item.depth,
      }));
    };
    setDepartment(
      flatArray(optionDatas.part).map((item) => {
        let array = [];
        for (let i = 0; i < item.depth; i++) array.push('');
        return {
          fake: `${array.join('\u00A0\u00A0\u00A0\u00A0')}${
            item.depth !== 1 ? '└\u00A0' : ''
          }${item.name}`,
          name: item.name,
          code: item.code,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setPageReady(true);
      setPeriod(
        Boolean(
          employeeViewData.typeCode === 'MB200003' ||
            employeeViewData.typeCode === 'MB200004'
        )
      );
    }
  }, [router.isReady]);

  const onSubmit = async (data) => {
    data = { ...data, id: employeeViewData.id, profileImage: imageData };

    await updateNewEmployee(data)
      .then((result) => {
        alert('임직원 수정이 완료되었습니다.');
        router.push(`view?id=${employeeViewData.id}`);
      })
      .catch((err) => {
        if (err.data && err.data.code === 'V000') {
          setErrorMsg(err.data.message);
        } else if (err.data.code) {
          setErrorMsg({});
          alert(err.data.message);
        } else {
          setErrorMsg({});
          alert('관리자에게 문의하세요.');
        }
      });
  };

  const handleTypeCode = (e) => {
    if (e.target.value === 'MB200003' || e.target.value === 'MB200004') {
      setPeriod(true);
    } else {
      setPeriod(false);
    }
  };
  const handlePassword = () => {
    if (!disablePassword) setValue('password', '', { shouldValidate: true });
    setDisablePassword((prev) => !prev);
  };

  const changeProfileImage = (data) => {
    setImageData(data);
    methods.clearErrors('profileImage');
  };

  return pageReady ? (
    <>
      <FormProvider {...methods}>
        <CardLayout>
          <Card col="4">
            <Card.Body>
              <SProfileWrap>
                <SProfileImg>
                  <ProfileImage
                    src={employeeViewData.profileImage}
                    size="200"
                    callback={changeProfileImage}
                  />
                </SProfileImg>
                <SFormList>
                  <li style={{ marginTop: '30px' }}>
                    <FormInput
                      inputId="name"
                      label="이름"
                      length={10}
                      error={methods.formState.errors}
                      required={true}
                      defaultValue={employeeViewData.name}
                    />
                  </li>
                </SFormList>
              </SProfileWrap>
            </Card.Body>
          </Card>
          <Card col="4">
            <Card.Head>
              <Card.Title>인사정보</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                {employeeViewData.email && (
                  <>
                    <li>
                      <FormInput.Group>
                        <FormInput
                          inputId="password"
                          label="비밀번호"
                          type="password"
                          pattern={
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
                          }
                          length={85}
                          patternMessage="8~16자 영문 대 소문자, 숫자, 특수문자를 입력해주세요."
                          error={methods.formState.errors}
                          required={!disablePassword}
                          defaultValue={employeeViewData.password}
                          disabled={disablePassword}
                        />
                        <Button
                          type="button"
                          color="gray"
                          size="large"
                          onClick={handlePassword}
                        >
                          비밀번호 변경
                        </Button>
                      </FormInput.Group>
                    </li>
                  </>
                )}
                <li>
                  <FormInput
                    inputId="cardNum"
                    label="출입카드 번호"
                    pattern={/[0-9_-]$/}
                    length={20}
                    error={methods.formState.errors}
                    defaultValue={employeeViewData.cardNum}
                  />
                </li>
                <li>
                  <FormInput.Group>
                    <FormInput
                      inputId="birthday"
                      label="생일"
                      type="date"
                      defaultValue={employeeViewData.birthday}
                    />
                    <FormCheckBox
                      inputId="isSolar"
                      label="양력"
                      defaultValue={employeeViewData.isSolar}
                    />
                  </FormInput.Group>
                </li>
                <li>
                  <FormInput
                    inputId="mobilePhone"
                    label="휴대폰 번호"
                    pattern={/(^(\d{3})-(\d{3,4})-\d{4}$)/}
                    length={50}
                    error={methods.formState.errors}
                    defaultValue={employeeViewData.mobilePhone}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.role}
                    labelId="role-label"
                    selectId="role"
                    label="권한"
                    error={methods.formState.errors}
                    required={true}
                    onChange={(e) => {
                      handleTypeCode(e);
                    }}
                    defaultValue={employeeViewData.roleId}
                  />
                </li>
                {employeeViewData.email && (
                  <li>
                    <FormInput
                      inputId="expiredAt"
                      label="계정 만료일"
                      type="date"
                      error={errorMsg}
                      defaultValue={employeeViewData.expiredAt}
                    />
                  </li>
                )}
              </SFormList>
            </Card.Body>
          </Card>
          <Card col="4">
            <Card.Head>
              <Card.Title>조직관리</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.status}
                    labelId="status-label"
                    selectId="statusCode"
                    label="재직 상태"
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={employeeViewData.statusCode}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="joinDate"
                    label="입사일"
                    type="date"
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={employeeViewData.joinDate}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.type}
                    labelId="type-label"
                    selectId="typeCode"
                    label="고용 형태"
                    error={methods.formState.errors}
                    required={true}
                    onChange={(e) => {
                      handleTypeCode(e);
                    }}
                    defaultValue={employeeViewData.typeCode}
                  />
                </li>
                {period && (
                  <li>
                    <FormInput.Group>
                      <FormInput
                        inputId="contractStartDate"
                        label="계약 시작일"
                        type="date"
                        error={methods.formState.errors}
                        required={period}
                        defaultValue={employeeViewData.contractStartDate}
                      />
                      <FormInput
                        inputId="contractEndDate"
                        label="계약 종료일"
                        type="date"
                        error={methods.formState.errors}
                        required={period}
                        defaultValue={employeeViewData.contractEndDate}
                      />
                    </FormInput.Group>
                  </li>
                )}
                <li>
                  <FormSelect
                    getSelectData={department}
                    labelId="team-label"
                    selectId="organizationCode"
                    label="부서"
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={employeeViewData.organizationCode}
                    onOpenEvent={(e) => {
                      setDepartment((prevState) =>
                        prevState.map((prev) => ({
                          code: prev.code,
                          fake: prev.name,
                          name: prev.fake,
                        }))
                      );
                    }}
                    onCloseEvent={(e) => {
                      setDepartment((prevState) =>
                        prevState.map((prev) => ({
                          code: prev.code,
                          fake: prev.name,
                          name: prev.fake,
                        }))
                      );
                    }}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.position}
                    labelId="position-label"
                    selectId="positionCode"
                    label="직책"
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={employeeViewData.positionCode}
                  />
                </li>
                <li>
                  <FormSelect
                    getSelectData={optionDatas.grade}
                    labelId="grade-label"
                    selectId="gradeCode"
                    label="직급"
                    error={methods.formState.errors}
                    required={true}
                    defaultValue={employeeViewData.gradeCode}
                  />
                </li>
              </SFormList>
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button color="gray" size="large" link={'/employee'}>
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
        </Button.Wrap>
      </FormProvider>
    </>
  ) : (
    <Loading />
  );
};

const SProfileWrap = styled.div`
  padding: 20px;
  text-align: center;
  .label {
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }
  input {
    font-size: 20px;
    text-align: center;
    &:placeholder-shown,
    &.isValue {
      & ~ .label {
        color: ${(p) => p.theme.gray40};
        transform: translate3d(-50%, -20px, 0) scale(0.75);
      }
    }
    &:focus {
      & ~ .label {
        transform: translate3d(-50%, -20px, 0) scale(0.75);
      }
    }
  }
`;

const SProfileImg = styled.div`
  display: flex;
  justify-content: center;
`;

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'part',
      url: '/api/v1/organization/selectList',
      method: 'get',
    },
    {
      name: 'team',
      url: '/api/v1/organization/selectList/part',
      method: 'get',
    },
    {
      name: 'position',
      url: '/api/v1/code/select/position',
      method: 'get',
    },
    {
      name: 'grade',
      url: '/api/v1/code/select/grade',
      method: 'get',
    },
    {
      name: 'type',
      url: '/api/v1/code/select/member/type',
      method: 'get',
    },
    {
      name: 'status',
      url: '/api/v1/code/select/member/status',
      method: 'get',
    },
    {
      name: 'role',
      url: '/api/v1/role/list',
      method: 'get',
    },
    {
      name: 'prevData',
      url: `/api/v1/user/select?id=${context.query.id}`,
      method: 'get',
    },
  ];

  const optionDatas = await parallelApi(parallelData, context);

  optionDatas.role = optionDatas.role.map((o) => ({ name: o.alias, code: o.id }));

  return {
    props: { optionDatas },
  };
});

export default Edit;
