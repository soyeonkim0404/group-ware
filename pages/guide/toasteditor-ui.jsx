import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('../../components/ui/ToastEditor'), {
  ssr: false,
});

const ToasteditorUi = () => {
  return (
    <>
      <ToastEditor />
    </>
  );
};

export default ToasteditorUi;
