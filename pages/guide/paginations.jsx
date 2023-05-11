import Pagination from '@components/ui/Pagination';
// import TableItem from '../../components/TableItem';
import Card, { CardLayout } from '@components/ui/Card';
// import { listData } from '../../data/dummy';

function Paginations() {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <Pagination size={10}></Pagination>
            {/*<TableItem getTableData={listData} />*/}
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default Paginations;
