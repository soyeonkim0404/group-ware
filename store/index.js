import { configureStore } from '@reduxjs/toolkit';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from 'redux-persist';
import { createLogger } from 'redux-logger';
import reducer from './modules';
import CryptoJS from 'crypto-js';

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();
const privateKey = 'Em&oTi%!0n_&^N2x(t#!_P$r$lva&te%2@*Ce#y.';
const encrypt = createTransform(
  (inBoundState) => {
    if (!inBoundState) return inBoundState;
    const encode = CryptoJS.AES.encrypt(JSON.stringify(inBoundState), privateKey);

    return encode.toString();
  },
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, privateKey);
    const decode = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decode);
  }
);
const isDevelopmentEnv = process.env.NODE_ENV !== 'production';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  transforms: [encrypt],
};
const persistedReducer = persistReducer(persistConfig, reducer);
const logger = createLogger();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    let myMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    if (isDevelopmentEnv) myMiddleware = myMiddleware.concat(logger);

    return myMiddleware;
  },
  devTools: isDevelopmentEnv,
});

export const persistor = persistStore(store);
export default store;
