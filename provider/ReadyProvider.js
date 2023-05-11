import { useState, useMemo, useContext } from 'react';
import { ReadyContext } from '@lib/context/ReadyContext';
import Loading from '@components/ui/Loading';
import { createPortal } from 'react-dom';

const ReadyProvider = ({ children, value }) => {
  const [isReady, setReady] = useState(true);
  return (
    <ReadyContext.Provider value={[isReady, setReady]}>
      {isReady ? <></> : createPortal(<Loading />, document.body)}
      {children}
    </ReadyContext.Provider>
  );
};

export default ReadyProvider;
