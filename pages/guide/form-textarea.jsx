import React, { useState } from 'react';
import TextArea from '@components/ui/TextArea';
import Card, { CardLayout } from '@components/ui/Card';

const FormTextarea = () => {
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <>
      <CardLayout>
        <Card>
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <TextArea
                placeholder="텍스트를 입력하세요"
                value={value}
                rows="10"
                onChange={onChange}
              />
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default FormTextarea;
