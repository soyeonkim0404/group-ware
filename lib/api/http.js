import axios from 'axios';
import cookies from 'js-cookie';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export const httpNoInterceptors = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

let controller = new AbortController();

http.interceptors.request.use(
  (config) => {
    if (!config.headers['Authorization']) {
      const token = cookies.get('token');
      let authentication = '';
      if (token) {
        authentication = 'bearer ' + token;
      }

      config.headers['Authorization'] = authentication;
    }
    config.withCredentials = true;
    config.signal = controller.signal;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    const token = response.headers.get('Authorization');
    if (token) {
      cookies.set('token', token);
    }

    return response.data;
  },
  (error) => {
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && window.location.pathname !== '/') {
      cookies.remove('token');
      location.href = '/';

      return;
    }

    if (error.response) {
      const errorContents = error.response.data;
      return Promise.reject(errorContents);
    } else {
      return Promise.reject(error);
    }
  }
);

export const exportTokenByContext = (context) => {
  if (!context) return;
  const cookie = context.req.headers.cookie;

  if (!cookie) return;

  const cookieArray = cookie.split('; ');
  const cookieObj = {};

  for (let i = 0; i < cookieArray.length; i++) {
    const cur = cookieArray[i].split('=');
    cookieObj[cur[0]] = cur[1];
  }

  return cookieObj['token'] ? 'bearer ' + cookieObj['token'] : '';
};

export const cancelAxios = () => {
  try {
    controller.abort();
  } catch (e) {
    // console.log(e);
  } finally {
    controller = new AbortController();
  }
};

export default http;
