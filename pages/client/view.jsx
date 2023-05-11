import Card, { CardLayout } from '@components/ui/Card';
import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import DataView from '@components/ui/DataView';
import { useRouter } from 'next/router';
import Accordion, { AccordionList } from '@components/ui/Accordion';
import { apiGetClientDetail } from '@api';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import Loading from '@components/ui/Loading';
import { MdFileDownload } from 'react-icons/md';
import styled from 'styled-components';

const View = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
    }
  }, [router.isReady]);

  const downloadLink = (link) => {
    if (!link) return '#';
    else if (!link.startsWith('/')) return `/${link}`;
    else return link;
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>거래처 정보</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <SFormList>
                <li>
                  <DataView.Item label="사업 유형">{data.businessTypeName}</DataView.Item>
                </li>
                <li>
                  <DataView.Item label="회사명(국)">{data.companyNameKr}</DataView.Item>
                </li>
                <li>
                  <DataView.Item label="회사명(영)">{data.companyNameEn}</DataView.Item>
                </li>
                <li>
                  <DataView.Item label="사업자번호">{data.businessNumber}</DataView.Item>
                </li>
                <li>
                  <DataView.Item label="대표번호">{data.phone}</DataView.Item>
                </li>
                <li>
                  <DataView.Item label="팩스">{data.fax}</DataView.Item>
                </li>
              </SFormList>
              <SFormList>
                <li className="width-half">
                  <DataView.Item label="대표자명">{data.ceoName}</DataView.Item>
                </li>
                <li className="width-half">
                  <DataView.Item label="주요 업무">{data.mainBusiness}</DataView.Item>
                </li>
              </SFormList>
              <SFormList>
                <li className="width-half">
                  <DataView.Item label="주소">{data.address}</DataView.Item>
                </li>
                <li className="width-half">
                  <DataView.Item label="상세 주소">{data.detailAddress}</DataView.Item>
                </li>
              </SFormList>
              {data.files?.length > 0 && (
                <SFile>
                  <span className="title">첨부파일</span>
                  <div className="list">
                    {data.files.map((attachment) => (
                      <React.Fragment key={attachment.id}>
                        <a
                          href={downloadLink(attachment.path)}
                          download={attachment.originalFilename}
                        >
                          {attachment.originalFilename}
                          <MdFileDownload />
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                </SFile>
              )}
            </DataView>
          </Card.Body>
        </Card>

        {/*은행 영역*/}
        <Card col="6">
          <Card.Head>
            <Card.Title>은행</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              {data.bank?.length > 0 ? (
                <SList>
                  {data.bank.map((bank) => (
                    <li key={bank.id} className="item">
                      <div className="options">
                        <li className="body">
                          <DataView.Item label="금융기관">{bank.bankName}</DataView.Item>
                        </li>
                        <li className="body">
                          <DataView.Item label="계좌번호">{bank.account}</DataView.Item>
                        </li>
                        <li className="body">
                          <DataView.Item label="예금주">{bank.name}</DataView.Item>
                        </li>
                      </div>
                    </li>
                  ))}
                </SList>
              ) : (
                <DataView>데이터가 없습니다.</DataView>
              )}
            </DataView>
          </Card.Body>
        </Card>

        {/*스태프 영역*/}
        <Card col="6">
          <Card.Head>
            <Card.Title>담당자</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              {data.staff?.length > 0 ? (
                <SList>
                  {data.staff.map((staff) => (
                    <li key={staff.id} className="item">
                      <div className="options">
                        <li className="body">
                          <DataView.Item label="이름">{staff.name}</DataView.Item>
                        </li>
                        <li className="body">
                          <DataView.Item label="이메일">{staff.email}</DataView.Item>
                        </li>
                      </div>
                      <div className="options">
                        <li className="body">
                          <DataView.Item label="휴대폰">
                            {staff.mobilePhone}
                          </DataView.Item>
                        </li>
                        <li className="body">
                          <DataView.Item label="내선번호">
                            {staff.innerPhone}
                          </DataView.Item>
                        </li>
                        <li className="body">
                          <DataView.Item label="팩스">{staff.fax}</DataView.Item>
                        </li>
                      </div>
                    </li>
                  ))}
                </SList>
              ) : (
                <DataView>데이터가 없습니다.</DataView>
              )}
            </DataView>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button color="gray" size="large" link={'/client'}>
            목록
          </Button>
          <Button
            color="blue"
            size="large"
            link={`/client/edit?id=${data.id}`}
            menuCode="MN009"
            auth="X"
            userId={data.createUserId}
          >
            수정
          </Button>
        </Button.Group>
      </Button.Wrap>
      {loading && <Loading />}
    </>
  );
};

const SList = styled.ul`
  li {
    .options {
      display: flex;
      width: 100%;
      align-items: center;
      .body {
        display: inline-flex;
        flex-direction: column;
        width: 100%;
      }
      button {
        flex: 0 0 40px;
        width: 40px;
        margin-left: 20px;
        margin-top: -20px;
        background: ${(p) => p.theme.gray50};
      }
      .mobile & {
        label + label {
        }
        .select + label {
          margin-left: 20px;
        }
      }
    }
  }

  .item + .item {
    margin-top: 20px;
    border-top: 1px solid rgb(222, 226, 230);
    padding-top: 20px;
  }

  .options + .options {
    margin-top: 10px;
    border-top: 1px dotted rgb(222, 226, 230);
    padding-top: 10px;
  }
`;

const SFormList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  li {
    flex: 0 1 32%;
    width: 100%;
    margin-top: 5px;
    .select {
      width: 100%;
    }
    &.width-half {
      flex: 0 1 49%;
      width: 49%;
    }
  }
  li.delete-btn {
    button {
      width: 100%;
      height: 50px;
    }
  }
  @media screen and (max-width: 1460px) {
    gap: 0;
    li {
      flex: 0 0 100% !important;
      width: 100% !important;
      margin-top: 0;
    }
  }

  & + & {
    margin-top: 10px;
    border-top: 1px dotted rgb(222, 226, 230);
    padding-top: 10px;
  }
`;

const SFile = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${(p) => p.theme.gray70};
  padding: 30px 0;
  .title {
    flex: 0 0 150px;
    width: 150px;
    font-size: 16px;
    font-weight: bold;
  }
  .list {
    flex: 1 1 auto;
    a {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: ${(p) => p.theme.gray30};
      margin-right: 30px;

      svg {
        font-size: 14px;
        color: ${(p) => p.theme.gray30};
        margin-top: 5px;
        margin-left: 5px;
      }
    }
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const data = await apiGetClientDetail(context.query, context);
  return {
    props: { data },
  };
});

export default View;
