import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import Button from '@components/ui/Button';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import {
  apiAppendApprovalLine,
  apiApprovalConfirm,
  apiApprovalRewrite,
  apiApprovalUpdate,
  getApprovalDetails,
} from '@api';
import ModalComponents, { modals } from '@components/ui/modals';
import Input from '@components/ui/Input';
import moment from 'moment';
import Loading from '@components/ui/Loading';
import { MdFileDownload } from 'react-icons/md';
import styled from 'styled-components';
import DataView from '@components/ui/DataView';
import numberUnit from '@lib/common/common';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import useModals from '@lib/hooks/useModals';
import TextArea from '@components/ui/TextArea';
import Tooltip from '@components/ui/Tooltip';

const ToastViewer = dynamic(() => import('@components/ui/ToastViewer'), {
  ssr: false,
});

const ApprovalDetail = ({ onClose, onSubmit, props }) => {
  const methods = useForm();
  const { openedModal } = useModals();

  const [loading, setLoading] = useState(true);
  const [detail, setDetails] = useState({});
  const [disabledConfirm, setDisabledConfirm] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    getApprovalDetails(props)
      .then((result) => {
        setDetails(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onClickReturn = async (data) => {
    const cloneData = _.cloneDeep(data);

    cloneData.approvalId = props.id;
    cloneData.approvalCode = 'AP100004';
    cloneData.comment = comment;

    await submit(cloneData);
  };

  const onClickRecover = async (data) => {
    const cloneData = _.cloneDeep(data);

    cloneData.approvalId = props.id;
    cloneData.approvalCode = 'AP100007';
    cloneData.comment = comment;

    await submit(cloneData);
  };

  const onClickApproval = async (data) => {
    const cloneData = _.cloneDeep(data);

    cloneData.approvalId = props.id;
    cloneData.approvalCode = 'AP100002';
    cloneData.comment = comment;

    await submit(cloneData);
  };

  const onClickConfirm = async () => {
    setLoading(true);

    apiApprovalConfirm({ approvalIds: [props.id] })
      .then((result) => {
        onSubmit('완료되었습니다.');
        onClose();
      })
      .catch((err) => {
        onSubmit(err.data.message || '관리자한테 문의하세요.');
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClickRewrite = async () => {
    setLoading(true);

    apiApprovalRewrite({ approvalIds: [props.id] })
      .then((result) => {
        onSubmit('완료되었습니다.');
        onClose();
      })
      .catch((err) => {
        onSubmit(err.data.message || '관리자한테 문의하세요.');
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClickAddApproval = async () => {
    setDisabledConfirm(true);
    const userId = detail.processList?.map((data) => data.approvalUser);

    openedModal(modals.ApprovalAdd, {
      title: '결재선 추가',
      already: userId,
      onSubmit: (users) => {
        const params = {
          approvalId: props.id,
          approvalUsers: users,
        };
        apiAppendApprovalLine(params)
          .then((result) => {
            onSubmit('완료되었습니다.');
            onClose();
          })
          .catch((err) => {
            onSubmit(err.data.message || '관리자한테 문의하세요.');
            onClose();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const submit = async (data) => {
    setLoading(true);

    apiApprovalUpdate(data)
      .then((result) => {
        onSubmit('완료되었습니다.');
        onClose();
      })
      .catch((err) => {
        onSubmit(err.data.message || '관리자한테 문의하세요.');
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const downloadLink = (link) => {
    if (!link) return '#';
    else if (!link.startsWith('/')) return `/${link}`;
    else return link;
  };

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap lg`}>
        <ModalComponents.Header closeButton={onClose}>
          {`결재 상세 ${
            detail?.details?.subTitle ? '[' + detail.details.subTitle + ']' : ''
          }`}
        </ModalComponents.Header>
        <div className="inner">
          <ModalComponents.Body align="center">
            <SApprovalList>
              {!loading ? (
                <>
                  {props.code === 'AP200001' && (
                    <SFormView>
                      <DataView>
                        <DataView.Item label="분류">
                          {detail.details?.vacationType}
                        </DataView.Item>
                        <DataView.Item label="종류">
                          {detail.details?.vacationDetailType}
                        </DataView.Item>
                        <DataView.Item label="시작일">
                          {moment(detail.details?.startDate).format('YYYY-MM-DD')}
                        </DataView.Item>
                        <DataView.Item label="종료일">
                          {moment(detail.details?.endDate).format('YYYY-MM-DD')}
                        </DataView.Item>
                        <DataView.Item label="사용 일수">
                          {detail.details?.use}
                        </DataView.Item>
                      </DataView>
                      {detail.attachmentList.length > 0 && (
                        <SFile>
                          <div className="list">
                            <div className="title">첨부파일</div>
                            {detail.attachmentList?.map((attachment) => (
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
                    </SFormView>
                  )}
                  {props.code === 'AP200002' && (
                    <SFormView>
                      {detail.details?.map((detail, index) => (
                        <DataView key={index}>
                          <DataView.Item label="본부">
                            {detail.organization}
                          </DataView.Item>
                          <DataView.Item label="이름">{detail.name}</DataView.Item>
                          <DataView.Item label="프로젝트">
                            {detail.projectName || '공통'}
                          </DataView.Item>
                          <DataView.Item label="금액">
                            {numberUnit(detail.price)}
                          </DataView.Item>
                          <DataView.Item label="근무시간">
                            {detail.workDateTime}
                          </DataView.Item>
                        </DataView>
                      ))}
                      <DataView>
                        <div className={'detail'}>
                          <DataView.Item label="사유">{detail?.comment}</DataView.Item>
                        </div>
                      </DataView>
                      <STotal>
                        <div className="item">
                          <span className="title">결제 날짜 : </span>
                          <span className="info">
                            {moment(detail.details?.[0]?.workDate).format(
                              'YYYY년 MM월 DD일'
                            )}
                          </span>
                        </div>
                        <div className="item">
                          <span className="title">총 금액 : </span>
                          <span className="info">
                            {numberUnit(
                              detail.details
                                ?.map((detail) => detail.price || 0)
                                .reduce((a, b) => a + b, 0)
                            )}{' '}
                            원
                          </span>
                        </div>
                      </STotal>

                      {detail.attachmentList.length > 0 && (
                        <SFile>
                          <div className="list">
                            <div className="title">첨부파일</div>
                            {detail.attachmentList?.map((attachment) => (
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
                    </SFormView>
                  )}
                  {props.code === 'AP200003' && (
                    <SFormView>
                      <DataView>
                        <DataView.Item label="고객사">
                          {detail.details?.client}
                        </DataView.Item>
                        <DataView.Item label="은행">{detail.details?.bank}</DataView.Item>
                        <DataView.Item label="계좌번호">
                          {detail.details?.account}
                        </DataView.Item>
                        <DataView.Item label="예금주">
                          {detail.details?.owner}
                        </DataView.Item>
                        <DataView.Item label="금액">
                          {`${numberUnit(detail.details.price)}원`}
                        </DataView.Item>
                      </DataView>
                      <DataView>
                        <div className={'detail'}>
                          <DataView.Item label="상세내역">
                            {detail.details?.detail}
                          </DataView.Item>
                        </div>
                      </DataView>

                      <STotal>
                        <div className="item">
                          <span className="title">결제 방법 : </span>
                          <span className="info">{detail.details?.paymentMethod}</span>
                        </div>

                        <div className="item">
                          <span className="title">유형 : </span>
                          <span className="info">{detail.details?.paymentType}</span>
                        </div>
                      </STotal>

                      {detail.attachmentList.length > 0 && (
                        <SFile>
                          <div className="list">
                            <div className="title">첨부파일</div>
                            {detail.attachmentList?.map((attachment) => (
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
                    </SFormView>
                  )}
                  {(props.code === 'AP200004' ||
                    props.code === 'AP200005' ||
                    props.code === 'AP200006') && (
                    <SFormView>
                      <ToastViewer initialValue={detail.details.contents} />
                      {detail.attachmentList.length > 0 && (
                        <SFile>
                          <div className="list">
                            <div className="title">첨부파일</div>
                            {detail.attachmentList?.map((attachment) => (
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
                    </SFormView>
                  )}
                  <STable>
                    <TableItem>
                      <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">no.</TableCell>
                          <TableCell align="center">결재자</TableCell>
                          <TableCell align="center">상태</TableCell>
                          <TableCell align="center">처리일</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detail.processList?.map((process) => (
                          <TableRow
                            key={process.no}
                            sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                            style={{ position: 'relative' }}
                          >
                            <TableCell align="center">{process.no}</TableCell>
                            <TableCell align="center">
                              {process.name + ' ' + process.grade}
                              {process.comment && (
                                <>
                                  &nbsp;&nbsp;
                                  <Tooltip color={'red'}>
                                    <Tooltip.Icon></Tooltip.Icon>
                                    <Tooltip.Content>{process.comment}</Tooltip.Content>
                                  </Tooltip>
                                </>
                              )}
                            </TableCell>
                            <TableCell align="center">{process.approvalStatus}</TableCell>
                            <TableCell align="center">
                              {process.approvalDatetime
                                ? moment(process.approvalDatetime).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                  )
                                : ''}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableItem>
                  </STable>
                </>
              ) : (
                <Loading />
              )}
            </SApprovalList>
          </ModalComponents.Body>
        </div>
        <ModalComponents.Footer>
          {props.passable && (
            <TextArea
              placeholder="승인 / 반려 사유를 작성해주세요."
              rows={3}
              onChange={(e) => setComment(e.target.value)}
              length={333}
            />
          )}
          {props.recoverable && (
            <Button
              type="button"
              onClick={methods.handleSubmit(onClickRecover)}
              color="gray"
            >
              회수
            </Button>
          )}
          {props.passable && (
            <>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onClickReturn)}
                color="red"
              >
                반려
              </Button>
              <Button
                type="submit"
                onClick={methods.handleSubmit(onClickApproval)}
                color="blue"
              >
                승인
              </Button>
            </>
          )}
          {props.manager && (
            <>
              {detail.approvalStatusCode === 'AP100005' && (
                <Button type="submit" onClick={onClickRewrite} color="red">
                  수정 요청
                </Button>
              )}
              {detail.approvalStatusCode === 'AP100005' && (
                <Button onClick={onClickConfirm} color="blue" disabled={disabledConfirm}>
                  승인
                </Button>
              )}
              {detail.approvalStatusCode === 'AP100005' && (
                <Button type="button" onClick={onClickAddApproval} color="primary">
                  추가 결재선 지정
                </Button>
              )}
            </>
          )}
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

const SFormView = styled.div`
  ul {
    display: flex !important;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${(p) => p.theme.gray70};
    li {
      flex: 0 0 20%;
      width: 20%;
      margin-top: 0 !important;
      padding: 5px 5px 0 10px !important;
      border-top: none !important;
      border-right: 1px solid ${(p) => p.theme.gray70};
      box-sizing: border-box;
      &:last-of-type {
        border-right: none;
      }
      .tit {
        font-size: 12px;
      }
      .content {
        font-size: 14px;
      }
    }
    & + ul {
      margin-top: 10px;
    }

    .detail {
      li {
        flex: 0 0 100%;
        width: 100%;
        white-space: pre-wrap;
      }
    }
  }

  .toastui-editor-contents {
    font-size: medium;

    ul {
      border: none;
      flex-wrap: wrap;
      li {
        flex: 1 0 100%;
        border-right: none;
        &:before {
          margin-top: 9.5px;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    ul {
      flex-wrap: wrap;
      li {
        flex: 0 0 50%;
        width: 50%;
        border-bottom: 1px solid ${(p) => p.theme.gray70};
        &:nth-of-type(2n) {
          border-right: none;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
`;

const STotal = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 15px;
  margin-top: 10px;
  box-sizing: border-box;
  .item {
    .title {
      font-weight: bold;
    }
    .info {
      margin-left: 10px;
    }
    & + .item {
      margin-left: 20px;
    }
  }
`;

const STable = styled.div`
  margin-top: 30px;
`;

const SFile = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding-bottom: 15px;
  .list {
    flex: 1 1 auto;
    .title {
      border-top: 1px solid ${(p) => p.theme.gray70};
      margin-top: 10px;
      padding-top: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
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

const SApprovalList = styled.div`
  .list {
    .input-group {
      // flex-wrap: wrap;
    }
  }
`;

export default ApprovalDetail;
