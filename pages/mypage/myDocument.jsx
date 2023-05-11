import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import { apiGetMyApproval } from '@api';
import TableItem from '@components/ui/TableItem';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import numberUnit from '@lib/common/common';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';

const MyDocument = () => {
  const { openedModal } = useModals();
  const [myData, setMyData] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [stCodeReturn, setStCodeReturn] = useState([]); // 결재 반송
  const [stCodeWaite, setStCodeWaite] = useState([]); // 결재 진행, 확인 대기
  const [stCodeComplete, setStCodeComplete] = useState([]); // 결재완료
  useEffect(() => {
    getMyApproval();
  }, []);
  const getMyApproval = () => {
    apiGetMyApproval()
      .then((res) => {
        setStCodeReturn(res.filter((v) => v.approvalStatusCode === 'AP100004'));
        setStCodeWaite(
          res.filter(
            (v) =>
              v.approvalStatusCode === 'AP100001' || v.approvalStatusCode === 'AP100005'
          )
        );
        setStCodeComplete(res.filter((v) => v.approvalStatusCode === 'AP100006'));
        setMyData(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClickApprovalDetail = (item) => {
    openedModal(modals.ApprovalDetail, {
      props: { id: item.id, code: item.approvalTypeCode, passable: false },
    });
  };

  return (
    <CardLayout>
      <Card col="12">
        <Card.Body>
          <STab>
            <ul>
              <li className="item">
                <Link href={'/mypage'}>
                  <a>캘린더</a>
                </Link>
              </li>
              <li className="item active">
                <Link href={'/mypage/myDocument'}>
                  <a>결재내역</a>
                </Link>
              </li>
              <li className="item">
                <Link href={'/mypage/myProfile'}>
                  <a>개인정보수정</a>
                </Link>
              </li>
            </ul>
          </STab>
          <SBtnContents>
            <div
              className={currentTab === 0 ? 'item active' : 'item'}
              onClick={() => {
                setCurrentTab(0);
              }}
            >
              <div className={'img'}>
                <Image
                  src={`/static/img/ic-doc-apply.svg`}
                  alt="icon"
                  width={30}
                  height={30}
                  className={'icon'}
                />
              </div>
              <div className="number" style={{ color: '#1976d2' }}>
                {myData.length > 0 ? myData.length : 0}
              </div>
              <h4 className="title">결재 신청</h4>
            </div>
            <div
              className={currentTab === 1 ? 'item active' : 'item'}
              onClick={() => {
                setCurrentTab(1);
              }}
            >
              <div className={'img'}>
                <Image
                  src={'/static/img/ic-doc-com.svg'}
                  alt="icon"
                  width={30}
                  height={30}
                  className={'icon'}
                />
              </div>
              <div className="number" style={{ color: '#1976d2' }}>
                {stCodeComplete.length > 0 ? stCodeComplete.length : 0}
              </div>
              <h4 className="title">결재 완료</h4>
            </div>
            <div
              className={currentTab === 2 ? 'item active' : 'item'}
              onClick={() => {
                setCurrentTab(2);
              }}
            >
              <div className={'img'}>
                <Image
                  src={'/static/img/ic-doc-return.svg'}
                  alt="icon"
                  width={30}
                  height={30}
                  className={'icon'}
                />
              </div>
              <div className="number" style={{ color: '#f03e3e' }}>
                {stCodeReturn.length > 0 ? stCodeReturn.length : 0}
              </div>
              <h4 className="title">결재 반송</h4>
            </div>
            <div
              className={currentTab === 3 ? 'item active' : 'item'}
              onClick={() => {
                setCurrentTab(3);
              }}
            >
              <div className={'img'}>
                <Image
                  src={'/static/img/ic-doc-wait.svg'}
                  alt="icon"
                  width={30}
                  height={30}
                  className={'icon'}
                />
              </div>
              <div className="number" style={{ color: '#495057' }}>
                {stCodeWaite.length > 0 ? stCodeWaite.length : 0}
              </div>
              <h4 className="title">결재 대기</h4>
            </div>
          </SBtnContents>
          <SMyApprovalList>
            <div className={currentTab === 0 ? 'tab-con show' : 'tab-con'}>
              <TableItem>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">no.</TableCell>
                    <TableCell align="center">결재 종류</TableCell>
                    <TableCell align="center">결재 상세 종류</TableCell>
                    <TableCell align="center">결재 내용</TableCell>
                    <TableCell align="center">결재 상태</TableCell>
                    <TableCell align="center">신청일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myData.length > 0 ? (
                    myData.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                        style={{ position: 'relative' }}
                      >
                        <TableCell align="center">{item.id}</TableCell>
                        <TableCell align="center">{item.approvalType}</TableCell>
                        <TableCell align="center">{item.approvalDetailType}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#1976d2',
                          }}
                          onClick={() => onClickApprovalDetail(item)}
                        >
                          {item.approvalTypeCode === 'AP200002'
                            ? numberUnit(item.contents)
                            : item.contents}
                        </TableCell>
                        <TableCell align="center">{item.approvalStatus}</TableCell>
                        <TableCell align="center">
                          {moment(item.requestDatetime).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableItem>
            </div>
            <div className={currentTab === 1 ? 'tab-con show' : 'tab-con'}>
              <TableItem>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">no.</TableCell>
                    <TableCell align="center">결재 종류</TableCell>
                    <TableCell align="center">결재 상세 종류</TableCell>
                    <TableCell align="center">결재 내용</TableCell>
                    <TableCell align="center">결재 상태</TableCell>
                    <TableCell align="center">신청일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stCodeComplete.length > 0 ? (
                    stCodeComplete.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                        style={{ position: 'relative' }}
                      >
                        <TableCell align="center">{item.id}</TableCell>
                        <TableCell align="center">{item.approvalType}</TableCell>
                        <TableCell align="center">{item.approvalDetailType}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#1976d2',
                          }}
                        >
                          {item.approvalTypeCode === 'AP200002'
                            ? numberUnit(item.contents)
                            : item.contents}
                        </TableCell>
                        <TableCell align="center">{item.approvalStatus}</TableCell>
                        <TableCell align="center">
                          {moment(item.requestDatetime).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableItem>
            </div>
            <div className={currentTab === 2 ? 'tab-con show' : 'tab-con'}>
              <TableItem>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">no.</TableCell>
                    <TableCell align="center">결재 종류</TableCell>
                    <TableCell align="center">결재 상세 종류</TableCell>
                    <TableCell align="center">결재 내용</TableCell>
                    <TableCell align="center">결재 상태</TableCell>
                    <TableCell align="center">신청일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stCodeReturn.length > 0 ? (
                    stCodeReturn.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                        style={{ position: 'relative' }}
                      >
                        <TableCell align="center">{item.id}</TableCell>
                        <TableCell align="center">{item.approvalType}</TableCell>
                        <TableCell align="center">{item.approvalDetailType}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#1976d2',
                          }}
                        >
                          {item.approvalTypeCode === 'AP200002'
                            ? numberUnit(item.contents)
                            : item.contents}
                        </TableCell>
                        <TableCell align="center">{item.approvalStatus}</TableCell>
                        <TableCell align="center">
                          {moment(item.requestDatetime).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableItem>
            </div>
            <div className={currentTab === 3 ? 'tab-con show' : 'tab-con'}>
              <TableItem>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">no.</TableCell>
                    <TableCell align="center">결재 종류</TableCell>
                    <TableCell align="center">결재 상세 종류</TableCell>
                    <TableCell align="center">결재 내용</TableCell>
                    <TableCell align="center">결재 상태</TableCell>
                    <TableCell align="center">신청일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stCodeWaite.length > 0 ? (
                    stCodeWaite.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                        style={{ position: 'relative' }}
                      >
                        <TableCell align="center">{item.id}</TableCell>
                        <TableCell align="center">{item.approvalType}</TableCell>
                        <TableCell align="center">{item.approvalDetailType}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#1976d2',
                          }}
                        >
                          {item.approvalTypeCode === 'AP200002'
                            ? numberUnit(item.contents)
                            : item.contents}
                        </TableCell>
                        <TableCell align="center">{item.approvalStatus}</TableCell>
                        <TableCell align="center">
                          {moment(item.requestDatetime).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableItem>
            </div>
          </SMyApprovalList>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

const STab = styled.div`
  ul {
    display: flex;
    border-bottom: 1px solid ${(p) => p.theme.gray60};
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      padding: 20px;
      transition: all 0.5s ease;
      cursor: pointer;
      &.active {
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 2px;
          left: 0;
          bottom: 0;
          background-color: ${(p) => p.theme.blue};
        }
      }
    }
  }
`;

const SMyApprovalList = styled.div`
  margin-top: 30px;
  .tab-con {
    display: none;
    &.show {
      display: block;
    }
  }
`;

const SBtnContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4%;
  box-sizing: border-box;
  margin-top: 30px;
  .item {
    display: flex;
    align-items: center;
    flex: 0 0 22%;
    width: 22%;
    padding: 20px;
    border-radius: 20px;
    box-shadow: ${(p) => p.theme.boxShadow};
    border: 1px solid ${(p) => p.theme.gray80};
    box-sizing: border-box;
    cursor: pointer;
    .img {
      flex: 0 0 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border: 1px solid ${(p) => p.theme.gray80};
      background: ${(p) => p.theme.white};
      box-shadow: ${(p) => p.theme.boxShadow};
      border-radius: 100%;
      img {
        margin-left: 3px !important;
        object-fit: contain;
      }
    }
    .number {
      flex: auto;
      margin: 5px 0 0 15px;
      font-size: 35px;
      font-weight: bold;
      font-family: 'Noto Sans KR', sans-serif !important;
    }
    .title {
      font-size: 16px;
      font-weight: 400;
    }
    &.active {
      border: 2px solid ${(p) => p.theme.blue};
    }
  }
  .mobile & {
    flex-direction: column;
    .item {
      flex: 0 0 100%;
      width: 100%;
      padding: 10px 20px 10px 15px;
      & + .item {
        margin-top: 3%;
      }
    }
  }
`;

export default MyDocument;
