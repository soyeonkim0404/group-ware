import { tabData } from '@data/dummy';
import Card, { CardLayout } from '@components/ui/Card';
import Tab from '@components/ui/Tab';
const Tabs = () => {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <Tab getData={tabData}></Tab>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="4">
          <Card.Body>
            <Tab getData={tabData}></Tab>
          </Card.Body>
        </Card>
        <Card col="8">
          <Card.Body>
            <Tab getData={tabData}></Tab>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default Tabs;
