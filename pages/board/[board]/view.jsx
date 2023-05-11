import React, { useEffect, useRef, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import { MdClose, MdFileDownload, MdChatBubble } from 'react-icons/md';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import TextArea from '@components/ui/TextArea';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import {
  apiDeleteComment,
  apiDeletePost,
  apiGetBoardInfo,
  apiGetBoardPost,
  apiRegisterComment,
  apiSelectComment,
  apiUpdateComment,
  parallelApi,
} from '@api';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import Loading from '@components/ui/Loading';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';

const ToastViewer = dynamic(() => import('@components/ui/ToastViewer'), {
  ssr: false,
});

const View = ({ post, boardInfo }) => {
  const { defaultErrorHandler } = useErrorHandler();

  const { openedModal } = useModals();

  const profile = useSelector(({ profile }) => profile);

  const textAreaRef = useRef([]);

  const router = useRouter();
  const { id, board } = router.query;

  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    recursiveComment(post.commentList);
  }, []);

  const recursiveComment = (commentList) => {
    const data = commentList
      .filter((comment) => comment.parentId === null)
      .map((comment) => {
        comment.toggle = false;
        comment.isEdit = false;
        comment.childList = commentList
          .filter((child) => child.parentId === comment.id)
          .map((child) => ({ ...child, isEdit: false }));

        return comment;
      });

    setCommentList(data);
  };

  const onClickDeletePost = async () => {
    openedModal(modals.Modal, {
      closeButton: true,
      size: 'sm',
      text: {
        body: '삭제하시겠습니까?',
      },
      onSubmit: async () => {
        setLoading(true);

        try {
          await apiDeletePost({ id: post.id });
        } catch (e) {
          setLoading(false);

          openedModal(modals.Modal, {
            closeButton: true,
            text: {
              header: '에러',
              body: '잠시 후 다시 시도해주세요.',
            },
          });
        } finally {
          setLoading(false);

          await router.push(`/board/${board}`);
        }
      },
    });
  };

  const onClickRegisterComment = async (refId) => {
    const comment = textAreaRef.current[refId].value || '';
    const commentReplace = comment.replace(/(?:\r\n|\r|\n)/g, '<br/>');

    const params = {
      postId: id,
      parentCommentId: refId === 0 ? null : refId,
      comment: commentReplace,
    };

    setLoading(true);
    try {
      await apiRegisterComment(params);
      textAreaRef.current[refId].value = '';
      const response = await apiSelectComment({ id: id });
      recursiveComment(response);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const onClickUpdateComment = async (refId) => {
    const comment = textAreaRef.current[refId].value || '';
    const commentReplace = comment.replace(/(?:\r\n|\r|\n)/g, '<br/>');

    const params = {
      id: refId,
      comment: commentReplace,
    };

    setLoading(true);
    try {
      await apiUpdateComment(params);
      textAreaRef.current[refId].value = '';
      const response = await apiSelectComment({ id: id });
      recursiveComment(response);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const onClickDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await apiDeleteComment({ id: commentId });
      const response = await apiSelectComment({ id: id });
      recursiveComment(response);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

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
            <Card.Title>
              {post.title}
              <SBoardInfo>
                <span className="title">
                  작성자 : {post.createUserName}{' '}
                  <span className="sub">({post.createUserOrganization})</span>
                </span>
                <span className="title">조회수 : {post.viewCount} 회</span>
              </SBoardInfo>
            </Card.Title>
          </Card.Head>
          <Card.Body>
            <SBoardDetail>
              <ToastViewer initialValue={post.body} />
            </SBoardDetail>

            {post.attachmentList && post.attachmentList.length > 0 && (
              <SBoardFile>
                <span className="title">첨부파일</span>
                <div className="list">
                  {post.attachmentList.map((attachment) => (
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
              </SBoardFile>
            )}

            {post.useComment && (
              <SBoardComment>
                <span className="title">댓글</span>
                <SCommentWrite>
                  <span className="me">
                    <Image
                      src={
                        profile && profile.profileImage
                          ? profile.profileImage
                          : '/static/img/noImg.svg'
                      }
                      alt="profile-img"
                      width={60}
                      height={60}
                    />
                  </span>
                  <div className="textarea">
                    <TextArea
                      ref={(el) => {
                        textAreaRef.current[0] = el;
                      }}
                    />
                    <Button.Group>
                      <Button color="blue" onClick={() => onClickRegisterComment(0)}>
                        등록
                      </Button>
                    </Button.Group>
                  </div>
                </SCommentWrite>
                <ul className="comment-list">
                  {commentList &&
                    commentList.length > 0 &&
                    commentList.map((comment) => (
                      <li key={comment.id}>
                        <SComment>
                          <div className="profile-img">
                            <Image
                              src={comment.createUserProfile || '/static/img/noImg.svg'}
                              alt="profile-img"
                              width={60}
                              height={60}
                            />
                          </div>
                          <div className="text">
                            <div className="user-info">
                              <span className="name">{comment.createUser}</span>
                              <span className="position">
                                {comment.createUserOrganization}
                              </span>
                              {!comment.isDelete && (
                                <>
                                  <Button
                                    text
                                    className="modify"
                                    onClick={() => {
                                      setCommentList(
                                        commentList.map((item) =>
                                          item.id === comment.id
                                            ? { ...item, isEdit: !item.isEdit }
                                            : item
                                        )
                                      );
                                    }}
                                    menuCode={'MN008'}
                                    auth={'X'}
                                    userId={comment.createUserId}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    text
                                    onClick={() => onClickDeleteComment(comment.id)}
                                    className="delete"
                                    menuCode={'MN008'}
                                    auth={'X'}
                                    userId={comment.createUserId}
                                  >
                                    <MdClose />
                                  </Button>
                                </>
                              )}
                            </div>
                            {comment.isEdit ? (
                              <div className="modify-comment">
                                <SCommentWrite>
                                  <div className="textarea">
                                    <TextArea
                                      ref={(el) => {
                                        if (!el) return;
                                        textAreaRef.current[comment.id] = el;

                                        el.value = comment.comment.replace(
                                          /<br\/>/g,
                                          '\r\n'
                                        );
                                      }}
                                    />
                                    <Button.Group>
                                      <Button
                                        onClick={() => onClickUpdateComment(comment.id)}
                                      >
                                        수정
                                      </Button>
                                    </Button.Group>
                                  </div>
                                </SCommentWrite>
                              </div>
                            ) : (
                              <p
                                className="comment"
                                dangerouslySetInnerHTML={{ __html: comment.comment }}
                              />
                            )}
                            <Button
                              color="gray"
                              text
                              className="add-comment"
                              onClick={() => {
                                setCommentList(
                                  commentList.map((item) =>
                                    item.id === comment.id
                                      ? { ...item, toggle: !item.toggle }
                                      : item
                                  )
                                );
                              }}
                            >
                              <MdChatBubble /> 댓글{' '}
                              <span className="num">{comment.childList?.length}</span>
                            </Button>
                          </div>
                        </SComment>
                        {comment.toggle && (
                          <SReComment>
                            <ul className="re-comment-list">
                              {comment.childList &&
                                comment.childList.length > 0 &&
                                comment.childList.map((child) => (
                                  <React.Fragment key={child.id}>
                                    <li>
                                      <SComment>
                                        <div className="profile-img">
                                          <Image
                                            src={
                                              child.createUserProfile ||
                                              '/static/img/noImg.svg'
                                            }
                                            alt="profile-img"
                                            width={60}
                                            height={60}
                                          />
                                        </div>
                                        <div className="text">
                                          <div className="user-info">
                                            <span className="name">
                                              {child.createUser}
                                            </span>
                                            <span className="position">
                                              {child.createUserOrganization}
                                            </span>
                                            {!child.isDelete && (
                                              <>
                                                <Button
                                                  text
                                                  className="modify"
                                                  onClick={() => {
                                                    setCommentList(
                                                      commentList.map((item) =>
                                                        item.id === comment.id
                                                          ? {
                                                              ...item,
                                                              childList:
                                                                item.childList.map(
                                                                  (childItem) =>
                                                                    childItem.id ===
                                                                    child.id
                                                                      ? {
                                                                          ...childItem,
                                                                          isEdit:
                                                                            !childItem.isEdit,
                                                                        }
                                                                      : childItem
                                                                ),
                                                            }
                                                          : item
                                                      )
                                                    );
                                                  }}
                                                  menuCode={'MN008'}
                                                  auth={'X'}
                                                  userId={child.createUserId}
                                                >
                                                  수정
                                                </Button>
                                                <Button
                                                  text
                                                  onClick={() =>
                                                    onClickDeleteComment(child.id)
                                                  }
                                                  className="delete"
                                                  menuCode={'MN008'}
                                                  auth={'X'}
                                                  userId={child.createUserId}
                                                >
                                                  <MdClose />
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                          {child.isEdit ? (
                                            <div className="modify-comment">
                                              <SCommentWrite>
                                                <div className="textarea">
                                                  <TextArea
                                                    ref={(el) => {
                                                      if (!el) return;
                                                      textAreaRef.current[child.id] = el;

                                                      el.value = child.comment.replace(
                                                        /<br\/>/g,
                                                        '\r\n'
                                                      );
                                                    }}
                                                  />
                                                  <Button.Group>
                                                    <Button
                                                      onClick={() =>
                                                        onClickUpdateComment(child.id)
                                                      }
                                                    >
                                                      수정
                                                    </Button>
                                                  </Button.Group>
                                                </div>
                                              </SCommentWrite>
                                            </div>
                                          ) : (
                                            <p
                                              className="comment"
                                              dangerouslySetInnerHTML={{
                                                __html: child.comment,
                                              }}
                                            />
                                          )}
                                        </div>
                                      </SComment>
                                    </li>
                                  </React.Fragment>
                                ))}
                            </ul>
                            <SCommentWrite
                              style={{
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '30px',
                              }}
                            >
                              <span className="me">
                                <Image
                                  src={
                                    profile && profile.profileImage
                                      ? profile.profileImage
                                      : '/static/img/noImg.svg'
                                  }
                                  alt="profile-img"
                                  width={60}
                                  height={60}
                                />
                              </span>
                              <div className="textarea">
                                <TextArea
                                  ref={(el) => {
                                    textAreaRef.current[comment.id] = el;
                                  }}
                                />
                                <Button.Group>
                                  <Button
                                    onClick={() => onClickRegisterComment(comment.id)}
                                  >
                                    등록
                                  </Button>
                                </Button.Group>
                              </div>
                            </SCommentWrite>
                          </SReComment>
                        )}
                      </li>
                    ))}
                </ul>
              </SBoardComment>
            )}
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button
            color="red"
            size="large"
            userId={post.createUserId}
            menuCode={boardInfo.menuCode}
            auth={'X'}
            onClick={onClickDeletePost}
          >
            삭제
          </Button>
          <Button
            color="blue"
            size="large"
            link={`/board/${board}/edit?id=${id}`}
            userId={post.createUserId}
            menuCode={boardInfo.menuCode}
            auth={'X'}
          >
            수정
          </Button>
        </Button.Group>
        <Button.Group>
          <Button color="gray" size="large" link={`/board/${board}`}>
            목록
          </Button>
        </Button.Group>
      </Button.Wrap>
      {loading && <Loading />}
    </>
  );
};

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const { id, board } = context.query;

  const parallelData = [
    {
      name: 'boardInfo',
      url: `/api/v1/board/select/boardInfo?name=${board}`,
      method: 'get',
    },
    {
      name: 'post',
      url: `/api/v1/board/select?id=${id}`,
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const post = response.post;
  const boardInfo = response.boardInfo;

  return {
    props: { post, boardInfo },
  };
});

const SBoardInfo = styled.div`
  font-weight: 400;
  font-size: 14px;
  margin-top: 10px;
  color: ${(p) => p.theme.gray30};
  .title {
  }
  .sub {
    font-size: 13px;
    color: ${(p) => p.theme.gray40};
  }
  span + span {
    margin-left: 10px;
    padding-left: 10px;
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      height: 12px;
      top: 2px;
      left: 0;
      background: ${(p) => p.theme.gray50};
    }
  }
`;

const SBoardDetail = styled.div`
  width: 100%;
  padding: 20px 20px 60px;
  box-sizing: border-box;
  .toastui-editor-contents {
    font-size: 16px;
  }
`;
const SBoardFile = styled.div`
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
const SBoardComment = styled.div`
  .title {
    width: 100%;
    display: block;
    padding-top: 30px;
    font-size: 20px;
    font-weight: bold;
    border-top: 1px solid ${(p) => p.theme.gray70};
  }
  .comment-list {
    margin-top: 50px;
    li {
      width: 100%;
      & + li {
        padding-top: 30px;
        margin-top: 30px;
        border-top: 1px solid ${(p) => p.theme.gray70};
      }
    }
  }
  .modify-comment {
    .textarea {
      margin-left: 0;
    }
  }
`;

const SCommentWrite = styled.div`
  display: flex;
  margin-top: 30px;
  .me {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
    border: 3px solid ${(p) => p.theme.white};
    box-shadow: 0 12px 30px rgb(80 143 244 / 10%);
    border-radius: 100%;
    box-sizing: border-box;
    img {
      border-radius: 100%;
    }
  }
  .textarea {
    flex: 1 1 calc(100% - 60px);
    width: calc(100% - 60px);
    margin-left: 30px;
    box-sizing: border-box;
    .group {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const SComment = styled.div`
  display: flex;
  align-items: flex-start;
  .profile-img {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
    border: 3px solid ${(p) => p.theme.white};
    box-shadow: 0 12px 30px rgb(80 143 244 / 10%);
    border-radius: 100%;
    box-sizing: border-box;
    img {
      border-radius: 100%;
    }
  }
  .text {
    flex: 1 1 calc(100% - 60px);
    width: calc(100% - 60px);
    margin-left: 30px;
    box-sizing: border-box;
    .user-info {
      display: flex;
      align-items: center;
      .position {
        margin-left: 10px;
        font-size: 14px;
        color: ${(p) => p.theme.gray40};
      }
      .name {
      }
      .delete {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: auto !important;
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin-left: 10px;
        margin-top: -1px;
        background: ${(p) => p.theme.gray50};
        border-radius: 100%;
        svg {
          margin-right: 0;
          font-size: 14px;
          color: ${(p) => p.theme.white};
        }
      }
      .modify {
        min-width: auto;
        height: 20px;
        background: ${(p) => p.theme.gray50};
        padding: 0 8px;
        margin-left: 10px;
        span {
          font-size: 11px;
          color: ${(p) => p.theme.white};
        }
      }
    }
    .comment {
      margin-top: 10px;
      word-break: break-word;
    }
    .add-comment {
      justify-content: flex-start;
      margin-top: 10px;
      color: ${(p) => p.theme.gray40};
      .num {
        margin-left: 5px;
        font-weight: bold;
        color: ${(p) => p.theme.gray20};
      }
    }
  }
`;

const SReComment = styled.div`
  padding: 30px 10px 20px 85px;
  ul {
    li {
      &:first-child {
        padding-top: 30px;
        border-top: 1px solid ${(p) => p.theme.gray70};
      }
    }
  }
`;

export default View;
