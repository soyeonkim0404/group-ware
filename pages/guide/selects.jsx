import Card, { CardLayout } from '@components/ui/Card';
import { useState } from 'react';
import FormInput from '@components/ui/FormInput';
import Select from '@components/ui/Select';
import FormSelect from '@components/ui/FormSelect';
import { useForm, FormProvider } from 'react-hook-form';
import { selectOption } from '@data/dummy';
import Input from '@components/ui/Input';

const Selects = () => {
  const [food, setFood] = useState('');
  const onChange = (e) => {
    setFood(e.target.value);
  };
  const isSolarOptions = [true, false];
  const methods = useForm();
  const [errorMsg, setErrorMsg] = useState({});
  return (
    <>
      <CardLayout>
        <Card>
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <Select
                getSelectData={selectOption}
                label="food"
                labelId="food-label"
                selectId="food-select"
                value={food}
                onChange={onChange}
              />
            </form>
          </Card.Body>
        </Card>
        <Card>
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <Select.Group>
                <Select
                  getSelectData={selectOption}
                  label="food"
                  labelId="food-label"
                  selectId="food-select"
                  value={food}
                  onChange={onChange}
                />
                <Select
                  getSelectData={selectOption}
                  label="food"
                  labelId="food-label"
                  selectId="food-select"
                  value={food}
                  onChange={onChange}
                />
              </Select.Group>
            </form>
          </Card.Body>
        </Card>
        <Card>
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <Select.Group>
                <Select
                  getSelectData={selectOption}
                  label="food"
                  labelId="food-label"
                  selectId="food-select"
                  value={food}
                  onChange={onChange}
                />
                <Input name="name" label="이름" />
              </Select.Group>
            </form>
          </Card.Body>
        </Card>
        <Card>
          <Card.Head>
            <Card.Title>FormSelect</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <FormProvider {...methods}>
                <FormSelect.Group>
                  <FormInput inputId="birthday" label="생일" type="date" />
                  <FormSelect
                    getSelectData={isSolarOptions}
                    labelId="status-label"
                    selectId="isSolar"
                    label="양력"
                    error={errorMsg}
                  />
                </FormSelect.Group>
              </FormProvider>
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default Selects;
