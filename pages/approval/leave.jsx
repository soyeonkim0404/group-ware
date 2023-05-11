import styled from 'styled-components';
import Card, { CardLayout } from '@components/ui/Card';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from '@components/ui/FormInput';
import FormSelect from '@components/ui/FormSelect';
import FormRadio from '@components/ui/FormRadio';
import Button from '@components/ui/Button';
import DataView from '@components/ui/DataView';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import _ from 'lodash';
import { apiApprovalVacation, apiCheckApproval, parallelApi } from '@api';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import Loading from '@components/ui/Loading';
import { useRouter } from 'next/router';
import DatePicker, { DatePickerPeriod } from '@components/ui/DatePicker';
import moment from 'moment';
import FileUpload from '@components/ui/FileUpload';

const Leave = ({ data }) => {
  const { openedModal } = useModals();

  const methods = useForm();

  const router = useRouter();

  const [resultFileData, setResultFileData] = useState([]);
  const [fileError, setFileError] = useState('');
  const [usage, setUsage] = useState({});
  const [vacationCategory, setVacationCategory] = useState([]);
  const [vacationType, setVacationType] = useState({});
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const [formObject, setFormObject] = useState({});

  useEffect(() => {
    setUsage(data.vacationUsage);
    setFormObject({
      vacationType: '',
      comment: '',
      startDate: '',
      endDate: '',
      usedCount: '',
      usedOption: '',
      workDate: '',
      workMinutes: '',
      delegate: [],
    });
  }, []);

  useEffect(() => {
    vacationType?.startEndDate && methods.register('startDate');
    vacationType?.startEndDate && methods.register('endDate');
    vacationType?.targetDate && methods.register('targetDate');
    vacationType?.choiceOptions?.length > 0 && methods.register('usedOption');
    vacationType?.coverWorkDate && methods.register('workDate');
    vacationType?.choiceOptions?.length === 0 && methods.register('usedCount');
    return () => {
      methods.reset({ vacationType: '' });
      methods.unregister('startDate');
      methods.unregister('endDate');
      methods.unregister('targetDate');
      methods.unregister('choiceOptions');
      methods.unregister('workDate');
      methods.unregister('usedCount');

      setFormObject((prevState) => ({
        ...prevState,
        vacationType: '',
        comment: '',
        startDate: '',
        endDate: '',
        usedCount: '',
        usedOption: '',
        workDate: '',
        workMinutes: '',
        delegate: [],
      }));
    };
  }, [vacationType]);

  const fileData = (data) => {
    setResultFileData(data);
  };

  const onChangeVacationCategory = (e) => {
    const category = data.vacationType.filter((item) => item.code === e.target.value)[0]
      ?.child;

    setVacationCategory(category);
    setVacationType('');
  };

  const onChangeVacationType = (e) => {
    const type = vacationCategory.filter((item) => item.code === e.target.value)[0];
    setVacationType(type);
  };

  const onChangeTargetDate = (value) => {
    value = moment(value).format('YYYY-MM-DD');

    setFormObject((prevState) => ({ ...prevState, startDate: value, endDate: value }));
  };

  const onChangeChoice = (e) => {
    const value = e.target.value;
    const choiceOption = vacationType.choiceOptions.find((item) => item.value === value);

    if (choiceOption !== undefined) {
      const count = choiceOption.count;

      setFormObject((prevState) => ({ ...prevState, usedCount: count }));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (!data.delegate || data.delegate?.length === 0) {
        const check = await apiCheckApproval();
        if (!check) {
          openedModal(modals.Alert, {
            text: { body: '관리자에게 문의하세요.' },
          });

          return;
        }
      }
    } catch (e) {
      if (e.data.code === 'E030') {
        openedModal(modals.ApprovalAdd, {
          title: '결재자 지정',
          onSubmit: (users) => {
            setFormObject((prevState) => ({
              ...prevState,
              delegate: users.map((user) => user.userId),
            }));
            onSubmit({ ...data, delegate: users.map((user) => user.userId) });
          },
        });
      } else {
        openedModal(modals.Alert, {
          text: { body: e.data.message },
        });
      }

      return setLoading(false);
    }

    const excludeFields = Object.keys(data).filter(
      (x) => !Object.keys(formObject).includes(x)
    );
    const omit = _.omit(data, excludeFields);
    const result = {};

    for (const key in formObject) {
      result[key] = (formObject[key] ? formObject[key] : omit[key]) || '';
    }
    if (data.delegate && data.delegate.length > 0) {
      result.delegate = data.delegate;
    }
    if (vacationType.requireAttachment && resultFileData.length <= 0) {
      setFileError('1개 이상의 파일을 등록해야 합니다.');
      return setLoading(false);
    }
    result.files = resultFileData;

    apiApprovalVacation(result)
      .then((result) => {
        openedModal(modals.Alert, {
          text: { body: '결재 신청되었습니다.' },
          resolve: () => router.push('/approval'),
        });
      })
      .catch((err) => {
        if (err.data && err.data.code === 'V000') {
          setErrorMsg(err.data.message);
          return;
        }
        const message = err.data.message || '관리자한테 문의하세요.';
        openedModal(modals.Alert, {
          text: { body: message },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <CardLayout>
        <Card col="5">
          <Card.Head>
            <Card.Title>연차정보</Card.Title>
          </Card.Head>
          <Card.Body>
            <DataView>
              <DataView.Item label="발생">{usage.grant}</DataView.Item>
              <DataView.Item label="사용">{usage.use}</DataView.Item>
              <DataView.Item label="사용 예정">{usage.useWaiting}</DataView.Item>
              <DataView.Item label="조정">{usage.modify}</DataView.Item>
              <DataView.Item label="소멸">{usage.delete}</DataView.Item>
              <DataView.Item label="총 잔여일">{usage.availableUse}</DataView.Item>
            </DataView>
          </Card.Body>
        </Card>
        <Card col="7">
          <Card.Head>
            <Card.Title>연차신청</Card.Title>
          </Card.Head>
          <Card.Body>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <SFormList>
                  <li>
                    <FormSelect
                      getSelectData={data.vacationType}
                      labelId="vacation-category"
                      selectId="vacationCategory"
                      label="항목"
                      error={errorMsg}
                      required={true}
                      onChange={onChangeVacationCategory}
                    />
                  </li>
                  <li>
                    <FormSelect
                      getSelectData={vacationCategory}
                      labelId="vacation-type"
                      selectId="vacationType"
                      label="연차 종류"
                      error={errorMsg}
                      required={true}
                      onChange={onChangeVacationType}
                    />
                  </li>
                  {vacationType?.startEndDate && (
                    <li>
                      <DatePickerPeriod
                        startDate="startDate"
                        endDate="endDate"
                        label={['시작일', '종료일']}
                        error={errorMsg}
                        require={vacationType.startEndDate}
                        setDiffDay={(day) => {
                          methods.setValue('usedCount', day);
                        }}
                        notHoliday
                      />
                    </li>
                  )}
                  {vacationType?.targetDate && (
                    <li>
                      <DatePicker
                        inputId="targetDate"
                        label="사용일"
                        error={errorMsg}
                        require={vacationType.targetDate}
                        onChange={onChangeTargetDate}
                        notHoliday
                      />
                    </li>
                  )}
                  {vacationType?.choiceOptions?.length > 0 && (
                    <li>
                      <FormRadio
                        getRadioData={vacationType.choiceOptions}
                        inputId="usedOption"
                        label="유형"
                        error={errorMsg}
                        required={vacationType.choiceRequired}
                        onChangeEvent={onChangeChoice}
                      />
                    </li>
                  )}
                  {vacationType?.coverWorkDate && (
                    <li>
                      <FormInput.Group>
                        <DatePicker
                          inputId="workDate"
                          label="근무일"
                          error={errorMsg}
                          require={vacationType.coverWorkDate}
                          maxToday
                          notHoliday
                        />
                        <FormInput
                          inputId="workMinutes"
                          type="text"
                          label="근무 시간"
                          disabled
                        />
                      </FormInput.Group>
                    </li>
                  )}
                  {vacationType?.choiceOptions?.length === 0 && (
                    <li>
                      <FormInput
                        inputId="usedCount"
                        label="휴가일수"
                        pattern={/^[0-9]+$/}
                        defaultValue={'0'}
                        error={errorMsg}
                        required={true}
                        disabled
                      />
                    </li>
                  )}
                  <li>
                    <FileUpload fileData={fileData} error={fileError} />
                  </li>
                </SFormList>
              </form>
            </FormProvider>
          </Card.Body>
        </Card>
      </CardLayout>
      <Button.Wrap>
        <Button.Group>
          <Button color="gray" size="large" link={'/approval'}>
            취소
          </Button>
          <Button
            type="submit"
            color="blue"
            size="large"
            onClick={methods.handleSubmit(onSubmit, (err) => setErrorMsg(err))}
          >
            신청
          </Button>
        </Button.Group>
        <Button.Group>
          <Button color="primary" size="large" link={`/approval`}>
            목록
          </Button>
        </Button.Group>
      </Button.Wrap>
      {loading && <Loading />}
    </>
  );
};

const SFormList = styled.ul`
  li {
    & ~ li {
      margin-top: 10px;
    }
    &:last-child {
      margin-top: 27px;
    }
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'vacationUsage',
      url: '/api/v1/vacation/select/usage',
      method: 'get',
    },
    {
      name: 'vacationType',
      url: '/api/v1/code/select/vacation/type',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);
  const data = {
    vacationUsage: response['vacationUsage'],
    vacationType: response['vacationType'],
  };

  return {
    props: { data: data },
  };
});
export default Leave;
