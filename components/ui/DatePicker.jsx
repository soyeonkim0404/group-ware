import styled from 'styled-components';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import { MdError, MdOutlineCalendarToday } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { loadHoliday } from '@store/modules/calendar';
import moment from 'moment';
import setHours from 'date-fns/setHours';
import getHours from 'date-fns/getHours';
import setMinutes from 'date-fns/setMinutes';
import getMinutes from 'date-fns/getMinutes';
import { parseISO } from 'date-fns';

const Group = ({ children }) => {
  return <SInputGroup>{children}</SInputGroup>;
};

const Dash = ({ children }) => {
  return <SInputDash>{children}</SInputDash>;
};

registerLocale('ko', ko);

const CustomInput = forwardRef((props, ref) => {
  const { register } = useFormContext();

  return (
    <>
      <SInputField
        id={props.inputId}
        onClick={props.onClick}
        ref={ref}
        readOnly
        hidden={props.hidden}
        disabled={props.disabled}
        className={(props.value || props.defaultValue) && 'isValue'}
        defaultValue={props.value || props.defaultValue || ''}
        {...register(props.inputId, {
          required: {
            value: props.require,
            message: `${
              props.inputId === props.startDate
                ? props.label[0]
                : props.inputId === props.endDate
                ? props.label[1]
                : props.label
            }은(는) 필수 입력값입니다.`,
          },
        })}
      />
      <SFormatDate>
        <MdOutlineCalendarToday />
      </SFormatDate>
    </>
  );
});

CustomInput.displayName = 'CustomInput';

export function DatePickerPeriod(props) {
  const { control } = useForm();
  const { setValue } = useFormContext();

  const dateRef = useRef();

  const calendar = useSelector(({ calendar }) => calendar.data);
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [diffDay, setDiffDay] = useState(0);
  const [startMinDate, setStartMinDate] = useState(props.minDate || null);
  const [endMinDate, setEndMinDate] = useState(props.maxDate || null);
  const [startMaxDate, setStartMaxDate] = useState(props.maxDate || null);
  const [endMaxDate, setEndMaxDate] = useState(props.maxDate || null);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  }, []);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    calendar.filter((o) => o.year === year - 1).length === 1 &&
      calendar.filter((o) => o.year === year).length === 1 &&
      calendar.filter((o) => o.year === year + 1).length === 1 &&
      setDisabled(false);
  }, [calendar]);

  useEffect(() => {
    if (!startDate || !endDate) {
      setDiffDay(0);
      return;
    }

    const mStartDate = moment(startDate);
    const mEndDate = moment(endDate);

    let holiday = [];
    calendar.forEach(
      (c) => (holiday = [...holiday, ...c.data.map((d) => d.locdate.toString())])
    );

    let diff = 0;
    while (mStartDate <= mEndDate) {
      const day = mStartDate.day();
      if (!holiday.includes(mStartDate.format('YYYYMMDD')) && day !== 0 && day !== 6)
        diff++;
      mStartDate.add(1, 'day');
    }
    setDiffDay(diff);
  }, [startDate, endDate]);

  useEffect(() => {
    props.setDiffDay && props.setDiffDay(diffDay);
  }, [diffDay]);

  const dispatchCalendar = (year) => {
    const holiday = calendar.filter((c) => c.year === year);

    if (
      !holiday ||
      holiday.length === 0 ||
      (Date.now() - holiday[0].version) / 1000 / 60 > 30 // API 받아온 시간이 30분을 경과헀다면
    ) {
      dispatch(loadHoliday(year));
    }
  };

  const onChangeMonth = (date) => {
    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  };

  const isDayOff = (date) => {
    const isWorkday = isHoliday(date);
    const day = date.getDay();
    return day !== 0 && day !== 6 && isWorkday;
  };

  const isHoliday = (date) => {
    if (!date) return false;

    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();
    const yyyyMMdd = koDate.toISOString().split('T')[0].replace(/-/gi, '');
    const holiday = calendar.filter((c) => c.year === year);

    return (
      holiday[0].data
        .map((o) => o.locdate.toString())
        .filter((locdate) => locdate === yyyyMMdd).length === 0
    );
  };

  return (
    <Controller
      name="datePicker"
      control={control}
      render={({ field: { onChange } }) => (
        <>
          <SInputGroup>
            <SLabelField
              htmlFor={props.startDate}
              hidden={props.hidden}
              onChange={onChange}
              className={(startDate || props.defaultValue) && 'isValue'}
            >
              <>
                <DatePicker
                  locale={ko}
                  inputId={props.startDate}
                  selected={startDate}
                  onChange={(date, event) => {
                    let formDate = '';
                    if (date) {
                      formDate = moment(date).format('YYYY-MM-DD');
                    }

                    setStartDate(date);
                    setValue(props.startDate, formDate);
                    setEndMinDate(date);
                    event.preventDefault();
                  }}
                  isClearable={startDate}
                  closeOnScroll={true}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy-MM-dd"
                  minDate={startMinDate}
                  maxDate={startMaxDate}
                  customInput={
                    <CustomInput {...props} ref={dateRef} inputId={props.startDate} />
                  }
                  filterDate={(date) => (props.notHoliday ? isDayOff(date) : true)}
                  onMonthChange={onChangeMonth}
                  disabled={disabled}
                />
                {props.label[0] && (
                  <SLabelTxt className="label">{props.label[0]}</SLabelTxt>
                )}
                {props.error[props.startDate] &&
                  (props.error[props.startDate].message ? (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.startDate].message}</span>
                    </SErrorMsg>
                  ) : (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.startDate][0]}</span>
                    </SErrorMsg>
                  ))}
              </>
            </SLabelField>
            <SInputDash />
            <SLabelField
              htmlFor={props.endDate}
              hidden={props.hidden}
              onChange={onChange}
              className={(endDate || props.defaultValue) && 'isValue'}
            >
              <>
                <DatePicker
                  locale={ko}
                  inputId={props.endDate}
                  selected={endDate}
                  onChange={(date, event) => {
                    let formDate = '';
                    if (date) {
                      formDate = moment(date).format('YYYY-MM-DD');
                    }
                    setEndDate(date);
                    setValue(props.endDate, formDate);

                    event.preventDefault();
                  }}
                  isClearable={endDate}
                  closeOnScroll={true}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy-MM-dd"
                  minDate={endMinDate}
                  maxDate={endMaxDate}
                  customInput={
                    <CustomInput {...props} ref={dateRef} inputId={props.endDate} />
                  }
                  filterDate={(date) => (props.notHoliday ? isDayOff(date) : true)}
                  onMonthChange={onChangeMonth}
                  disabled={disabled}
                />
                {props.label[1] && (
                  <SLabelTxt className="label">{props.label[1]}</SLabelTxt>
                )}
                {props.error[props.endDate] &&
                  (props.error[props.endDate].message ? (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.endDate].message}</span>
                    </SErrorMsg>
                  ) : (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.endDate][0]}</span>
                    </SErrorMsg>
                  ))}
              </>
            </SLabelField>
          </SInputGroup>
        </>
      )}
    />
  );
}

function FormDatePicker(props) {
  const { control } = useForm();
  const { setValue } = useFormContext();
  const [dateValue, setDateValue] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const dateRef = useRef();

  const calendar = useSelector(({ calendar }) => calendar.data);
  const dispatch = useDispatch();

  const dispatchCalendar = (year) => {
    const holiday = calendar.filter((c) => c.year === year);

    if (
      !holiday ||
      holiday.length === 0 ||
      (Date.now() - holiday[0].version) / 1000 / 60 > 30 // API 받아온 시간이 30분을 경과헀다면
    ) {
      dispatch(loadHoliday(year));
    }
  };

  const onChangeMonth = (date) => {
    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  };

  const isDayOff = (date) => {
    const isWorkday = isHoliday(date);
    const day = date.getDay();
    return day !== 0 && day !== 6 && isWorkday;
  };

  const isHoliday = (date) => {
    if (!date) return false;

    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();
    const yyyyMMdd = koDate.toISOString().split('T')[0].replace(/-/gi, '');
    const holiday = calendar.filter((c) => c.year === year);

    return (
      holiday[0].data
        .map((o) => o.locdate.toString())
        .filter((locdate) => locdate === yyyyMMdd).length === 0
    );
  };

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  }, []);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    calendar.filter((o) => o.year === year - 1).length === 1 &&
      calendar.filter((o) => o.year === year).length === 1 &&
      calendar.filter((o) => o.year === year + 1).length === 1 &&
      setDisabled(false);
  }, [calendar]);

  return (
    <Controller
      name="datePicker"
      control={control}
      render={({ field: { onChange } }) => (
        <SLabelField
          htmlFor={props.inputId}
          hidden={props.hidden}
          onChange={onChange}
          className={(dateValue || props.defaultValue) && 'isValue'}
        >
          <>
            <DatePicker
              locale={ko}
              selected={dateValue}
              onChange={(date, event) => {
                let formDate = '';
                if (date) {
                  formDate = moment(date).format('YYYY-MM-DD');
                }
                setDateValue(date);
                setValue(props.inputId, formDate);

                props.onChange && props.onChange(date);
                event.preventDefault();
              }}
              isClearable={dateValue}
              closeOnScroll={true}
              dateFormat="yyyy-MM-dd"
              minDate={props.minToday && new Date()}
              maxDate={props.maxToday && new Date()}
              customInput={<CustomInput {...props} ref={dateRef} />}
              filterDate={(date) => (props.notHoliday ? isDayOff(date) : true)}
              onMonthChange={onChangeMonth}
              disabled={disabled}
            />
            {props.label && <SLabelTxt className="label">{props.label}</SLabelTxt>}
            {props.error[props.inputId] &&
              (props.error[props.inputId].message ? (
                <SErrorMsg>
                  <MdError />
                  <span>{props.error[props.inputId].message}</span>
                </SErrorMsg>
              ) : (
                <SErrorMsg>
                  <MdError />
                  <span>{props.error[props.inputId][0]}</span>
                </SErrorMsg>
              ))}
          </>
        </SLabelField>
      )}
    />
  );
}

export const FormDatePickerPeriod = (props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { control } = useForm();
  const { register, setValue } = useFormContext();
  const [disabled, setDisabled] = useState(true);

  const [startMinDate, setStartMinDate] = useState('');
  const [endMinDate, setEndMinDate] = useState('');
  const [startMaxDate, setStartMaxDate] = useState(props.maxDate || null);
  const [endMaxDate, setEndMaxDate] = useState('');

  const [beginDefaultDate, setBeginDefaultDate] = useState(
    props.defaultValue ? props.defaultValue[0] : ''
  );

  const [endDefaultDate, setEndDefaultDate] = useState(
    props.defaultValue ? props.defaultValue[1] : ''
  );

  const startFilterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const endFilterPassedTime = (time) => {
    const dayOfWeek = startDate && startDate.getDay();

    if (dayOfWeek === 1) {
      if (startDate.getHours() >= 8 && startDate.getHours() < 10) {
        return time.getHours() < 12;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const dateRef = useRef();

  const calendar = useSelector(({ calendar }) => calendar.data);
  const dispatch = useDispatch();

  const dispatchCalendar = (year) => {
    const holiday = calendar.filter((c) => c.year === year);

    if (
      !holiday ||
      holiday.length === 0 ||
      (Date.now() - holiday[0].version) / 1000 / 60 > 30 // API 받아온 시간이 30분을 경과헀다면
    ) {
      dispatch(loadHoliday(year));
    }
  };

  const onChangeMonth = (date) => {
    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  };

  const isDayOff = (date) => {
    const isWorkday = isHoliday(date);
    const day = date.getDay();
    return day !== 0 && day !== 6 && isWorkday;
  };

  const isHoliday = (date) => {
    if (!date) return false;

    const offset = date.getTimezoneOffset();
    const koDate = new Date(date.getTime() - offset * 60 * 1000);
    const year = koDate.getFullYear();
    const yyyyMMdd = koDate.toISOString().split('T')[0].replace(/-/gi, '');
    const holiday = calendar.filter((c) => c.year === year);

    return (
      holiday[0].data
        .map((o) => o.locdate.toString())
        .filter((locdate) => locdate === yyyyMMdd).length === 0
    );
  };

  const mondayStart = [
    setHours(
      setMinutes(parseISO(new Date()), getMinutes(parseISO(endDate))),
      getHours(parseISO(endDate))
    ),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 30), 10)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 0), 11)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 30), 11)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 0), 12)
      : setHours(setMinutes(new Date(), 59), 23),
  ];

  const mondayEnd = [
    setHours(
      setMinutes(parseISO(new Date()), getMinutes(parseISO(startDate))),
      getHours(parseISO(startDate))
    ),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 0), 11)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 30), 11)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 0), 12)
      : setHours(setMinutes(new Date(), 59), 23),
    startDate && startDate.getDay() === 1
      ? setHours(setMinutes(new Date(), 30), 12)
      : setHours(setMinutes(new Date(), 59), 23),
  ];

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    dispatchCalendar(year - 1);
    dispatchCalendar(year);
    dispatchCalendar(year + 1);
  }, []);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();

    calendar.filter((o) => o.year === year - 1).length === 1 &&
      calendar.filter((o) => o.year === year).length === 1 &&
      calendar.filter((o) => o.year === year + 1).length === 1 &&
      setDisabled(false);
  }, [calendar]);

  useEffect(() => {
    setValue(props.startDate, '');
    setValue(props.endDate, '');
  }, [props.defaultDate]);

  return (
    <Controller
      name="datePicker"
      control={control}
      render={({ field: { onChange } }) => (
        <>
          <SDivField
            htmlFor={props.startDate}
            hidden={props.hidden}
            onChange={onChange}
            className={(startDate || props.defaultValue) && 'isValue'}
          >
            <>
              <DatePicker
                locale={ko}
                inputId={props.startDate}
                value={beginDefaultDate}
                selected={startDate}
                onChange={(date) => {
                  let formDate = '';
                  if (date) {
                    formDate = moment(date).format('YYYY-MM-DD HH:mm');
                  }
                  setStartDate(date);
                  setValue(props.startDate, formDate);
                  setEndMinDate(date);
                  setEndMaxDate(moment(formDate).format('YYYY-MM-DD'));
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                isClearable={startDate}
                closeOnScroll={true}
                selectsStart
                filterTime={startFilterPassedTime}
                minDate={startMinDate}
                maxDate={startMaxDate}
                minTime={setHours(setMinutes(new Date(), 0), 8)}
                maxTime={endDate ? endDate : setHours(setMinutes(new Date(), 59), 23)}
                customInput={
                  <CustomInput {...props} ref={dateRef} inputId={props.startDate} />
                }
                filterDate={(date) => (props.notHoliday ? isDayOff(date) : true)}
                onMonthChange={onChangeMonth}
                excludeTimes={mondayStart}
                dateFormat="yyyy-MM-dd HH:mm"
                disabled={disabled}
              />
              {props.label[0] && (
                <SLabelTxt className="label">{props.label[0]}</SLabelTxt>
              )}
              {props.error[props.startDate] &&
                (props.error[props.startDate].message ? (
                  <SErrorMsg>
                    <MdError />
                    <span>{props.error[props.startDate].message}</span>
                  </SErrorMsg>
                ) : (
                  <SErrorMsg>
                    <MdError />
                    <span>{props.error[props.startDate][0]}</span>
                  </SErrorMsg>
                ))}
            </>
          </SDivField>
          <>
            <SDivField
              htmlFor={props.endDate}
              hidden={props.hidden}
              onChange={onChange}
              className={(endDate || props.defaultValue) && 'isValue'}
            >
              <>
                <DatePicker
                  locale={ko}
                  inputId={props.endDate}
                  value={endDefaultDate}
                  selected={endDate}
                  onChange={(date) => {
                    let formDate = '';
                    if (date) {
                      formDate = moment(date).format('YYYY-MM-DD HH:mm');
                    }

                    setEndDate(date);
                    setValue(props.endDate, formDate);
                    setStartMaxDate(date);
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  isClearable={endDate}
                  closeOnScroll={true}
                  selectsStart
                  openToDate={endMinDate}
                  minDate={endMinDate}
                  maxDate={new Date(endMaxDate)}
                  filterTime={endFilterPassedTime}
                  minTime={startDate && startDate.setMinutes(startDate.getMinutes() + 30)}
                  maxTime={setHours(setMinutes(new Date(), 59), 23)}
                  customInput={
                    <CustomInput {...props} ref={dateRef} inputId={props.endDate} />
                  }
                  filterDate={(date) => (props.notHoliday ? isDayOff(date) : true)}
                  onMonthChange={onChangeMonth}
                  excludeTimes={mondayEnd}
                  dateFormat="yyyy-MM-dd HH:mm"
                  disabled={disabled}
                />
                {props.label[1] && (
                  <SLabelTxt className="label">{props.label[1]}</SLabelTxt>
                )}
                {props.error[props.endDate] &&
                  (props.error[props.endDate].message ? (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.endDate].message}</span>
                    </SErrorMsg>
                  ) : (
                    <SErrorMsg>
                      <MdError />
                      <span>{props.error[props.endDate][0]}</span>
                    </SErrorMsg>
                  ))}
              </>
            </SDivField>
          </>
        </>
      )}
    />
  );
};

FormDatePicker.defaultProps = {
  type: 'text',
  error: {},
  required: false,
};

FormDatePicker.Group = Group;
FormDatePicker.Dash = Dash;

DatePickerPeriod.defaultProps = {
  type: 'text',
  error: {},
  required: false,
};

FormDatePickerPeriod.defaultProps = {
  // type: 'text',
  error: {},
  required: false,
};

const SLabelField = styled.label`
  position: relative;
  display: ${(props) => (props.hidden ? 'hidden' : 'block')};
  width: 100%;
  max-width: 100%;
  max-height: 80px;
  padding-bottom: 24px;
  box-sizing: border-box;
  & + & {
    margin-left: 20px;
  }
  .select + & {
    margin-left: 20px;
    .mobile & {
      margin-left: 0;
    }
  }
  .mobile & {
    max-width: 100%;
  }

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-border-radius: 0;
    width: 100%;
    border: 0;
    font-family: inherit;
    border-radius: 0;
    padding: 17px 0 5px 0;
    height: 56px;
    font-size: 16px;
    font-weight: 500;
    background: transparent;
    border-bottom: 2px solid ${(p) => p.theme.gray60};
    color: ${(p) => p.theme.black};
    transition: all 0.15s ease;
    box-sizing: border-box;

    &::placeholder {
      color: ${(p) => p.theme.gray60};
    }

    &:hover {
      border-bottom: 2px solid ${(p) => p.theme.gray40};
    }

    &:placeholder-shown,
    &.isValue,
    &:-webkit-autofill {
      & ~ .label {
        color: ${(p) => p.theme.gray40};
        transform: translateY(-20px) scale(0.75);
      }
    }
    &:focus {
      outline: none;
      border-bottom: 2px solid ${(p) => p.theme.blue};

      & ~ .label {
        color: ${(p) => p.theme.blue};
        transform: translateY(-20px) scale(0.75);
      }
    }

    &:disabled {
      border-bottom: 2px dotted ${(p) => p.theme.gray70};

      & + span {
        color: ${(p) => p.theme.gray60};
      }
    }
  }
  &.isValue {
    .label {
      color: ${(p) => p.theme.blue};
      transform: translateY(-20px) scale(0.75);
    }
  }

  .holiday {
    color: #f00;
    font-weight: bold;
  }
`;

const SDivField = styled.div`
  position: relative;
  display: ${(props) => (props.hidden ? 'hidden' : 'block')};
  width: 100%;
  max-width: 100%;
  max-height: 80px;
  padding-bottom: 24px;
  box-sizing: border-box;
  & + & {
    margin-left: 20px;
  }
  .select + & {
    margin-left: 20px;
    .mobile & {
      margin-left: 0;
    }
  }
  .mobile & {
    max-width: 100%;
  }

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-border-radius: 0;
    width: 100%;
    border: 0;
    font-family: inherit;
    border-radius: 0;
    padding: 17px 0 5px 0;
    height: 56px;
    font-size: 16px;
    font-weight: 500;
    background: transparent;
    border-bottom: 2px solid ${(p) => p.theme.gray60};
    color: ${(p) => p.theme.black};
    transition: all 0.15s ease;
    box-sizing: border-box;

    &::placeholder {
      color: ${(p) => p.theme.gray60};
    }

    &:hover {
      border-bottom: 2px solid ${(p) => p.theme.gray40};
    }

    &:placeholder-shown,
    &.isValue,
    &:-webkit-autofill {
      & ~ .label {
        color: ${(p) => p.theme.gray40};
        transform: translateY(-20px) scale(0.75);
      }
    }
    &:focus {
      outline: none;
      border-bottom: 2px solid ${(p) => p.theme.blue};

      & ~ .label {
        color: ${(p) => p.theme.blue};
        transform: translateY(-20px) scale(0.75);
      }
    }

    &:disabled {
      border-bottom: 2px dotted ${(p) => p.theme.gray70};

      & + span {
        color: ${(p) => p.theme.gray60};
      }
    }
  }
  &.isValue {
    .label {
      color: ${(p) => p.theme.blue};
      transform: translateY(-20px) scale(0.75);
    }
  }

  .holiday {
    color: #f00;
    font-weight: bold;
  }
`;

const SInputField = styled.input.attrs(() => ({ autocomplete: 'off' }))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-border-radius: 0;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  border: 0;
  border-bottom: 2px solid ${(p) => p.theme.gray60};
  border-radius: 0;
  padding: 17px 0 5px 0;
  background: none;
  font-family: inherit;
  font-weight: 500;
  font-size: 0;
  color: #fff;
  transition: all 0.15s ease;
  cursor: pointer;
  &::-webkit-datetime-edit,
  &::-webkit-inner-spin-button,
  &::-webkit-clear-button {
    display: none;
  }
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  &::-webkit-date-and-time-value {
    text-align: left;
  }

  &::placeholder {
    color: ${(p) => p.theme.gray60};
  }

  &:hover {
    border-bottom: 2px solid ${(p) => p.theme.gray40};
  }

  &:placeholder-shown,
  &.isValue,
  &:-webkit-autofill {
    & ~ .label {
      color: ${(p) => p.theme.gray40};
      transform: translateY(-20px) scale(0.75);
    }
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid ${(p) => p.theme.blue};

    & ~ .label {
      color: ${(p) => p.theme.blue};
      transform: translateY(-20px) scale(0.75);
    }
  }

  &:disabled {
    border-bottom: 2px dotted ${(p) => p.theme.gray70};

    & + span {
      color: ${(p) => p.theme.gray60};
    }
  }
`;

const SLabelTxt = styled.span`
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 16px;
  color: ${(p) => p.theme.gray40};
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
  pointer-events: none;
`;

const SErrorMsg = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 12px;
  color: ${(p) => p.theme.red};
  svg {
    margin-right: 2px;
  }
`;

const SInputGroup = styled.div`
  display: flex;
  align-items: center;
  label {
    & + label {
      margin-left: 20px;
    }
    & + button,
    & + a {
      flex: 1 0 auto;
      height: 56px;
      margin: 0 0 24px 20px;
    }
  }
  .mobile & {
    flex-direction: column;
    align-items: flex-start;
    label {
      max-width: 100%;
      & + label {
        margin-left: 0;
      }
    }
  }
`;

const SInputDash = styled.span`
  display: inline-flex;
  align-items: center;
  margin: -10px 20px 0 20px;
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 2px;
    background-color: ${(p) => p.theme.gray50};
  }
  .mobile & {
    display: none;
  }
`;

const SFormatDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 17px 0 5px 0;
  font-size: 16px;
  font-weight: 500;
  background: none;
  color: ${(p) => p.theme.black};
  svg {
    margin-left: auto;
    padding: 10px;
  }
  input:disabled ~ & {
    color: ${(p) => p.theme.gray60};
  }
`;

export default FormDatePicker;
