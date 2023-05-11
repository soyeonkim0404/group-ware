import Card, { CardLayout } from '@components/ui/Card';
import DataView from '@components/ui/DataView';
import { employeeData } from '@data/dummy';

function DataViews() {
  const seq = 3;
  const employeeViewData = employeeData.columns[seq];
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="이름">{employeeViewData.name.value}</DataView.Item>
              <DataView.Item label="사원번호">{employeeViewData.id.value}</DataView.Item>
              <DataView.Item label="직급">
                {employeeViewData.position.value}
              </DataView.Item>
              <DataView.Item label="직책">{employeeViewData.duty.value}</DataView.Item>
              <DataView.Item label="부서">
                {employeeViewData.department.value}
              </DataView.Item>
              <DataView.Item label="팀">{employeeViewData.team.value}</DataView.Item>
            </DataView>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default DataViews;
