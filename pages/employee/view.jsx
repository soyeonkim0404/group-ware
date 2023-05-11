import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import DataView from '@components/ui/DataView';
import Loading from '@components/ui/Loading';
import { MdAccountCircle } from 'react-icons/md';
import { getEmployeeDetails, updateVacation } from '@api';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import { useSelector } from 'react-redux';
import moment from 'moment';

const View = ({ data }) => {
  const router = useRouter();

  const { openedModal } = useModals();
  const auth = useSelector(({ auth }) => auth);

  const [pageReady, setPageReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setPageReady(true);
    }
  }, [router.isReady]);

  const onClickUpdateVacation = (e) => {
    openedModal(modals.VacationUpdate, {
      onSubmit: async (data) => {
        const params = {
          year: new Date().getFullYear(),
          comment: data.comment || '',
          data: [{ userId: router.query.id, count: data.count, type: data.type }],
        };

        const modalProps = {
          isSuccess: true,
          text: {
            body: '완료되었습니다',
          },
        };

        try {
          setLoading(true);
          await updateVacation(params);
        } catch (e) {
          setLoading(true);
        } finally {
          setLoading(false);
        }

        await new Promise((resolve) => {
          if (modalProps.isSuccess) modalProps.resolve = resolve;
          openedModal(modals.Alert, modalProps);
        });
      },
    });
  };

  const onClickSelectVacationHistory = (e) => {
    openedModal(modals.VacationHistory, {
      props: { joinDate: data.joinDate, user: data.id },
    });
  };

  return pageReady ? (
    <>
      <CardLayout>
        <Card col="4">
          <Card.Body>
            <SProfileWrap>
              <SProfileImg>
                {data.profileImage ? (
                  <Image
                    src={data.profileImage}
                    alt="profile-img"
                    width={200}
                    height={200}
                  />
                ) : (
                  <MdAccountCircle />
                )}
              </SProfileImg>
              <SProfileTxt>
                <h3 className="name">{data.name}</h3> {data.grade}
                <div className="position">{data.organization}</div>
              </SProfileTxt>
            </SProfileWrap>
          </Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>인사정보</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="이름">{data.name}</DataView.Item>
              <DataView.Item label="이메일">{data.email}</DataView.Item>
              {data.cardNum && (
                <DataView.Item label="출입카드 번호">{data.cardNum}</DataView.Item>
              )}
              {data.birthday && (
                <DataView.Item label="생일">
                  {`${
                    auth.data.filter(
                      (item) =>
                        item.menu === 'MN001' && item.auth.toUpperCase().includes('W')
                    ).length > 0
                      ? moment(data.birthday).format('yyyy년 M월 D일')
                      : moment(data.birthday).format('M월 D일')
                  } (${data.isSolar ? '양력' : '음력'})`}
                </DataView.Item>
              )}
              {data.mobilePhone && (
                <DataView.Item label="휴대폰 번호">{data.mobilePhone}</DataView.Item>
              )}
              {auth.data.filter(
                (item) => item.menu === 'MN001' && item.auth.toUpperCase().includes('W')
              ).length > 0 && <DataView.Item label="권한">{data.role}</DataView.Item>}
            </DataView>
          </Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>조직관리</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="재직 상태">{data.status}</DataView.Item>
              <DataView.Item label="입사일">{data.joinDate}</DataView.Item>
              <DataView.Item label="입사형태">{data.type}</DataView.Item>

              {data.typeCode === ('MB200003' || 'MB200004') && (
                <>
                  <DataView.Item label="계약 시작일">
                    {data.contractStartDate}
                  </DataView.Item>
                  <DataView.Item label="계약 종료일">
                    {data.contractEndDate}
                  </DataView.Item>
                </>
              )}
              <DataView.Item label="부서">{data.organization}</DataView.Item>
              <DataView.Item label="직책">{data.position}</DataView.Item>
              <DataView.Item label="직급">{data.grade}</DataView.Item>
            </DataView>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button
            color="gray"
            size="large"
            menuCode="MN001"
            auth="W"
            onClick={onClickSelectVacationHistory}
          >
            연차 사용 내역
          </Button>
          <Button
            color="blue"
            size="large"
            menuCode="MN001"
            auth="W"
            onClick={onClickUpdateVacation}
          >
            연차 발생/조정
          </Button>
          <Button
            color="blue"
            size="large"
            link={`/employee/edit?id=${data.id}`}
            menuCode="MN001"
            auth="W"
          >
            수정
          </Button>
        </Button.Group>
        <Button.Group>
          <Button color="primary" size="large" link={`/employee`}>
            목록
          </Button>
        </Button.Group>
      </Button.Wrap>
      {loading && <Loading />}
    </>
  ) : (
    <Loading />
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const data = await getEmployeeDetails(context.query, context);

  return {
    props: { data },
  };
});

const SProfileWrap = styled.div`
  padding: 20px;
  text-align: center;
`;

const SProfileImg = styled.div`
  overflow: hidden;
  width: 200px;
  max-height: 200px;
  margin: 0 auto 30px;
  border-radius: 50%;
  svg {
    width: 100%;
    height: 100%;
    color: ${(p) => p.theme.gray50};
  }
  .mobile & {
    width: 100px;
    height: 100px;
    margin: 0 auto 10px;
  }
`;

const SProfileTxt = styled.div`
  text-align: center;
  .name {
    display: inline-block;
    font-size: 24px;
  }
  .position {
    margin-top: 5px;
    font-size: 16px;
  }
`;

export default View;
