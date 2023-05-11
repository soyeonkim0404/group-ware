import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed
import listPlugin from '@fullcalendar/list'; //For List View
import koLocale from '@fullcalendar/core/locales/ko';
import { useRef } from 'react';
import styled from 'styled-components';

const Calendar = ({ events }) => {
  const calendarRef = useRef(null);
  return (
    <SCalender>
      <FullCalendar
        innerRef={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        locale={koLocale}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek',
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
`;

export default Calendar;
