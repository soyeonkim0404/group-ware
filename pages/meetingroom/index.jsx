import React, { useState, useEffect } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import { apiGetMeetingRoom } from '@lib/api/module';
import { modals } from '@components/ui/modals';
import moment from 'moment';
import MeetingRoom from '@components/ui/MeetingRoom';
import useModals from '@lib/hooks/useModals';

const Index = () => {
  const [meetingRoom, setMeetingRoom] = useState([]);
  const { openedModal } = useModals();

  const params = {
    year: new Date().getFullYear(),
  };

  useEffect(() => {
    getMeetingRoom(params);

    const timer = setInterval(() => {
      getMeetingRoom(params);
    }, 60000);

    setTimeout(() => {
      clearInterval(timer);
    }, 600000);
  }, []);

  const getMeetingRoom = (params) => {
    apiGetMeetingRoom(params)
      .then((res) => {
        let newArr = [];
        res.forEach((r) => {
          const meetingRoom = r.meetingRoomType === 'MT100001' ? 'GEEK' : 'MELLOW';

          newArr.push({
            id: r.id,
            createUser: r.name,
            createUserId: r.createUserId,
            title: meetingRoom + ' ' + r.name + '님',
            meetingRoomType: r.meetingRoomType,
            meetingContent: r.meetingContent,
            start: moment(r.beginDate).format('YYYY-MM-DD HH:mm'),
            end: moment(r.endDate).format('YYYY-MM-DD HH:mm'),
            color: getMeetingRoomColor(r.meetingRoomType),
          });
        });
        setMeetingRoom(newArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClickMeetingRoomReservation = (item) => {
    openedModal(modals.MeetingRoomAdd, {
      props: {
        id: item.id,
        meetingRoomType: item.meetingRoomType,
        beginDate: item.beginDate,
        endDate: item.endDate,
        personnel: item.personnel,
        meetingContent: item.meetingContent,
      },
      getMeetingRoom,
    });
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Body>
            <SContents>
              <p className="text">
                <span className="geekColor">● GEEK</span>
                <span className="mellowColor"> ● MELLOW</span>
              </p>
            </SContents>
            <SContents>
              <div>
                <MeetingRoom
                  events={meetingRoom}
                  onClickMeetingRoomReservation={onClickMeetingRoomReservation}
                  getMeetingRoom={getMeetingRoom}
                />
              </div>
            </SContents>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export const getMeetingRoomColor = (meetingRoomType) => {
  let roomColor = '';
  switch (meetingRoomType) {
    case 'MT100001':
      return (roomColor = '#4C88F3');
    case 'MT100002':
      return (roomColor = '#F696D5');
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
  .text {
    text-align: right;
    margin-top: -40px;
    margin-bottom: -20px;
  }
  .geekColor {
    color: #4c88f3;
  }
  .mellowColor {
    margin-left: 15px;
    color: #f696d5;
  }
`;

export default Index;
