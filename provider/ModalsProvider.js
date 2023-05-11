import { useState, useMemo } from 'react';
import { ModalsStateContext, ModalsDispatchContext } from '../lib/context/ModalsContext';

const ModalsProvider = ({ children }) => {
  const [openedModals, setOpenedModals] = useState([]);
  const open = (Component, props) => {
    setOpenedModals((modals) => {
      return [...modals, { Component, props }];
    });
  };

  const close = (Component) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  };
  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <ModalsDispatchContext.Provider value={dispatch}>
      <ModalsStateContext.Provider value={openedModals}>
        {children}
      </ModalsStateContext.Provider>
    </ModalsDispatchContext.Provider>
  );
};

export default ModalsProvider;
