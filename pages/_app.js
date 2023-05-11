import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@public/static/scss/common.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import PropTypes from 'prop-types';
import store, { persistor } from '../store';
import Layout from '../layouts';
import CleanLayout from '../layouts/CleanLayout';
import { ThemeProvider } from 'styled-components';
import ModalsProvider from '../provider/ModalsProvider';
import Modal from '../components/ui/modals';
import Toast from '@components/ui/Toast';
import '../components/ui/modals/modal.scss';
import ReactModal from 'react-modal';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loading from '@components/ui/Loading';
import ReadyProvider from '@provider/ReadyProvider';
import LoginLayout from '../layouts/LoginLayout';
const theme = require('sass-extract-loader?{"plugins":["sass-extract-js"], "options": {camelCase: true}}!../public/static/scss/common.scss');

/*
 * 리엑트 모달 생성시 사용되는 공통 스타일과 스크립트를 자동주입하는 설정
 */
ReactModal.setAppElement('#__next');
ReactModal.defaultStyles.overlay = {
  ...ReactModal.defaultStyles.overlay,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
ReactModal.defaultStyles.content = {
  ...ReactModal.defaultStyles.content,
  inset: 'auto',
  border: 'none',
  padding: 0,
  boxShadow: 'rgb(0 0 0 / 40%) 10px 10px 50px 0px',
  display: 'flex',
  margin: '0 15px',
  flexDirection: 'column',
};
ReactModal.defaultProps.isOpen = true;
ReactModal.defaultProps.onAfterOpen = () => {
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};
ReactModal.defaultProps.onAfterClose = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  document.body.style.width = '';
};

const layouts = {
  default: Layout,
  clean: CleanLayout,
  login: LoginLayout,
};

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const pathname = router.asPath.split('?')[0];
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(true);
  const SetLayout = layouts[Component.layout] || layouts['default'];

  useEffect(() => {
    if (!hasAuth()) {
      setAuthChecked(false);
      router.replace('/error/403').then(() => setAuthChecked(true));
    }
  }, [Component]);

  const hasAuth = (uri = pathname.toLowerCase()) => {
    const menu = store.getState().menu.menu;
    const auth = store.getState().auth.data;

    if (
      !uri.startsWith('/management/edit') &&
      (uri.endsWith('/register') || uri.endsWith('/edit'))
    ) {
      return (
        menu
          .filter((item) => uri.startsWith(item.uri?.toLowerCase()))
          .map((item) => item.code)
          .filter((code) =>
            auth.find((o) => o.menu === code && o.auth.toUpperCase().includes('W'))
          ).length > 0
      );
    } else if (
      uri.startsWith('/home') ||
      uri.startsWith('/error') ||
      uri.startsWith('/mypage') ||
      uri.startsWith('/login') ||
      uri.startsWith('/guide') ||
      uri.startsWith('/calendar') ||
      uri.startsWith('/management/edit') ||
      uri === '/'
    ) {
      return true;
    } else {
      return (
        menu
          .filter((item) => uri.startsWith(item.uri?.toLowerCase()))
          .map((item) => item.code)
          .filter((code) =>
            auth.find((o) => o.menu === code && o.auth.toUpperCase().includes('R'))
          ).length > 0
      );
    }
  };

  const loadingStart = (uri) => {
    if (hasAuth(uri) && !uri.startsWith('/error')) {
      setIsLoading(true);
    } else {
      return false;
    }
  };
  const loadingEnd = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', loadingStart);
    Router.events.on('routeChangeComplete', loadingEnd);
    Router.events.on('routeChangeError', loadingEnd);

    return () => {
      Router.events.off('routeChangeStart', loadingStart);
      Router.events.off('routeChangeComplete', loadingEnd);
      Router.events.off('routeChangeError', loadingEnd);
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReadyProvider>
          <ModalsProvider>
            <ThemeProvider theme={theme}>
              <Toast>
                {authChecked && (
                  <SetLayout>
                    <Component {...pageProps} />
                    <Modal />
                    {isLoading && <Loading />}
                  </SetLayout>
                )}
              </Toast>
            </ThemeProvider>
          </ModalsProvider>
        </ReadyProvider>
      </PersistGate>
    </Provider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any,
};

export default MyApp;
