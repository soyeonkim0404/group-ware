import React, { useState } from 'react';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { apiUpdatePassword } from '@api';
import Loading from '@components/ui/Loading';

const PasswordChange = () => {
  const methods = useForm();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(errorMsg);
    if (data.newPassword !== data.newPasswordConfirm) {
      return setErrorMsg({
        newPasswordConfirm: ['패스워드가 일치하지 않습니다.'],
      });
    }

    const body = {
      currentPassword: Buffer.from(data.currentPassword, 'utf8').toString('base64'),
      newPassword: Buffer.from(data.newPassword, 'utf8').toString('base64'),
      newPasswordConfirm: Buffer.from(data.newPasswordConfirm, 'utf8').toString('base64'),
    };

    setLoading(true);
    apiUpdatePassword(body)
      .then((result) => {
        console.log(result);
        alert('변경되었습니다.');
        router.push('/home');
      })
      .catch((err) => {
        if (!err.success) {
          if (err.data.code === 'V030') {
            setErrorMsg({ currentPassword: [err.data.message] });
          } else if (err.data.code === 'V031') {
            setErrorMsg({ newPasswordConfirm: [err.data.message] });
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FormProvider {...methods}>
      <SPasswordChange>
        <STitle>비밀번호 변경</STitle>
        <SFormList>
          <li>
            <FormInput
              inputId="currentPassword"
              label="현재 비밀번호"
              type="password"
              length={20}
              error={errorMsg}
              required={true}
              placeholder={'현재 비밀번호를 입력해주세요'}
            />
          </li>
          <li>
            <FormInput
              inputId="newPassword"
              label="새 비밀번호"
              type="password"
              pattern={/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,16}/}
              patternMessage="8~16자 영문, 숫자를 입력해주세요."
              length={20}
              error={errorMsg}
              required={true}
              placeholder={'새로운 비밀번호를 입력해주세요'}
            />
          </li>
          <li>
            <FormInput
              inputId="newPasswordConfirm"
              label="새 비밀번호 확인"
              type="password"
              pattern={/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,16}/}
              patternMessage="8~16자 영문, 숫자를 입력해주세요."
              length={20}
              error={errorMsg}
              required={true}
              placeholder={'새로운 비밀번호를 입력해주세요'}
            />
          </li>
        </SFormList>
        <SBtn
          size="large"
          color="primary"
          fullWidth
          onClick={methods.handleSubmit(onSubmit, (err) => setErrorMsg(err))}
        >
          확인
        </SBtn>
        <SBtnHome
          size="large"
          color="primary"
          fullWidth
          onClick={() => router.push('/home')}
        >
          홈으로 돌아가기
        </SBtnHome>
      </SPasswordChange>
      {loading && <Loading />}
    </FormProvider>
  );
};

const STitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 25px;
`;

const SPasswordChange = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  box-shadow: 0 12px 30px rgb(80 143 244 / 10%);
  width: 500px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 40px 30px;
  background: #fff;
  text-align: center;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  z-index: 99;

  .mobile & {
    width: 90%;
  }
`;

const SFormList = styled.ul`
  margin: 50px 0 30px;
  li + li {
    margin-top: 20px;
  }
`;

const SBtn = styled.button.attrs(() => ({ type: 'button' }))`
  width: 100%;
  height: 46px;
  font-size: 14px;
  background: ${(p) => p.theme.black};
  color: #ffffff;
  border-radius: 4px;
`;

const SBtnHome = styled.button.attrs(() => ({ type: 'button' }))`
  margin-top: 10px;
  width: 100%;
  height: 46px;
  font-size: 14px;
  background: ${(p) => p.theme.red};
  color: #ffffff;
  border-radius: 4px;
`;

PasswordChange.layout = 'clean';

export default PasswordChange;
