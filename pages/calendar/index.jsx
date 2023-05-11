import React, { useState, useEffect } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import Calendar from '@components/ui/Calendar';
import styled from 'styled-components';
import { apiGetCalendar } from '@lib/api/module';
import moment from 'moment';

const Index = () => {
  const [vacation, setVacation] = useState([]);

  const params = {
    year: new Date().getFullYear(),
  };

  useEffect(() => {
    getVacation(params);
  }, []);
  const getVacation = (params) => {
    apiGetCalendar(params)
      .then((res) => {
        let newArr = [];
        res.forEach((r) => {
          let endDate = new Date(r.endDate);
          endDate.setDate(endDate.getDate() + 1); // 시간 없이 날짜만 받아오기 때문에 하루를 더해줌

          newArr.push({
            title: r.userName + ' ' + r.details,
            start: r.startDate,
            end: moment(endDate).format('YYYY-MM-DD'),
            organizationCode: r.organizationCode,
            organizationName: r.organizationName,
            details: r.details,
            color: getOrganizationColor(r.organizationCode),
          });
        });
        setVacation(newArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(vacation);

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SContents>
              <div>
                <Calendar events={vacation} />
              </div>
            </SContents>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export const getOrganizationColor = (organizationCode) => {
  let titleColor = '';
  switch (organizationCode) {
    // admin
    case 'BS':
      return (titleColor = '#ee2c3c');
    // 경영전략 본부
    case 'BS001001':
      return (titleColor = '#ee2c3c');
    // CP1
    case 'BS002001':
      return (titleColor = '#fd8419');
    // CT1
    case 'BS002002':
      return (titleColor = '#cccc00');
    // CD1
    case 'BS002003':
      return (titleColor = '#7950f2');
    // CP2
    case 'BS003001':
      return (titleColor = '#009edd');
    // CT2
    case 'BS003002':
      return (titleColor = '#ab6fe3');
    // CD2
    case 'BS003003':
      return (titleColor = '#60bb44');
    // CM
    case 'BS004001':
      return (titleColor = '#a2ddfb');
    // NEXT MOTION
    case 'BS005001':
      return (titleColor = '#fab005');
    // CX
    case 'BS006001':
      return (titleColor = '#b16031');
    default:
      return;
  }
};

const SContents = styled.div`
  text-align: left;
  font-size: 16px;
  margin-top: 40px;
  .con {
    display: none;
    &.active {
      display: block;
    }
  }
`;

export default Index;
