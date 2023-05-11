import React from 'react';
import ErrorUi from '@components/ui/ErrorUi';

const error500 = () => {
  return <ErrorUi status="500" text="Internal Server Error" />;
};

error500.layout = 'clean';

export default error500;
