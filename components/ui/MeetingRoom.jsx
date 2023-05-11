import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed
import listPlugin from '@fullcalendar/list'; //For List View
import koLocale from '@fullcalendar/core/locales/ko';
import { useRef } from 'react';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';
import styled from 'styled-components';
import moment from 'moment';
import { getMeetingRoomColor } from 'pages/meetingroom';

const MeetingRoom = ({ events, onClickMeetingRoomReservation, getMeetingRoom }) => {
  const calendarRef = useRef(null);
  const { openedModal } = useModals();

  const fixEvents = [
    {
      title: 'GEEK 손은진님',
      meetingRoomType: 'MT100001',
      createUser: '손은진',
      meetingContent: '주간회의',
      daysOfWeek: ['1'],
      startRecur: '2023-05-15',
      startTime: '10:30:00',
      // endRecur: '2024-05-01',
      endTime: '12:30',
      color: getMeetingRoomColor('MT100001'),
    },
    {
      title: 'MELLOW 손은진님',
      meetingRoomType: 'MT100002',
      createUser: '손은진',
      meetingContent: '주간회의',
      daysOfWeek: ['1'],
      startRecur: '2023-05-15',
      startTime: '10:30:00',
      // endRecur: '2024-05-01',
      endTime: '12:30',
      color: getMeetingRoomColor('MT100002'),
    },
  ];

  const allEvents = [...events, ...fixEvents];

  return (
    <SCalender>
      <FullCalendar
        innerRef={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        locale={koLocale}
        events={allEvents}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,myButton',
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        customButtons={{
          myButton: {
            text: '예약하기',
            click: function (item) {
              onClickMeetingRoomReservation(item);
            },
          },
        }}
        // navLinks={true}
        eventClick={(info) => {
          openedModal(modals.MeetingRoomInfo, {
            props: {
              id: info.event.id,
              createUser: info.event.extendedProps.createUser,
              createUserId: info.event.extendedProps.createUserId,
              meetingRoomType: info.event.extendedProps.meetingRoomType,
              beginDate: moment(info.event.start).format('YYYY-MM-DD HH:mm'),
              endDate: moment(info.event.end).format('YYYY-MM-DD HH:mm'),
              meetingContent: info.event.extendedProps.meetingContent,
            },
            getMeetingRoom,
          });
        }}
      />
    </SCalender>
  );
};

const SCalender = styled.div`
  .fc-theme-standard {
    min-height: 1154px;
  }
  .fc-list-event-time {
    display: none;
  }
  .fc-popover {
    z-index: 10;
  }
`;

export default MeetingRoom;
