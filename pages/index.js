import Image from 'next/image';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { apiLogin } from '@api';
import { useRouter } from 'next/router';
import cookies from 'js-cookie';
import CheckBox from '@components/ui/CheckBox';

function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isRemember, setIsRemember] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    cookies.remove('token');
    setLoading(false);

    const emailCookie = cookies.get('id');
    if (emailCookie) {
      setEmail(emailCookie);
      setIsRemember(true);
    }
  }, []);

  const [login, setLogin] = useState({
    id: {
      value: '',
      valid: true,
      error: '아이디가 존재하지 않습니다.',
    },
    password: {
      value: '',
      valid: true,
      error: '비밀번호가 일치하지 않습니다.',
    },
  });

  const onChange = (e, key) => {
    setLogin((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        value: e.target.value,
      },
    }));
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    if (isRemember) {
      cookies.set('id', e.target.value, { expires: 365 });
    }
  };

  const handleEmailAutocomplete = (e) => {
    const selectedEmail = e.target.value;
    setEmail(selectedEmail);
    setIsRemember(true);
    cookies.set('id', selectedEmail, { expires: 365 });
  };

  /*const onClickLoginButton = async () => {
    setLoading(true);
    try {
      await apiLogin({
        username: login.id.value || cookies.get('id') || email,
        password: Buffer.from(login.password.value, 'utf8').toString('base64'),
      });
      return router.push('/login/redirect');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };
*/
  const onClickLoginButton = () => {
      return router.push('/home');
  };

  const handleOnKeyPress = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      await onClickLoginButton();
    }
  };

  const handleCheck = (e) => {
    const isChecked = e.target.checked;
    setIsRemember(isChecked);
    if (isChecked && email) {
      cookies.set('id', email, { expires: 365 });
    } else {
      cookies.remove('id');
    }
  };

  return (
    <SLoginWrap>
      <SLogoImage>
        <Image src="/static/img/logo.png" alt="logo" layout="fill" />
      </SLogoImage>
      <SUl>
        <li>
          <Input
            name="userId"
            label="이메일"
            value={email || login.id.value || cookies.get('id')}
            onChange={(e) => {
              onChange(e, 'id');
              onChangeEmail(e);
            }}
            onBlur={handleEmailAutocomplete}
            autoComplete="on"
            error={!login.id.valid && login.id.error}
          />
        </li>
        <li>
          <Input
            name="userPassword"
            type="password"
            label="비밀번호"
            value={login.password.value || ''}
            onChange={(e) => {
              onChange(e, 'password');
            }}
            onKeyPress={handleOnKeyPress}
            error={!login.password.valid && login.password.error}
          />
        </li>
      </SUl>
      {router.query.message && <p className="error-message">{router.query.message}</p>}
      <SSnsBtn size="large" color="primary" fullWidth onClick={onClickLoginButton}>
        로그인
      </SSnsBtn>
      <SSaveEmail>
        <CheckBox
          key={'isRemember'}
          id={'isRemember'}
          checked={isRemember}
          onChange={handleCheck}
          label={'이메일 저장'}
        />
      </SSaveEmail>
      {loading && <Loading />}
      {/*<div className="sns-logins">
        <Button
          size="large"
          color="gray"
          outline
          fullWidth
          link={`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/oauth2/authorize/azure`}
        >
          <span className="sns-logo">
            <Image src="/static/img/ms-logo.svg" alt="logo" width={14} height={14} />
          </span>
          Microsoft로 로그인
        </Button>
      </div>*/}
    </SLoginWrap>
  );
}

const SUl = styled.ul`
  margin-top: 50px;
  li {
    & ~ li {
      margin-top: 10px;
    }
    label {
      max-width: none;
    }
  }
  & ~ button {
    margin: 0 0 0;
  }
`;

const SLoginWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  box-shadow: 0 12px 30px rgb(80 143 244 / 10%);
  width: 360px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 40px 20px;
  background: #fff;
  text-align: center;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  z-index: 99;

  .error-message {
    color: red;
    font-size: small;
  }
  .sns-logins {
    display: flex;
    margin-top: 15px;
    button {
      position: relative;
      span {
        font-size: 14px;
        color: #222;
        .sns-logo {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
        }
      }
    }
    .mobile & {
      flex-wrap: wrap;
      button + button {
        margin-left: 0;
        margin-top: 15px;
      }
    }
  }

  .mobile & {
    width: 320px;
  }
`;

const SSnsBtn = styled.button.attrs(() => ({ type: 'button' }))`
  width: 100%;
  height: 46px;
  font-size: 14px;
  background: #ee2c3c;
  color: #ffffff;
  border-radius: 4px;
`;
//logo 감싸는 div
const SLogoImage = styled.div`
  width: 160px;
  height: 30px;
  position: relative;
  margin: 0 auto;
  img {
    width: 100% !important;
    height: auto !important;
    object-fit: contain;
  }
`;

const SSaveEmail = styled.div`
  /*display: flex;
  justify-content: flex-end;*/
  margin-top: 20px;
`;

Index.layout = 'login';

export default Index;
