import React, { useState, useEffect } from 'react';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableItem from '@components/ui/TableItem';
import Card, { CardLayout } from '@components/ui/Card';
import { parallelApi, updateVacation } from '@api';
import useModals from '@lib/hooks/useModals';
import Input from '@components/ui/Input';
import moment from 'moment';
import Button from '@components/ui/Button';
import styled from 'styled-components';
import { modals } from '@components/ui/modals';
import { getFirstInvalidMessageToString } from '@lib/validation/support';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import Image from 'next/image';
import { MdAccountCircle } from 'react-icons/md';
import Select from '@components/ui/Select';

const Index = ({ data }) => {
  const { openedModal } = useModals();

  const [employeeData, setEmployeeData] = useState([]);
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    setEmployeeData(data.employee);
  }, []);

  const onChangeVacation = (e, i) => {
    const { value } = e.target;

    setEmployeeData(
      employeeData.map((item, index) =>
        index === i ? { ...item, vacation: value } : item
      )
    );
  };

  const onClickGrantButton = async () => {
    openedModal(modals.GrantAllVacation, {
      closeButton: true,
      size: 'lg',
      onSubmit: async (comment, callback) => {
        const data = employeeData
          .filter((item) => item.vacation !== '0')
          .filter((o) =>
            organization !== '' ? o.organizationCode === organization : true
          )
          .map((item) => ({ userId: item.id, count: item.vacation, type: 'VA100001' }));

        const params = {
          year: new Date().getFullYear(),
          comment: comment,
          data: data,
        };

        const modalProps = {
          isSuccess: true,
          text: {
            body: '완료되었습니다',
          },
        };
        try {
          await updateVacation(params);
        } catch (e) {
          modalProps.isSuccess = false;
          modalProps.text.body = getFirstInvalidMessageToString(e.data.message);
        } finally {
          if (typeof callback === 'function') callback();
        }

        await new Promise((resolve) => {
          if (modalProps.isSuccess) modalProps.resolve = resolve;
          openedModal(modals.Alert, modalProps);
        });
      },
    });
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SHeaderWrap>
              <Select
                getSelectData={data.organization}
                label="본부"
                labelId="organizationLabelId"
                selectId="organizationSelectId"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </SHeaderWrap>
            <TableItem>
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center">no.</TableCell>
                  <TableCell align="center">이미지</TableCell>
                  <TableCell align="center">본부</TableCell>
                  <TableCell align="center">직급</TableCell>
                  <TableCell align="center">직책</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">발생</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData
                  .filter((o) =>
                    organization !== '' ? o.organizationCode === organization : true
                  )
                  .map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      style={{ position: 'relative' }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">
                        {item.profileImage ? (
                          <Image
                            src={item.profileImage}
                            alt="profile-img"
                            width={50}
                            height={50}
                            className="employee-img"
                          />
                        ) : (
                          <MdAccountCircle
                            style={{ width: 50, height: 50, color: '#ced4da' }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">{item.organization}</TableCell>
                      <TableCell align="center">{item.grade}</TableCell>
                      <TableCell align="center">{item.position}</TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">
                        <Input
                          name="연차"
                          type={'number'}
                          value={item.vacation}
                          onChange={(e) => onChangeVacation(e, index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </TableItem>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button color="blue" size="large" onClick={onClickGrantButton}>
            확인
          </Button>
        </Button.Group>
      </Button.Wrap>
    </>
  );
};

const SHeaderWrap = styled.div`
  margin: 0 0 20px;
  .mobile & {
    margin-right: 0;
    .select {
      padding-bottom: 0 !important;
    }
  }
  .group:has(button) {
    margin-left: 20px;
    padding-top: 17px;
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const MAX_VACATION_COUNT = 26;

  const parallelData = [
    {
      name: 'employee',
      url: `/api/v1/user/list?${new URLSearchParams({
        type: 'MB200001',
        status: 'MB100001',
      }).toString()}`,
      method: 'get',
    },
    {
      name: 'organization',
      url: '/api/v1/organization/selectList/part',
      method: 'get',
    },
  ];
  const response = await parallelApi(parallelData, context);
  const allOption = { name: '전체', code: '' };

  const data = {
    employee: response['employee'].map((item) => {
      item.vacation = 15;

      const joinYear = Number(moment(item.joinDate).format('YYYY')) + 1;
      const currentYear = Number(moment().format('YYYY'));
      const diffYear = currentYear - joinYear;

      if (diffYear > 0) {
        item.vacation += Math.floor(diffYear / 2);
        item.vacation = Math.min(item.vacation, MAX_VACATION_COUNT);
      }

      return item;
    }),
    organization: [allOption, ...response['organization']],
  };

  const compare = (a, b) => {
    if (a.gradeSort < b.gradeSort) return -1;
    else if (a.gradeSort > b.gradeSort) return 1;
    else {
      if (a.positionSort < b.positionSort) return -1;
      else if (a.positionSort > b.positionSort) return -1;
      else return 0;
    }
  };

  data.employee.sort(compare);

  return {
    props: { data: data },
  };
});

export default Index;
