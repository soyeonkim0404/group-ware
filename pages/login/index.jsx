import Image from 'next/image';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { apiGetAuthList, apiGetMenuList, apiGetProfile, apiLogin } from '@api';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import * as profileActions from '@store/modules/profile';
import * as menuActions from '@store/modules/menu';
import * as authActions from '@store/modules/auth';

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
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

  const onClickLoginButton = async () => {
    setLoading(true);
    try {
      await apiLogin({
        username: login.id.value,
        password: Buffer.from(login.password.value, 'utf8').toString('base64'),
      });
    } catch (e) {
      alert(e.message);

      return;
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const result = await apiGetProfile();

      dispatch(profileActions.login(result.data));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const result = await apiGetMenuList();

      dispatch(menuActions.init(result));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const result = await apiGetAuthList();

      dispatch(authActions.init(result));
      await router.push('/');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnKeyPress = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      await onClickLoginButton();
    }
  };

  return (
    <SLoginWrap>
      <SLogoImage>
        <Image src="/static/img/logo.png" alt="logo" layout="fill" />
      </SLogoImage>
      <ul>
        <li>
          <Input
            name="userId"
            label="이메일"
            value={login.id.value || ''}
            onChange={(e) => {
              onChange(e, 'id');
            }}
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
      </ul>
      <Button size="large" color="primary" fullWidth onClick={onClickLoginButton}>
        로그인
      </Button>
      {loading && <Loading />}
      <div className="sns-logins">
        <Button
          size="large"
          color="red"
          fullWidth
          link="https://group.emotion.co.kr/api/v1/oauth2/authorize/azure"
        >
          MS
        </Button>
      </div>
    </SLoginWrap>
  );
}

const SLoginWrap = styled.div`
  display: inline-block;
  box-shadow: 0 12px 30px rgb(80 143 244 / 10%);
  box-sizing: border-box;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  padding: 40px;
  background: #fff;
  text-align: center;
  ul {
    margin: 10px 0 0;
    text-align: left;
    li {
      & ~ li {
        margin-top: 10px;
      }
      label {
        max-width: none;
      }
    }
    & ~ button {
      margin: 30px 0 0;
    }
  }
  .sns-logins {
    display: flex;
    margin-top: 15px;
    .mobile & {
      flex-wrap: wrap;
      button + button {
        margin-left: 0;
        margin-top: 15px;
      }
    }
  }
`;

const SSnsBtn = styled.button.attrs(() => ({ type: 'button' }))`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: gray;
  & ~ & {
    margin-left: 20px;
  }
`;
//logo 감싸는 div
const SLogoImage = styled.div`
  width: 130px;
  height: 30px;
  position: relative;
  margin: 0 auto;
  img {
    width: 100% !important;
    height: auto !important;
    object-fit: contain;
  }
`;

Index.layout = 'login';

export default Index;
