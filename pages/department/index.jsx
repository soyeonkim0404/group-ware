import React, { useEffect, useState, useContext } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import Button from '@components/ui/Button';
import styled from 'styled-components';
import PopOverUtil from '@components/ui/PopOverUtil';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Accordion, { AccordionList } from '@components/department/Accordion';
import { apiGetDepartment } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import { useRouter } from 'next/router';
import {
  MdDeleteOutline,
  MdLibraryAdd,
  MdOutlineModeEdit,
  MdOutlineSubdirectoryArrowRight,
  MdAdd,
} from 'react-icons/md';
import { ReadyContext } from '@lib/context/ReadyContext';

const Index = () => {
  const { defaultErrorHandler } = useErrorHandler();
  const { openedModal, closeModal } = useModals();
  const [departmentData, setDepartmentData] = useState([]);
  const [sectorName, setSectorName] = useState('');
  const [currHq, setCurrHq] = useState(null);
  const router = useRouter();
  const [isReady, setReady] = useContext(ReadyContext);

  /**
   * 조직 전체 조회
   */
  const getDepartment = () => {
    setReady(false);
    apiGetDepartment()
      .then((res) => {
        setDepartmentData(res.data);
        setReady(true);
      })
      .catch((err) => {
        setReady(true);
        defaultErrorHandler(err, () => router.push('/home'));
      });
  };

  /**
   * 부문 등록 모달
   */
  const modalRegisterSector = () => {
    openedModal(modals.RegisterSector, {
      text: {
        header: '부문 등록',
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 부문 수정 모달
   */
  const modalModifySector = (name, code) => {
    openedModal(modals.ModifySector, {
      text: {
        header: '부문 수정',
        sector: name,
        sectorCode: code,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 본부 등록 모달
   */
  const modalRegisterHeadQuarter = (name, code) => {
    openedModal(modals.RegisterHeadQuarter, {
      text: {
        header: '본부 등록',
        body: name,
        code: code,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 본부 수정 모달
   */
  const modalModifyHeadQuarter = (hq) => {
    openedModal(modals.ModifyHeadQuarter, {
      size: 'lg',
      text: {
        header: '본부 수정',
        sectorName: hq.parentName,
        hqName: hq.name,
        hq: hq,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 팀 등록 모달
   */
  const modalRegisterTeam = (hq) => {
    openedModal(modals.RegisterTeam, {
      size: 'sm',
      text: {
        header: '팀 등록',
        hqData: hq,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 팀 수정 모달
   */
  const modalModifyTeam = (currHq, team) => {
    openedModal(modals.ModifyTeam, {
      size: 'lg',
      text: {
        header: '팀 수정',
        sectorName: currHq.parentName,
        hqName: currHq.name,
        team: team,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 본부 상세
   */
  const showHQ = (currHq) => {
    let isMatched = false;
    if (departmentData && departmentData.childList) {
      for (let i = 0; i < departmentData.childList.length; i++) {
        const el = departmentData.childList[i];
        if (currHq && el && currHq.parentCode === el.code) {
          setSectorName(el.name);
          // 본부 데이터 업데이트
          if (el.childList) {
            for (let j = 0; j < el.childList.length; j++) {
              const hq = el.childList[j];
              if (currHq.code === hq.code) {
                isMatched = true;
                setCurrHq(hq);
                break;
              }
            }
          }
          break;
        }
      }
    }

    if (!isMatched) {
      setCurrHq(null);
    }
  };

  /**
   * 삭제 api
   */
  const modalDelete = (code) => {
    let delModal = modals.DeleteDepartment;
    openedModal(delModal, {
      text: {
        body: '삭제하시겠습니까?',
        code: code,
      },
      onSubmit: () => {
        getDepartment();
      },
    });
  };

  /**
   * 처음 마운트시 조직 전체 조회 API 호출
   */
  useEffect(() => {
    getDepartment();
  }, []);

  /**
   * 현재 선택된 본부가 있을 경우 본부 상세 출력
   */
  useEffect(() => {
    if (currHq) {
      showHQ(currHq);
    }
  }, [isReady]);

  return (
    <CardLayout>
      <Card col="12">
        <Card.Head>
          <Card.Title>Business</Card.Title>
          <SRegister>
            <span className="text">부문 등록</span>
            <Button icon="40" color="gray" onClick={modalRegisterSector}>
              <MdAdd />
            </Button>
          </SRegister>
        </Card.Head>
        <Card.Body>
          <SDepartment>
            <div className="teams">
              <div className="team">
                <AccordionList autoClose="true">
                  {departmentData.childList &&
                    departmentData.childList.map((sector) => (
                      <Accordion id={`accordion=${sector.code}`} key={sector.code}>
                        <Accordion.Head
                          enable={sector?.childList?.length > 0 ? true : false}
                        >
                          <Accordion.Title>
                            <div className="name">
                              <h4>{sector.name}</h4>
                              <div className="pop-util">
                                <PopOverUtil>
                                  <PopOverUtil.Content>
                                    <PopOverUtil.Btn
                                      controlModal={() => {
                                        modalRegisterHeadQuarter(
                                          sector.name,
                                          sector.code
                                        );
                                      }}
                                    >
                                      <MdLibraryAdd />
                                      <span>본부 등록</span>
                                    </PopOverUtil.Btn>
                                    <PopOverUtil.Btn
                                      controlModal={() => {
                                        modalModifySector(sector.name, sector.code);
                                      }}
                                    >
                                      <MdOutlineModeEdit />
                                      <span>부문 수정</span>
                                    </PopOverUtil.Btn>
                                    <PopOverUtil.Btn
                                      controlModal={() => {
                                        modalDelete(sector.code);
                                      }}
                                    >
                                      <MdDeleteOutline />
                                      <span>부문 삭제</span>
                                    </PopOverUtil.Btn>
                                  </PopOverUtil.Content>
                                </PopOverUtil>
                              </div>
                            </div>
                          </Accordion.Title>
                        </Accordion.Head>
                        <Accordion.Body>
                          <div className="groups">
                            {sector.childList &&
                              sector.childList.map((hq) => (
                                <div
                                  className={
                                    hq.name === currHq?.name ? 'group active' : 'group'
                                  }
                                  key={hq.code}
                                >
                                  <div
                                    className="item"
                                    onClick={() => {
                                      showHQ(hq);
                                    }}
                                  >
                                    <MdOutlineSubdirectoryArrowRight />
                                    {hq.name}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Accordion.Body>
                      </Accordion>
                    ))}
                </AccordionList>
              </div>
            </div>
            {currHq && currHq.name && (
              <div className="members" key={currHq.code}>
                <div className="name-wrap">
                  <div className="name">
                    <h4>
                      {sectorName} &gt; {currHq.name}
                    </h4>

                    {/* 본부 팝업 유틸 */}
                    <SRegister>
                      <div className="pop-util" style={{ marginLeft: '15px' }}>
                        <PopOverUtil>
                          <PopOverUtil.Content>
                            <PopOverUtil.Btn
                              controlModal={() => {
                                modalRegisterTeam(currHq);
                              }}
                            >
                              <MdOutlineModeEdit />
                              <span>팀 등록</span>
                            </PopOverUtil.Btn>
                            <PopOverUtil.Btn
                              controlModal={() => {
                                modalModifyHeadQuarter(currHq);
                              }}
                            >
                              <MdOutlineModeEdit />
                              <span>본부 수정</span>
                            </PopOverUtil.Btn>
                            <PopOverUtil.Btn
                              controlModal={() => {
                                modalDelete(currHq.code);
                              }}
                            >
                              <MdDeleteOutline />
                              <span>본부 삭제</span>
                            </PopOverUtil.Btn>
                          </PopOverUtil.Content>
                        </PopOverUtil>
                      </div>
                    </SRegister>
                  </div>

                  <div className="leader">
                    <b>리더 :</b> {currHq?.leader?.name} / <b>대리인 :</b>
                    {currHq?.secondLeader?.name}
                  </div>
                </div>

                {
                  /* 본부 팀원 */
                  currHq?.memberList?.length > 0 ? (
                    <div className="team-table">
                      <TableItem>
                        <colgroup>
                          <col style={{ width: '' }} />
                          <col style={{ width: '' }} />
                          <col style={{ width: '' }} />
                          <col style={{ width: '' }} />
                          <col style={{ width: '' }} />
                          <col style={{ width: '' }} />
                        </colgroup>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">이름</TableCell>
                            <TableCell align="center">직급</TableCell>
                            <TableCell align="center">이메일</TableCell>
                            <TableCell align="center">핸드폰</TableCell>
                            <TableCell align="center">입사일</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currHq.memberList &&
                            currHq.memberList.map((p) => (
                              <TableRow key={p.userId}>
                                <TableCell align="center">{p.name}</TableCell>
                                <TableCell align="center">{p.position}</TableCell>
                                <TableCell align="center">{p.email}</TableCell>
                                <TableCell align="center">{p.mobilePhone}</TableCell>
                                <TableCell align="center">{p.joinDate}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </TableItem>
                    </div>
                  ) : null
                }

                {/* 팀 */}
                {currHq &&
                  currHq.childList &&
                  currHq.childList.map((team) => (
                    <div key={team.code}>
                      {team.name && (
                        <div className="team-name">
                          <h5>{team.name}</h5>
                          <div className="pop-util">
                            <PopOverUtil>
                              <PopOverUtil.Content>
                                <PopOverUtil.Btn
                                  controlModal={() => {
                                    modalModifyTeam(currHq, team);
                                  }}
                                >
                                  <MdOutlineModeEdit />
                                  <span>팀 수정</span>
                                </PopOverUtil.Btn>
                                <PopOverUtil.Btn
                                  controlModal={() => {
                                    modalDelete(team.code);
                                  }}
                                >
                                  <MdDeleteOutline />
                                  <span>팀 삭제</span>
                                </PopOverUtil.Btn>
                              </PopOverUtil.Content>
                            </PopOverUtil>
                          </div>
                        </div>
                      )}

                      <div className="team-table">
                        <b>리더 :</b> {team?.leader?.name} / <b>대리인 :</b>
                        {team?.secondLeader?.name}
                      </div>

                      <div className="team-table">
                        <TableItem>
                          <colgroup>
                            <col style={{ width: '' }} />
                            <col style={{ width: '' }} />
                            <col style={{ width: '' }} />
                            <col style={{ width: '' }} />
                            <col style={{ width: '' }} />
                            <col style={{ width: '' }} />
                          </colgroup>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">이름</TableCell>
                              <TableCell align="center">직급</TableCell>
                              <TableCell align="center">이메일</TableCell>
                              <TableCell align="center">핸드폰</TableCell>
                              <TableCell align="center">입사일</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {team.memberList &&
                              team.memberList.map((p) => (
                                <TableRow key={p.userId}>
                                  <TableCell align="center">{p.name}</TableCell>
                                  <TableCell align="center">{p.position}</TableCell>
                                  <TableCell align="center">{p.email}</TableCell>
                                  <TableCell align="center">{p.mobilePhone}</TableCell>
                                  <TableCell align="center">{p.joinDate}</TableCell>
                                  {/*<TableCell align="center">asd</TableCell>*/}
                                </TableRow>
                              ))}
                          </TableBody>
                        </TableItem>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </SDepartment>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

const SRegister = styled.div`
  display: flex;
  align-items: center;
  .text {
    color: ${(p) => p.theme.gray40};
    margin-right: 20px;
    margin-top: 5px;
  }
`;

const SDepartment = styled.div`
  display: flex;
  width: 100%;
  h4 {
    font-size: 22px;
  }
  .pop-util {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
  .name-wrap {
    padding-bottom: 10px;
    border-bottom: 1px solid ${(p) => p.theme.gray70};
    .name {
      margin-bottom: 15px;
    }
  }
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
  }
  .accordion {
    cursor: pointer;
    .name {
      border-bottom: none;
    }
    .arrow {
      display: none !important;
    }
    .pop-util {
      margin-left: 10px;
    }
    .accordion-head {
      padding: 10px 20px;
      > div {
        margin-top: 10px;
      }
    }
  }

  .accordion-body {
    > div {
      background: ${(p) => p.theme.white};
      padding-top: 0;
      border-top: none !important;
    }
  }
  .teams {
    width: 100%;
    .team {
      .groups {
        .group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          color: ${(p) => p.theme.gray40};
          font-weight: 700;
          border: 1px solid ${(p) => p.theme.gray70};
          border-radius: 15px;
          padding-right: 15px;
          box-sizing: border-box;
          .item {
            width: 100%;
            height: 100%;
            padding: 20px 15px;
            font-size: 16px;
            box-sizing: border-box;
            cursor: pointer;
          }
          svg {
            font-size: 18px;
            margin-right: 5px;
            color: ${(p) => p.theme.gray40} !important;
          }
          & + .group {
            margin-top: 10px;
          }
          &.active {
            color: ${(p) => p.theme.red};
            border-color: ${(p) => p.theme.red};
          }
        }
      }
    }
  }
  .members {
    margin-left: 3%;
    flex: 0 0 72%;
    width: 72%;
    padding: 20px 25px;
    border: 1px solid ${(p) => p.theme.gray70};
    border-radius: 15px;
    box-sizing: border-box;
    .member-list {
      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 15px;
        box-sizing: border-box;
        border-bottom: 1px solid ${(p) => p.theme.gray70};
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .team-name {
    font-size: 20px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    box-sizing: border-box;
  }

  .team-table + .team-table {
    margin-top: 20px;
  }

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    .teams {
    }
    .members {
      flex: none;
      width: 100%;
      margin-left: 0;
      margin-top: 3%;
    }
  }
`;

export default Index;
