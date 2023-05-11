import Card, { CardLayout } from '@components/ui/Card';
import DatePicker, { DatePickerPeriod } from '@components/ui/DatePicker';
import Button from '@components/ui/Button';
import { useForm, FormProvider } from 'react-hook-form';

const DatePickers = () => {
  const methods = useForm();
  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <>
      <CardLayout>
        <FormProvider {...methods}>
          <Card col="12">
            <Card.Head>
              <Card.Title>Date</Card.Title>
            </Card.Head>
            <Card.Body>
              <DatePicker inputId="birthday" label="생일" required />
              <Button.Group>
                <Button
                  type="submit"
                  color="blue"
                  size="large"
                  onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
                >
                  등록
                </Button>
              </Button.Group>
            </Card.Body>
          </Card>
          <Card col="6">
            <Card.Head>
              <Card.Title>날짜 (특정일 이후부터 선택 가능)</Card.Title>
            </Card.Head>
            <Card.Body>
              <DatePicker.Group>
                <DatePicker inputId="vacationDate" label="휴가일" required minToday />
              </DatePicker.Group>
              <Button.Group>
                <Button
                  type="submit"
                  color="blue"
                  size="large"
                  onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
                >
                  등록
                </Button>
              </Button.Group>
            </Card.Body>
          </Card>
          <Card col="6">
            <Card.Head>
              <Card.Title>날짜 (특정일 이전까지 선택 가능)</Card.Title>
            </Card.Head>
            <Card.Body>
              <DatePicker.Group>
                <DatePicker inputId="contractDate" label="계약일" required maxToday />
              </DatePicker.Group>
              <Button.Group>
                <Button
                  type="submit"
                  color="blue"
                  size="large"
                  onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
                >
                  등록
                </Button>
              </Button.Group>
            </Card.Body>
          </Card>
          <Card col="6">
            <Card.Head>
              <Card.Title>기간: (특정일 이후부터 선택 가능)</Card.Title>
            </Card.Head>
            <Card.Body>
              <DatePickerPeriod
                startDate="startDate"
                endDate="endDate"
                label={['시작일', '종료일']}
                minDate={new Date()}
                required
              />
              <Button.Group>
                <Button
                  type="submit"
                  color="blue"
                  size="large"
                  onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
                >
                  등록
                </Button>
              </Button.Group>
            </Card.Body>
          </Card>
          <Card col="6">
            <Card.Head>
              <Card.Title>기간: (특정일 이전까지 선택 가능)</Card.Title>
            </Card.Head>
            <Card.Body>
              <DatePickerPeriod
                startDate="startDate1"
                endDate="endDate1"
                label={['시작일', '종료일']}
                maxDate={new Date()}
                required
              />
              <Button.Group>
                <Button
                  type="submit"
                  color="blue"
                  size="large"
                  onClick={methods.handleSubmit(onSubmit, (err) => console.log(err))}
                >
                  등록
                </Button>
              </Button.Group>
            </Card.Body>
          </Card>
        </FormProvider>
      </CardLayout>
    </>
  );
};

export default DatePickers;
