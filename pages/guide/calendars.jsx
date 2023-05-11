import Calendar from '@components/ui/Calendar';
import Card, { CardLayout } from '@components/ui/Card';
import { useState } from 'react';

const Calendars = () => {
  const [events, setEvents] = useState([]);

  return (
    <>
      <CardLayout>
        <Card>
          <Card.Body>
            <Calendar events={events} />
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default Calendars;
