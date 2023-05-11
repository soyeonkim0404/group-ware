import Card, { CardLayout } from '@components/ui/Card';
import Loading from '@components/ui/Loading';

const Loadings = () => {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="4">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
        <Card col="8">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="4">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
        <Card col="4">
          <Card.Head>
            <Card.Title>Title</Card.Title>
          </Card.Head>
          <Card.Body>Contents</Card.Body>
        </Card>
      </CardLayout>
      <Loading />
    </>
  );
};

export default Loadings;
