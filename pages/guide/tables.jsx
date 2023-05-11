import Card, { CardLayout } from '@components/ui/Card';
import TableItem from '@components/ui/TableItem';
import { tableData } from '@data/dummy';

const Tables = () => {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <a
              href="https://mui.com/material-ui/react-table/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontSize: '12px',
                color: 'blue',
                textDecoration: 'underline',
                marginTop: '5px',
              }}
            >
              Material UI 사용
            </a>
            <TableItem getTableData={tableData} />
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default Tables;
