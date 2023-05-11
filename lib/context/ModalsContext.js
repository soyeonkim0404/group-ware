import { createContext } from 'react';

export const ModalsStateContext = createContext([]);
export const ModalsDispatchContext = createContext({
  open: () => {},
  close: () => {},
});
