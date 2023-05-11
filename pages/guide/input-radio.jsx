import Card, { CardLayout } from '@components/ui/Card';
import { inputOption } from '@data/dummy';
import Radio from '@components/ui/Radio';
import { useState } from 'react';

const InputRadio = () => {
  const [option, setOption] = useState('');
  const onChange = (e) => {
    setOption(e.target.value);
  };
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Radio</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              {inputOption.map((item) => (
                <Radio
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  value={item.id}
                  name={'users'}
                  onChange={onChange}
                  checked={option === item.id}
                  disabled={item.disabled}
                />
              ))}
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default InputRadio;
