import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import FormCheckBox from '@components/ui/FormCheckBox';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import Button from '@components/ui/Button';
import ProfileImage from '@components/ui/ProfileImage';
import { parallelApi, postNewEmployee } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import withGetServerSideProps from '@lib/withGetServerSideProps';

const Register = ({ optionDatas }) => {
  const methods = useForm();
  const { formErrorHandler } = useErrorHandler();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState({});
  const [period, setPeriod] = useState(false);
  const [imageData, setImageData] = useState(null);
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
  const onSubmit = async (data) => {
    data['profileImage'] = imageData;

    await postNewEmployee(data)
      .then((result) => {
        alert('임직원 추가가 완료되었습니다.');
        router.push('/employee');
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
  // 파일 이미지가 변경되면 호출
  const changeProfileImage = (data) => {
    setImageData(data);
    methods.clearErrors('profileImage');
  };

  const handleTypeCode = (e) => {
    if (e.target.value === 'MB200003' || e.target.value === 'MB200004') {
      setPeriod(true);
    } else {
      setPeriod(false);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <CardLayout>
          <Card col="4">
            <Card.Body>
              <SProfileWrap>
                <SProfileImg>
                  <ProfileImage size="200" callback={changeProfileImage} />
                </SProfileImg>
                <SFormList>
                  <li style={{ marginTop: '30px' }}>
                    <FormInput
                      inputId="name"
                      label="이름"
                      length={10}
                      error={methods.formState.errors}
                      required={true}
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
                <li>
                  <FormInput
                    inputId="email"
                    label="이메일"
                    pattern={/(^(.+)@(\S+)$)/}
                    length={85}
                    error={methods.formState.errors}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="password"
                    label="비밀번호"
                    type="password"
                    length={85}
                    error={methods.formState.errors}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="cardNum"
                    label="출입카드 번호"
                    pattern={/[0-9_-]$/}
                    length={20}
                    error={methods.formState.errors}
                  />
                </li>
                <li>
                  <FormInput.Group>
                    <FormInput inputId="birthday" label="생일" type="date" />
                    <FormCheckBox inputId="isSolar" label="양력" defaultValue={true} />
                  </FormInput.Group>
                </li>
                <li>
                  <FormInput
                    inputId="mobilePhone"
                    label="휴대폰 번호"
                    pattern={/(^(\d{3})-(\d{3,4})-\d{4}$)/}
                    length={50}
                    error={methods.formState.errors}
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
                  />
                </li>
                <li>
                  <FormInput
                    inputId="expiredAt"
                    label="계정 만료일"
                    type="date"
                    error={errorMsg}
                  />
                </li>
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
                  />
                </li>
                <li>
                  <FormInput
                    inputId="joinDate"
                    label="입사일"
                    type="date"
                    error={methods.formState.errors}
                    required={true}
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
                      />
                      <FormInput
                        inputId="contractEndDate"
                        label="계약 종료일"
                        type="date"
                        error={methods.formState.errors}
                        required={period}
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
              onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
            >
              등록
            </Button>
          </Button.Group>
        </Button.Wrap>
      </FormProvider>
    </>
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
  ];

  const optionDatas = await parallelApi(parallelData, context);

  optionDatas.role = optionDatas.role.map((o) => ({ name: o.alias, code: o.id }));
  return {
    props: { optionDatas },
  };
});

export default Register;
