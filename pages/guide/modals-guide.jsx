import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import styled from 'styled-components';

const ModalsGuide = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { openedModal } = useModals();
  const modalHandler = () => {
    openedModal(modals.Modal, {
      text: {
        body: '수정하시겠습니까?',
      },
    });
  };
  const modalHandler2 = () => {
    openedModal(modals.Modal, {
      text: {
        header: '타이틀',
        body: '수정하시겠습니까?',
      },
    });
  };
  const modalHandler3 = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      text: {
        header: '타이틀',
        body: '수정하시겠습니까?',
      },
    });
  };
  const modalHandler4 = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      size: 'sm',
      text: {
        header: '타이틀',
        body: '짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거짧은거',
      },
    });
  };
  const modalHandler5 = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      size: 'lg',
      text: {
        header: '타이틀',
        body: '긴긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거거',
      },
    });
  };
  const modalHandlerDefault = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      text: {
        header: '타이틀',
        body: '디폴트 사이즈',
      },
    });
  };
  const modalHandler6 = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      size: 'lg',
      text: {
        header: '타이틀',
        body: '확인 버튼 클릭시 1초 비동기 작업 후 완료 모달 오픈',
      },
      onSubmit: async () => {
        let promise = new Promise((resolve) => {
          setTimeout(() => resolve('비동기처리 완료'), 1000);
        });

        await promise;
        await new Promise((resolve) => {
          openedModal(modals.Alert, {
            resolve: resolve, // 모달 컴포넌트 비동기 작업을 위해 resolve를 모달 컴포넌트 안으로 넘겨줍니다.
            text: {
              body: '비동기 작업 완료 확인 버튼 클릭시 배경 모달도 같이 닫힙니다.',
            },
          });
        });
      },
    });
  };
  const modalHandler7 = () => {
    openedModal(modals.Modal, {
      closeButton: true,
      size: 'lg',
      text: {
        header: 'BT',
        body: <Button onClick={() => alert('test')}>test</Button>,
      },
    });
  };
  const modalHandler8 = () => {
    openedModal(modals.Registration, {
      text: {
        header: 'BT',
      },
      onSubmit: () => {
        alert('등록완료');
      },
    });
  };
  const alertHandler = () => {
    openedModal(modals.Alert, {
      text: {
        body: '적용 되었습니다.',
      },
    });
  };

  return (
    <>
      <CardLayout>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(타이틀 없는거)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler}>열기</Button>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(타이틀 있는거)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler2}>열기</Button>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(타이틀하고 닫기 버튼 있는거)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler3}>열기</Button>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>사이즈 가이드</Card.Title>
          </Card.Head>
          <Card.Body>
            <SFlex>
              <div>
                <p>sm - width:300px</p>
                <Button onClick={modalHandler4}>열기</Button>
              </div>
              <div>
                <p>default(옵션 입력 x) - width:500px</p>
                <Button onClick={modalHandlerDefault}>열기</Button>
              </div>
              <div>
                <p>lg - width:800px</p>
                <Button onClick={modalHandler5}>열기</Button>
              </div>
            </SFlex>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(비동기 작업)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler6}>열기</Button>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(컴포넌트불러오기)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler7}>열기</Button>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>alert</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={alertHandler}>열기</Button>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="6">
          <Card.Head>
            <Card.Title>Modal(등록)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={modalHandler8}>열기</Button>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>alert</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button onClick={alertHandler}>열기</Button>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

const SFlex = styled.div`
  display: flex;
  gap: 20px;
  div {
    flex: 0 0 33.33%;
    width: 33.33%;
    p {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .mobile & {
    flex-direction: column;
    div {
      flex: none;
      width: 100%;
    }
  }
`;

export default ModalsGuide;
