import Loading from '@components/ui/Loading';
import cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiGetAuthList, apiGetMenuList, apiGetProfile } from '@api';
import * as profileActions from '@store/modules/profile';
import * as menuActions from '@store/modules/menu';
import * as authActions from '@store/modules/auth';
import { useDispatch } from 'react-redux';

function Redirect() {
  const router = useRouter();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const token = cookies.get('token');
    if (!token) router.push('/');

    getData();

    return () => setLoading(false);
  }, []);

  useEffect(() => {
    if (finish) router.push('/home');
  }, [finish]);

  const getData = async () => {
    try {
      const profile = await apiGetProfile();

      if (
        profile.data.email !== 'admin@emotion.co.kr' &&
        !profile.data.sub &&
        process.env.NODE_ENV === 'production'
      ) {
        return (location.href = `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/oauth2/authorize/azure?type=connect`);
      }
      dispatch(profileActions.login(profile.data));

      const menu = await apiGetMenuList();
      dispatch(menuActions.init(menu));

      const auth = await apiGetAuthList();
      dispatch(authActions.init(auth));

      setFinish(true);
    } catch (e) {
      return router.push('/');
    }

    return () => setLoading(false);
  };

  return <>{loading && <Loading />}</>;
}
Redirect.layout = 'login';

export default Redirect;
