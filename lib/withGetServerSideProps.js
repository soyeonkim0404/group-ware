export default function withGetServerSideProps(getServerSideProps) {
  return async (context) => {
    try {
      return await getServerSideProps(context);
    } catch (err) {
      console.error(err);
      let redirectUrl = '/error/500';

      if (err.response?.status === 404) {
        redirectUrl = '/error/404';
      }

      if (err.response?.status === 403) {
        redirectUrl = '/error/403';
      }

      if (err.response?.status === 400) {
        redirectUrl = '/error/400';
      }

      if (err.response?.status === 401 && context?.resolvedUrl !== '/') {
        redirectUrl = '/';
      }

      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      };
    }
  };
}
