import { useState } from 'react';

const usePageable = () => {
  const [pageable, setPageable] = useState({
    totalPages: 0,
    page: 1,
    total: 0,
    size: 10,
    initialPage: 1,
  });
  return { pageable, setPageable };
};

export default usePageable;
