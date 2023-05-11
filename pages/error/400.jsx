import ErrorUi from '@components/ui/ErrorUi';

const error400 = () => {
  return <ErrorUi status="400" text="Bad Request" />;
};

error400.layout = 'clean';

export default error400;
