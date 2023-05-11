import Button from '@components/ui/Button';
import Card, { CardLayout } from '@components/ui/Card';
import { BiWinkSmile, BiWinkTongue, BiTired, BiSubdirectoryRight } from 'react-icons/bi';

function Buttons() {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button size="large">LARGE</Button>
            <Button>MEDIUM</Button>
            <Button size="small">SMALL</Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Outline</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button size="large" outline>
              LARGE
            </Button>
            <Button outline>MEDIUM</Button>
            <Button size="small" outline>
              SMALL
            </Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Colors</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button color="primary">PRIMARY PRIMARY</Button>
            <Button color="gray">GRAY</Button>
            <Button color="red">ERROR</Button>
            <Button color="blue">BLUE</Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Icon + Text</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button color="primary" text>
              <BiWinkSmile />
              PRIMARY PRIMARY
            </Button>
            <Button color="gray" text>
              <BiWinkTongue />
              GRAY
            </Button>
            <Button color="red" text>
              <BiTired />
              ERROR
            </Button>
            <Button color="blue" text>
              <BiSubdirectoryRight /> Log out
            </Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Icon (no text)</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button icon="80" color="lightGray">
              <BiWinkSmile />
            </Button>
            <Button icon="80" color="lightGray" link={`/employee`}>
              <BiWinkSmile />
            </Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Button Group</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button.Group>
              <Button color="primary">PRIMARY</Button>
              <Button color="gray">PRIMARY</Button>
            </Button.Group>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Disabled</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button size="large" disabled>
              Disabled
            </Button>
            <Button color="gray" disabled>
              Disabled
            </Button>
            <Button text disabled>
              <BiWinkTongue />
              Disabled
            </Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Full width</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button size="large" color="primary" fullWidth>
              PRIMARY
            </Button>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Link Button</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button.Group>
              <Button color="gray" size="large" link={`/employee`}>
                목록
              </Button>
              <Button color="blue" size="large" link={`/employee/edit?id=1`}>
                수정
              </Button>
            </Button.Group>
          </Card.Body>
        </Card>
      </CardLayout>

      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Page Button Wrap</Card.Title>
          </Card.Head>
          <Card.Body>
            <Button.Wrap>
              <Button.Group>
                <Button color="gray" size="large">
                  삭제
                </Button>
                <Button color="blue" size="large" link={`/employee/edit?id=1`}>
                  수정
                </Button>
              </Button.Group>
              <Button.Group>
                <Button color="primary" size="large" link={`/employee`}>
                  목록
                </Button>
              </Button.Group>
            </Button.Wrap>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default Buttons;
