import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Card, { CardLayout } from '@components/ui/Card';
import TableItem from '@components/ui/TableItem';
import Pagination from '@components/ui/Pagination';
import PopOverUtil from '@components/ui/PopOverUtil';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Button from '@components/ui/Button';
import React, { useEffect, useState } from 'react';
import usePageable from '@lib/hooks/usePageable';
import { apiProjectDelete, getProject } from '@api';
import Link from 'next/link';
import Loading from '@components/ui/Loading';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  const { openedModal } = useModals();
  const [projectData, setProjectData] = useState({});
  const { pageable, setPageable } = usePageable();
  const [loading, setLoading] = useState(false);

  const removeConfirmModal = (id) => {
    openedModal(modals.Modal, {
      closeButton: true,
      text: {
        body: '삭제하시겠습니까?',
      },
      onSubmit: () => {
        apiProjectDelete({ id: id }).then((result) => {
          search(1);
        });
      },
    });
  };
  const getPage = (newPage) => {
    if (newPage != pageable.page) {
      search(newPage);
    }
  };

  const search = (num) => {
    setLoading(true);
    getProject({ page: num - 1, size: pageable.size, sort: 'id,desc' })
      .then((res) => {
        setProjectData(res.data.content);
        setPageable({
          ...pageable,
          total: res.data.totalElements,
          totalPages: res.data.totalPages,
          page: num,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    search(1);
  }, []);

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <TableItem>
              <colgroup>
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '56px' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">no</TableCell>
                  <TableCell align="center">타입</TableCell>
                  <TableCell align="center">프로젝트 명</TableCell>
                  <TableCell align="center">클라이언트</TableCell>
                  <TableCell align="center">시작일</TableCell>
                  <TableCell align="center">종료일</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectData?.length > 0 ? (
                  projectData.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                    >
                      <TableCell align="center">{item.no}</TableCell>
                      <TableCell align="center">{item.projectType}</TableCell>
                      <TableCell align="center">
                        <Link href={`/management/view?id=${item.id}`}>
                          {item.projectName}
                        </Link>
                      </TableCell>
                      <TableCell align="center">{item.client}</TableCell>
                      <TableCell align="center">{item.beginDate}</TableCell>
                      <TableCell align="center">{item.endDate}</TableCell>
                      <TableCell
                        align="center"
                        sx={{ '&:last-of-type': { padding: '0' } }}
                      >
                        <div>
                          <PopOverUtil
                            menuCode="MN003"
                            auth="X"
                            userId={[
                              item.createUserid,
                              ...item.memberList
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
                          >
                            <PopOverUtil.Content>
                              <PopOverUtil.Btn>
                                <MdOutlineModeEdit />
                                <span>
                                  <Link href={`/management/edit?id=${item.id}`}>
                                    수정
                                  </Link>
                                </span>
                              </PopOverUtil.Btn>
                              <PopOverUtil.Btn
                                controlModal={() => removeConfirmModal(item.id)}
                              >
                                <MdDeleteOutline />
                                <span>삭제</span>
                              </PopOverUtil.Btn>
                            </PopOverUtil.Content>
                          </PopOverUtil>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={7}>
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableItem>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button
            color="blue"
            size="large"
            link={`/management/register`}
            menuCode="MN003"
            auth="W"
          >
            등록
          </Button>
        </Button.Group>
      </Button.Wrap>
      <Pagination
        totalPages={pageable.totalPages}
        initPage={pageable.initialPage}
        getPage={getPage}
      />
      {loading && <Loading />}
    </>
  );
};

export default Index;
