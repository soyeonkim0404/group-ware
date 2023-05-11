import React, { useEffect, useState } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import Calendar from '@components/ui/Calendar';
import { apiGetMyCommute, apiGetMyHoliday } from '@api';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment/moment';

const Index = () => {
  const [myData, setMyData] = useState([]);
  const [myHoliday, setMyHoliday] = useState('');

  console.log(myData);

  useEffect(() => {
    getMyCommute();
    getMyHoliday();
  }, []);
  const getMyCommute = () => {
    apiGetMyCommute({ year: new Date().getFullYear() })
      .then((res) => {
        let newArr = [];
        res.forEach((item) => {
          let endDate = new Date(item.offDate);
          endDate.setDate(endDate.getDate() + 1);
          const workOnOff = () => {
            let title = '';
            const workOn = `출근 (${item.onTime})`;
            const workOff = `퇴근 (${item.offTime})`;
            if (item.type === 'work' && item.onDate !== null && item.offDate === null) {
              return (title = workOn);
            } else {
              return (title = workOn + '\n' + workOff);
            }
          };
          const calendarColor = () => {
            if (item.type === 'work') {
              //출퇴근
              return '#ced4da';
            } else if (item.type === 'vacation') {
              //연차 반차 신데렐라 리프레쉬
              return '#f03e3e';
            } else {
              return '#1976d2';
            }
          };
          newArr.push({
            title: item.type === 'vacation' ? item.details : workOnOff(),
            start: item.onDate,
            end: moment(endDate).format('YYYY-MM-DD'),
            color: calendarColor(),
          });
        });
        setMyData(newArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getMyHoliday = () => {
    apiGetMyHoliday()
      .then((res) => {
        setMyHoliday(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <CardLayout>
      <Card col="12">
        <Card.Body>
          <STab>
            <ul>
              <li className="item active">
                <Link href={'/mypage'}>
                  <a>캘린더</a>
                </Link>
              </li>
              <li className="item">
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
          <SMyHoliday>
            <p className="text">
              나의 연차는?
              <span className="data">
                {parseInt(myHoliday.availableUse)} / {parseInt(myHoliday.grant)}
              </span>
            </p>
            <progress
              className="progress"
              max={parseInt(myHoliday.grant)}
              value={parseInt(myHoliday.availableUse)}
            />
          </SMyHoliday>
          <Calendar events={myData} />
        </Card.Body>
      </Card>
    </CardLayout>
  );
};
const SMyHoliday = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  margin: 30px 0 30px auto;
  .text {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
    margin-bottom: 5px;
    color: ${(p) => p.theme.gray10};
    .data {
      color: ${(p) => p.theme.gray40};
    }
  }
  .progress {
    width: 100%;
    appearance: none;
    border: none;
    border-radius: 13px;
    height: 13px;
    &::-webkit-progress-bar,
    &::-webkit-progress-value {
      border-radius: 13px;
    }
    &::-webkit-progress-bar {
      background-color: ${(p) => p.theme.gray70};
    }

    &::-webkit-progress-value {
      background: ${(p) => p.theme.blue};
    }
  }
  .mobile & {
    width: 100%;
  }
`;
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
      cursor: pointer;
      transition: all 0.5s ease;
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

export default Index;
