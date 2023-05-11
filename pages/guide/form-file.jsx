import FileUpload from '@components/ui/FileUpload';
import Card, { CardLayout } from '@components/ui/Card';
import ImageFileUpload from '@components/ui/ImageFileUpload';
import ProfileImage from '@components/ui/ProfileImage';

const FormFile = () => {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <FileUpload />
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Image File</Card.Title>
          </Card.Head>
          <Card.Body>
            <ImageFileUpload />
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Profile</Card.Title>
          </Card.Head>
          <Card.Body>
            <ProfileImage size="200" />
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default FormFile;
