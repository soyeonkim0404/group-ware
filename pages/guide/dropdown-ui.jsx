import Card, { CardLayout } from '@components/ui/Card';
import Dropdown from '@components/ui/Dropdown';
import { dropdownMenu } from '@data/dummy';

const DropdownUi = () => {
  return (
    <CardLayout>
      <Card col="12">
        <Card.Head>
          <Card.Title>Default</Card.Title>
        </Card.Head>
        <Card.Body>
          <Dropdown menuData={dropdownMenu} title="등록" />
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

export default DropdownUi;
