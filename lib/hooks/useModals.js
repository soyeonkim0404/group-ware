import { useContext } from 'react';
import { ModalsDispatchContext } from '@lib/context/ModalsContext';

const useModals = () => {
  const { open, close } = useContext(ModalsDispatchContext);
  const openedModal = (Component, props) => {
    open(Component, props);
  };
  const closeModal = (Component) => {
    close(Component);
  };

  return {
    openedModal,
    closeModal,
  };
};

export default useModals;
