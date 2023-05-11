import ErrorUi from '@components/ui/ErrorUi';

const error403 = () => {
  return <ErrorUi status="403" text="Forbidden" />;
};

error403.layout = 'clean';

export default error403;
