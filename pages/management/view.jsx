import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import { apiProjectAvailableSelect, getProjectDetails, getProjectOptions } from '@api';
import Loading from '@components/ui/Loading';
import styled from 'styled-components';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import DataView from '@components/ui/DataView';
import Input from '@components/ui/Input';
import { useSelector } from 'react-redux';
import { authCheck } from '../../util/authCheck';
import numberUnit from '@lib/common/common';

const View = ({ optionDatas, prevData }) => {
  const router = useRouter();

  const store = useSelector((store) => store);

  const [members, setMembers] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    let optionChildList = [];
    optionDatas.role.forEach(
      (role) =>
        (optionChildList = [
          ...optionChildList,
          ...role.child.map((c) => ({ code: c.code, value: c.value, parent: role.code })),
        ])
    );

    setMembers(
      prevData.members?.map((member, index) => {
        const roleParentCode =
          optionChildList.filter((o) => o.code === member.memberRoleCode)?.[0]?.parent ||
          '';

        const projectRole = optionDatas.role.filter(
          (role) => role.code === roleParentCode
        )?.[0];

        const roleList = projectRole?.child || [];
        const projectRoleOne = projectRole?.value || '';
        const projectRoleOneCode = projectRole?.code || '';

        return {
          id: index,
          roleList: roleList,
          memberId: member.memberId,
          memberName: member.memberName,
          memberRole: member.memberRole,
          memberRoleCode: member.memberRoleCode,
          projectRoleOne: projectRoleOne,
          projectRoleOneCode: projectRoleOneCode,
          memberGrade: member.memberGrade,
          memberGradeCode: member.memberGradeCode,
          expectManMonth: member.expectManMonth,
          isDelete: member.isDelete,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setPageReady(true);
    }
  }, [router.isReady]);

  return pageReady ? (
    <>
      <CardLayout>
        <Card col="4">
          <Card.Head>
            <Card.Title>프로젝트</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="프로젝트명">{prevData.projectName}</DataView.Item>
              <DataView.Item label="프로젝트 타입">{prevData.projectType}</DataView.Item>
              <DataView.Item label="프로젝트 시작일">{prevData.beginDate}</DataView.Item>
              <DataView.Item label="프로젝트 종료일">{prevData.endDate}</DataView.Item>
              <DataView.Item label="클라이언트">{prevData.client}</DataView.Item>
              {prevData.partners.length > 0 && (
                <SPartner>
                  {prevData.partners.map((partner, index) => (
                    <DataView.Item key={partner.partnerId} label={`협력사 ${index + 1}`}>
                      {partner.partnerName}
                    </DataView.Item>
                  ))}
                </SPartner>
              )}
              {authCheck(store, 'MN003', 'W', [
                prevData.createUserid,
                ...prevData.members
                  .filter(
                    (o) =>
                      o.memberRoleCode === 'PJ200001001' ||
                      o.memberRoleCode === 'PJ200002001' ||
                      o.memberRoleCode === 'PJ200003001' ||
                      o.memberRoleCode === 'PJ200004001' ||
                      o.memberRoleCode === 'PJ200005001'
                  )
                  .map((o) => o.memberId),
              ]) && (
                <DataView.Item label="수주금액">
                  {numberUnit(prevData.amount)}
                </DataView.Item>
              )}
              <DataView.Item label="추가 설명">{prevData.description}</DataView.Item>
            </DataView>
          </Card.Body>
        </Card>
        <Card col="8">
          <Card.Head>
            <Card.Title>프로젝트 구성</Card.Title>
          </Card.Head>
          <Card.Body>
            <SProject>
              <ul className="list">
                {members
                  ?.filter((member) => !member.isDelete)
                  .map((member, index) => {
                    return (
                      <li key={index} className="item">
                        <div className="options">
                          <Input
                            label="구성원"
                            value={member.memberName}
                            name="memberName"
                            disabled={true}
                          />
                          <Input
                            type="number"
                            label="예상 M/M"
                            value={member.expectManMonth}
                            name="expectManMonth"
                            disabled={true}
                          />
                          <Input
                            label="등급"
                            value={member.memberGrade}
                            name="memberGrade"
                            disabled={true}
                          />
                          <Input
                            label="부분"
                            value={member.projectRoleOne || ''}
                            name="projectRoleOne"
                            disabled={true}
                          />
                          <Input
                            label="역할"
                            value={member.memberRole}
                            name="memberRole"
                            disabled={true}
                          />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </SProject>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button color="gray" size="large" link={'/management'}>
            목록
          </Button>
          <Button
            color="blue"
            size="large"
            link={`/management/edit?id=${prevData.id}`}
            userId={[
              prevData.createUserId,
              ...prevData.members
                .filter(
                  (o) =>
                    o.memberRoleCode === 'PJ200001001' ||
                    o.memberRoleCode === 'PJ200002001' ||
                    o.memberRoleCode === 'PJ200003001' ||
                    o.memberRoleCode === 'PJ200004001' ||
                    o.memberRoleCode === 'PJ200005001'
                )
                .map((o) => o.memberId),
            ]}
            menuCode={'MN003'}
            auth={'X'}
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

const SProject = styled.div`
  overflow: hidden;
  overflow-x: scroll;
  .top {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }
  .list {
    width: 945px;
    .item {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid ${(p) => p.theme.gray70};
      padding: 20px 20px 0 20px;
      margin-top: 20px;
      background: ${(p) => p.theme.gray90};
      box-sizing: border-box;
      .options {
        display: flex;
        width: 100%;
        align-items: center;
        .select {
          width: 20%;
          min-width: auto;
        }
        .input {
          width: 20%;
          margin-right: 20px;
        }
        button:not(.form-delete) {
          flex: 0 0 40px;
          width: 40px;
          margin-left: 20px;
          margin-top: -20px;
          background: ${(p) => p.theme.gray50};
          z-index: 10;
        }
      }
      & + .item {
        margin-top: 0;
      }
      &.disable {
        position: relative;
        cursor: default;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.4);
          z-index: 9;
        }
      }
    }
  }
`;

const SPartner = styled.div`
  margin-top: 15px;
  padding-left: 15px;
  border-left: 2px solid #d0d9e3;
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  await apiProjectAvailableSelect(context.query, context);

  const optionDatas = await getProjectOptions(context);
  const prevData = await getProjectDetails(context.query, context);
  optionDatas.client = optionDatas.client.sort((a, b) =>
    a.companyNameKr > b.companyNameKr ? 1 : -1
  );
  return {
    props: { optionDatas, prevData },
  };
});

export default View;
