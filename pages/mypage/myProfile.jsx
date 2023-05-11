import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import ProfileImage from '@components/ui/ProfileImage';
import FormInput from '@components/ui/FormInput';
import Button from '@components/ui/Button';
import FormCheckBox from '@components/ui/FormCheckBox';
import DataView from '@components/ui/DataView';
import { useDispatch } from 'react-redux';
import { apiGetMyInfo, apiGetProfile, apiUpdateMypage } from '@api';
import Loading from '@components/department/Loading';
import { useRouter } from 'next/router';
import * as profileActions from '@store/modules/profile';

const MyProfile = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const methods = useForm();
  const { setValue } = useForm();

  const [myData, setMyData] = useState({});

  const [disablePassword, setDisablePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState({});
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState({});

  const getMyProfile = () => {
    setLoading(true);
    apiGetMyInfo()
      .then((res) => {
        setMyData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  const passwordChange = ({ target: { value } }) => {
    setPassword(value);
  };

  const profileImageChange = (data) => {
    setImageData(data);
    methods.clearErrors('profileImage');
  };

  const onSubmit = async (data) => {
    data.password = password;
    data.profileImage = imageData;

    apiUpdateMypage(data)
      .then(async () => {
        const profile = await apiGetProfile();
        dispatch(profileActions.login(profile.data));
      })
      .then((res) => {
        alert('개인정보 수정이 완료되었습니다.');
        router.push(`/home`);
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

  const handlePassword = () => {
    if (!disablePassword) setValue('password', '', { shouldValidate: true });
    setDisablePassword((prev) => !prev);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <CardLayout>
          <Card col="12">
            <Card.Body>
              <STab>
                <ul>
                  <li className="item">
                    <Link href={'/mypage'}>
                      <a>캘린더</a>
                    </Link>
                  </li>
                  <li className="item">
                    <Link href={'/mypage/myDocument'}>
                      <a>결재내역</a>
                    </Link>
                  </li>
                  <li className="item active">
                    <Link href={'/mypage/myProfile'}>
                      <a>개인정보수정</a>
                    </Link>
                  </li>
                </ul>
              </STab>
              <FormProvider {...methods}>
                <CardLayout>
                  <Card col="4">
                    <Card.Body>
                      <SProfileWrap>
                        <SProfileImg>
                          <ProfileImage
                            src={myData.profileImage}
                            size="200"
                            callback={profileImageChange}
                          />
                        </SProfileImg>
                        <SFormList>
                          <li style={{ marginTop: '30px' }}>
                            <DataView>
                              <DataView.Item label="이름">{myData.name}</DataView.Item>
                            </DataView>
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
                            length={85}
                            defaultValue={myData.email}
                            disabled
                          />
                        </li>
                        {myData.email && (
                          <>
                            <li
                              className="password"
                              style={{ marginBottom: '30px', marginTop: '0' }}
                            >
                              {/*<FormInput.Group>
                                <FormInput
                                  inputId="password"
                                  label="비밀번호"
                                  type="password"
                                  pattern={
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/
                                  }
                                  patternMessage="8~16자 영문 대 소문자, 숫자, 특수문자를 입력해주세요."
                                  length={85}
                                  error={errorMsg}
                                  required={!disablePassword}
                                  defaultValue={myData.password}
                                  disabled={disablePassword}
                                  onChangeEvent={passwordChange}
                                />
                                <Button
                                  type="button"
                                  color="gray"
                                  size="large"
                                  onClick={handlePassword}
                                >
                                  비밀번호 변경
                                </Button>
                              </FormInput.Group>*/}
                              <span
                                style={{
                                  display: 'block',
                                  color: 'rgb(173,181,189)',
                                  fontSize: '12px',
                                  marginBottom: '10px',
                                }}
                              >
                                비밀번호
                              </span>
                              <Button
                                type="button"
                                color="gray"
                                size="large"
                                onClick={() => router.push('/mypage/passwordChange')}
                              >
                                비밀번호 변경
                              </Button>
                            </li>
                          </>
                        )}
                        <li>
                          <FormInput
                            inputId="cardNum"
                            label="출입카드 번호"
                            length={20}
                            defaultValue={myData.cardNum}
                            disabled
                          />
                        </li>
                        <li>
                          <FormInput.Group>
                            <FormInput
                              inputId="birthday"
                              label="생일"
                              type="date"
                              defaultValue={myData.birthday}
                            />
                            <FormCheckBox
                              inputId="isSolar"
                              label="양력"
                              defaultValue={myData.isSolar}
                            />
                          </FormInput.Group>
                        </li>
                        <li>
                          <FormInput
                            inputId="mobilePhone"
                            label="휴대폰 번호"
                            pattern={/(^(\d{3})-(\d{3,4})-\d{4}$)/}
                            length={50}
                            error={errorMsg}
                            defaultValue={myData.mobilePhone}
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
                      <DataView>
                        <DataView.Item label="재직 상태">{myData.status}</DataView.Item>
                        <DataView.Item label="입사일">{myData.joinDate}</DataView.Item>
                        <DataView.Item label="입사형태">{myData.type}</DataView.Item>
                        {myData.typeCode === 'MB200003' ||
                          (myData.typeCode === 'MB200004' && (
                            <>
                              <DataView.Item label="계약 시작일">
                                {myData.contractStartDate}
                              </DataView.Item>
                              <DataView.Item label="계약 종료일">
                                {myData.contractEndDate}
                              </DataView.Item>
                            </>
                          ))}
                        <DataView.Item label="부서">{myData.organization}</DataView.Item>
                        <DataView.Item label="직책">{myData.position}</DataView.Item>
                        <DataView.Item label="직급">{myData.grade}</DataView.Item>
                      </DataView>
                    </Card.Body>
                  </Card>
                </CardLayout>
                <Button.Wrap>
                  <Button.Group>
                    <Button
                      type="submit"
                      color="blue"
                      size="large"
                      onClick={methods.handleSubmit(onSubmit, (err) => setErrorMsg(err))}
                    >
                      저장
                    </Button>
                  </Button.Group>
                </Button.Wrap>
              </FormProvider>
            </Card.Body>
          </Card>
        </CardLayout>
      )}
    </>
  );
};

const STab = styled.div`
  ul {
    display: flex;
    border-bottom: 1px solid ${(p) => p.theme.gray60};
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      padding: 20px;
      cursor: pointer;
      transition: all 0.5s ease;
      &.active {
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 2px;
          left: 0;
          bottom: 0;
          background-color: ${(p) => p.theme.blue};
        }
      }
    }
  }
`;

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
    &.password {
      .mobile & {
        > div {
          flex-direction: row;
        }
      }
    }
  }
`;

export default MyProfile;
