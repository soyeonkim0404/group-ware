import Card, { CardLayout } from '@components/ui/Card';
import Flag from '@components/ui/Flag';

const Flags = () => {
  return (
    <CardLayout>
      <Card col="12">
        <Card.Body>
          <Flag.Group>
            <Flag>default</Flag>
            <Flag.Red>red</Flag.Red>
            <Flag.Blue>blue</Flag.Blue>
            <Flag.Orange>ORANGE</Flag.Orange>
            <Flag.Green>GREEN</Flag.Green>
            <Flag.Gray>disabled</Flag.Gray>
          </Flag.Group>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

export default Flags;
