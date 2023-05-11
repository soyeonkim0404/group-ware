import Tooltip from '@components/ui/Tooltip';
import Card, { CardLayout } from '@components/ui/Card';

function Tooltips() {
  return (
    <>
      <CardLayout>
        <Card col="4">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <Tooltip>
              <Tooltip.Icon></Tooltip.Icon>
              <Tooltip.Text>배송</Tooltip.Text>
              <Tooltip.Content>
                배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
                소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
              </Tooltip.Content>
            </Tooltip>
            <br />
            <Tooltip color={'gray'}>
              <Tooltip.Icon></Tooltip.Icon>
              <Tooltip.Text>배송</Tooltip.Text>
              <Tooltip.Content>
                배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
                소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
              </Tooltip.Content>
            </Tooltip>
            <br />
            <Tooltip color={'red'}>
              <Tooltip.Icon></Tooltip.Icon>
              <Tooltip.Text>배송</Tooltip.Text>
              <Tooltip.Content>
                배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
                소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
              </Tooltip.Content>
            </Tooltip>
          </Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>Icon Only</Card.Title>
          </Card.Head>
          <Card.Body>
            <Tooltip>
              <Tooltip.Icon></Tooltip.Icon>
              <Tooltip.Content>
                배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
                소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
              </Tooltip.Content>
            </Tooltip>
          </Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>문장 내 삽입</Card.Title>
          </Card.Head>
          <Card.Body>
            <div>
              도서·산간 지역은
              <Tooltip color={'red'}>
                <Tooltip.Text> 배송</Tooltip.Text>
                <Tooltip.Icon></Tooltip.Icon>
                <Tooltip.Content>
                  배송기간은 주문일(무통장입금은 결제완료일)로부터 평균 2일 ~ 3일정도
                  소요되며, 예약 배송 상품의 경우는 예약 배송일 기준으로 적용됩니다.
                </Tooltip.Content>
              </Tooltip>
              기일이 추가적으로 소요 될 수 있으며, 상품의 재고상황에 따라 배송기일이 다소
              지연될 수도 있사오니 이 점 양해하여 주시기 바랍니다. (S.I.VILLAGE는
              도서/산간 지역 배송 시 추가 배송비가 없으나, 입점 상품의 경우 별도의
              배송비가 추가 될 수 있습니다.)
            </div>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default Tooltips;
