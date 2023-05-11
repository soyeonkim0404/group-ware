import PopOverUtil from '@components/ui/PopOverUtil';
import Card, { CardLayout } from '@components/ui/Card';
import { MdDeleteOutline, MdOutlineModeEdit, MdSupervisorAccount } from 'react-icons/md';

function PopOverUtils() {
  return (
    <>
      <CardLayout>
        <Card col="3">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <div style={{ textAlign: 'right' }}>
              <PopOverUtil>
                <PopOverUtil.Content>
                  <PopOverUtil.Btn>
                    <MdSupervisorAccount />
                    <span>본부 등록</span>
                  </PopOverUtil.Btn>
                  <PopOverUtil.Btn>
                    <MdOutlineModeEdit />
                    <span>수정</span>
                  </PopOverUtil.Btn>
                  <PopOverUtil.Btn>
                    <MdDeleteOutline />
                    <span>삭제</span>
                  </PopOverUtil.Btn>
                </PopOverUtil.Content>
              </PopOverUtil>
            </div>
          </Card.Body>
        </Card>
        <Card col="3">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <div style={{ textAlign: 'right' }}>
              <PopOverUtil>
                <PopOverUtil.Content>
                  <PopOverUtil.Btn>
                    <MdOutlineModeEdit />
                    <span>수정</span>
                  </PopOverUtil.Btn>
                  <PopOverUtil.Btn>
                    <MdDeleteOutline />
                    <span>삭제</span>
                  </PopOverUtil.Btn>
                </PopOverUtil.Content>
              </PopOverUtil>
            </div>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default PopOverUtils;
