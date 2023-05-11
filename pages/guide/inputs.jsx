import Input from '@components/ui/Input';
import FormInput from '@components/ui/FormInput';
import AutoFormInput from '@components/ui/AutoFormInput';
import Card, { CardLayout } from '@components/ui/Card';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import moment from 'moment';
import Button from '@components/ui/Button';

const Inputs = () => {
  const [inputName, setInputName] = useState('');
  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');
  const [inputPnum, setInputPnum] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchData, setSearchData] = useState('');
  const onChange = (e) => {
    setInputName(e.target.value);
  };
  const onChangeId = (e) => {
    setInputId(e.target.value);
  };
  const onChangePw = (e) => {
    setInputPw(e.target.value);
  };
  const onChangePnum = (e) => {
    setInputPnum(e.target.value);
  };
  const onChangeText = (e) => {
    setInputText(e.target.value);
  };
  const onChangePrice = (e) => {
    setInputPrice(e.target.value);
  };
  const onChangeStartDate = (e) => {
    setStartDate(moment(e.target.value).format('YYYY-MM-DD'));
  };
  const onChangeEndDate = (e) => {
    setEndDate(moment(e.target.value).format('YYYY-MM-DD'));
  };
  const onChangeSearch = (e) => {
    setSearchData(e.target.value);
  };
  const methods = useForm();
  const [errorMsg, setErrorMsg] = useState({});
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <Input name="name" label="이름" value={inputName} onChange={onChange} />
            </form>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>Disabled</Card.Title>
          </Card.Head>
          <Card.Body>
            <Input name="address" label="주소" disabled />
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>Flex Column 2단</Card.Title>
          </Card.Head>
          <Card.Body>
            <Input.Group>
              <Input name="id" label="id" value={inputId} onChange={onChangeId} />
              <Input
                name="password"
                label="password"
                value={inputPw}
                onChange={onChangePw}
              />
            </Input.Group>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>Flex Column 3단</Card.Title>
          </Card.Head>
          <Card.Body>
            <Input.Group>
              <Input
                name="project"
                label="project"
                value={inputText}
                error={''}
                placeholder="placeholder test"
                onChange={onChangeText}
              />
              <Input
                name="price"
                type="number"
                label="price"
                value={inputPrice}
                onChange={onChangePrice}
              />
              <Input
                name="phone"
                type="number"
                label="phone"
                placeholder="핸드폰 번호를 입력하세요"
                value={inputPnum}
                onChange={onChangePnum}
              />
            </Input.Group>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>input-date</Card.Title>
          </Card.Head>
          <Card.Body>
            <Input.Group>
              <Input
                name="schedule-start"
                type="date"
                label="start date"
                value={startDate}
                formatDate={startDate}
                onChange={onChangeStartDate}
              />
              <Input.Dash />
              <Input
                name="schedule-end"
                type="date"
                label="end date"
                value={endDate}
                formatDate={endDate}
                onChange={onChangeEndDate}
              />
            </Input.Group>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>input-search</Card.Title>
          </Card.Head>
          <Card.Body>
            <Input
              name="search"
              type="search"
              value={searchData}
              onChange={onChangeSearch}
            />
            <Button color="primary">검색</Button>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>FormInput</Card.Title>
          </Card.Head>
          <Card.Body>
            <FormProvider {...methods}>
              <FormInput.Group>
                <FormInput inputId="email" label="이메일" byte={255} error={errorMsg} />
                <FormInput
                  inputId="password"
                  label="비밀번호"
                  type="password"
                  byte={255}
                  error={errorMsg}
                />
              </FormInput.Group>
            </FormProvider>
          </Card.Body>
        </Card>

        <Card col="12">
          <Card.Head>
            <Card.Title>FormInput TEST</Card.Title>
          </Card.Head>
          <Card.Body>
            <FormProvider {...methods}>
              <AutoFormInput
                inputId="person"
                label="구성원"
                byte={255}
                error={errorMsg}
              />
            </FormProvider>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default Inputs;
