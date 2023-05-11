import List from '@components/ui/TextList';
import Card, { CardLayout } from '@components/ui/Card';

function TextLists() {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default: ul</Card.Title>
          </Card.Head>
          <Card.Body>
            <List>
              <List.Item>감자</List.Item>
              <List.Item color="red">고구마</List.Item>
              <List.Item color="gray">옥수수</List.Item>
            </List>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>ol</Card.Title>
          </Card.Head>
          <Card.Body>
            <List ordered>
              <List.Item>감자</List.Item>
              <List.Item color="red">고구마</List.Item>
              <List.Item color="gray">옥수수</List.Item>
            </List>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default TextLists;
