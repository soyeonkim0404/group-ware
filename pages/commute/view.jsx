import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import DataView from '@components/ui/DataView';
import { apiGetCommuteView } from '@api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '@components/ui/Loading';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import moment from 'moment/moment';

const View = ({ data }) => {
  const router = useRouter();
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setPageReady(true);
    }
  }, [router.isReady]);

  return pageReady ? (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>출퇴근 상세</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="이름">{data?.userName}</DataView.Item>
              <DataView.Item label="부서">{data?.part}</DataView.Item>
              {/* 출근 */}
              <DataView.Item label="출근 일시">
                {data.onDatetime && moment(data.onDatetime).format('YYYY-MM-DD HH:mm:ss')}
              </DataView.Item>
              <DataView.Item label="출근 장소">{data?.onAddress}</DataView.Item>
              {/*<DataView.Item label="생성 일시">{data?.createDatetime}</DataView.Item>
              <DataView.Item label="생성자">{data?.createUserName}</DataView.Item>*/}
              {/* 퇴근 */}
              <DataView.Item label="퇴근 일시">
                {data.offDatetime &&
                  moment(data.offDatetime).format('YYYY-MM-DD HH:mm:ss')}
              </DataView.Item>
              <DataView.Item label="퇴근 장소">{data?.offAddress}</DataView.Item>
              <DataView.Item label="실제 퇴근 일시">
                {data.realOffDatetime &&
                  moment(data.realOffDatetime).format('YYYY-MM-DD HH:mm:ss')}
              </DataView.Item>
              {/* 수정정보 */}
              <DataView.Item label="수정자">{data?.updateUserName}</DataView.Item>
              <DataView.Item label="수정 일시">
                {data.updateDatetime &&
                  moment(data.updateDatetime).format('YYYY-MM-DD HH:mm:ss')}
              </DataView.Item>
            </DataView>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button color="gray" size="large" link={'/commute'}>
            목록
          </Button>
          <Button
            type="submit"
            color="blue"
            link={'/commute/edit?id=' + router.query.id}
            size="large"
            menuCode="MN004"
            auth="W"
          >
            수정
          </Button>
        </Button.Group>
      </Button.Wrap>
    </>
  ) : (
    <Loading />
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const resp = await apiGetCommuteView(context.query, context);

  return {
    props: { data: resp.data },
  };
});

export default View;
