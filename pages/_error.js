import { useRouter } from 'next/router';

function Error({ statusCode }) {
  const router = useRouter();

  switch (statusCode) {
    case 403:
      router.push('/error/403');
      break;
    case 404:
      router.push('/error/404');
      break;
    case 500:
      router.push('/error/500');
      break;
    default:
      break;
  }
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
