import Card, { CardLayout } from '@components/ui/Card';
import CheckBoxGroup from '@components/ui/CheckBoxGroup';
import { checkOption, checkOption2, checkOption3 } from '@data/dummy';
import { useState } from 'react';

const InputCheckbox = () => {
  const [option, setOption] = useState(checkOption);
  const [option2, setOption2] = useState(checkOption2);
  const [option3, setOption3] = useState(checkOption3);

  console.log(option);

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Checkbox</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <CheckBoxGroup
                checkObj={option}
                setOption={(data) => {
                  setOption(data);
                }}
              ></CheckBoxGroup>
            </form>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>Checkbox: 전체선택</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <CheckBoxGroup
                checkObj={option2}
                allText="전체선택 텍스트 입력"
                setOption={(data) => {
                  setOption2(data);
                }}
              ></CheckBoxGroup>
            </form>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>Checkbox: disabled</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <CheckBoxGroup
                checkObj={option3}
                allText="전체선택"
                setOption={(data) => {
                  setOption3(data);
                }}
              ></CheckBoxGroup>
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default InputCheckbox;
