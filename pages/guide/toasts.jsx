import { useContext } from 'react';
import { ToastContext } from '@components/ui/Toast';
import Button from '@components/ui/Button';
import Card, { CardLayout } from '@components/ui/Card';

const Toasts = () => {
  const { addToast } = useContext(ToastContext);
  return (
    <CardLayout>
      <Card col="6">
        <Card.Body>
          <Button
            size="large"
            color="primary"
            onClick={() => addToast('success', '당신은 성공하셨습니다.')}
          >
            SUCCESS
          </Button>
          <Button
            size="large"
            color="red"
            onClick={() => addToast('error', '에러가 발생하였습니다.')}
          >
            ERROR
          </Button>
          <Button
            size="large"
            color="blue"
            onClick={() => addToast('info', '복사가 완료되었습니다.')}
          >
            INFO
          </Button>
          <Button
            size="large"
            color="gray"
            onClick={() => addToast('warning', '좋은 정보가 아닙니다.')}
          >
            WARNING
          </Button>
          <Button
            size="large"
            color="green"
            onClick={() => addToast('simple', '구독이 완료되었습니다.')}
          >
            SIMPLE
          </Button>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

export default Toasts;
