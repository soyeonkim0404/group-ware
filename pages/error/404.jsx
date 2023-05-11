import ErrorUi from '@components/ui/ErrorUi';

const error404 = () => {
  return <ErrorUi status="404" text="Page Not Found" />;
};

error404.layout = 'clean';

export default error404;
