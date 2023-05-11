import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import axios from 'axios';

const useErrorHandler = () => {
  const { openedModal, closeModal } = useModals();
  const callClose = (alert, onClose) => {
    closeModal(alert);
    if (onClose) {
      onClose();
    }
  };

  /**
   * 기본으로 사용하는 에러 핸들러
   * @param err
   */
  const defaultErrorHandler = (err, callback = null) => {
    if (axios.isCancel(err)) {
      return;
    }

    if (err === NO_USE_ERROR_HANDLER) {
      return;
    }

    if (err) {
      const alert = modals.Alert;

      if (err.status == '404') {
        openedModal(alert, {
          text: { body: 'API를 찾지 못했습니다.' },
          onClose: () => callClose(alert, callback),
        });
      } else {
        if (err.data) {
          if (err.data.code === 'V000' && typeof err.data.message != 'string') {
            openedModal(alert, {
              text: { body: '파라미터 오류' },
              onClose: () => callClose(alert, callback),
            });
          } else {
            openedModal(alert, {
              text: { body: err.data.message },
              onClose: () => callClose(alert, callback),
            });
          }
        } else {
          openedModal(alert, {
            text: { body: err.message },
            onClose: () => callClose(alert, callback),
          });
        }
      }
    } else {
      openedModal(alert, {
        text: { body: '알수없는 에러가 발생했습니다.' },
        onClose: () => callClose(alert, callback),
      });
    }
  };

  /**
   * useForm 전용 에러 핸들러
   * @param err
   * @param setError useForm에서 setError메서드를 받아야함.
   */
  const formErrorHandler = (err, setError) => {
    if (err) {
      if (err.data) {
        if (err.data.code == 'V000' && typeof err.data.message != 'string') {
          mappingError(err.data.message, setError);
        } else {
          openedModal(modals.Alert, { text: { body: err.data.message } });
        }
      } else {
        openedModal(modals.Alert, { text: { body: err.message } });
      }
    } else {
      openedModal(modals.Alert, { text: { body: '알수 없는 에러가 발생했습니다.' } });
    }
  };

  return { defaultErrorHandler, formErrorHandler };
};

/**
 * validation mapping
 * @param err
 * @param setError
 */
const mappingError = (errMessage, setError) => {
  Object.keys(errMessage).forEach((key, idx) => {
    if (errMessage[key] instanceof Array) {
      let message;
      if (typeof errMessage[key][0] == 'string') {
        message = errMessage[key][0];
        setError(key, {
          type: 'custom',
          message,
        });
      } else {
        message = getMessage(errMessage[key][0]);
        setError(key, {
          type: 'custom',
          message,
        });
      }
    } else {
      // mappingError(errMessage[key], setError);
    }
  });
};

const getMessage = (errMessage) => {
  const keys = Object.keys(errMessage);
  for (let i = 0; i < keys.length; i++) {
    if (errMessage[keys[i]] instanceof Array) {
      if (typeof errMessage[keys[i]][0] == 'string') {
        return errMessage[keys[i]][0];
      } else {
        // [{},{}]
        return getMessage(errMessage[keys[i]][0]);
      }
    } else {
      return getMessage(errMessage[keys[i]]);
    }
  }
};

export default useErrorHandler;
export const NO_USE_ERROR_HANDLER = 'no_use_error_handler';
