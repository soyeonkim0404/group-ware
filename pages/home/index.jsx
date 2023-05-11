import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import Button from '@components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import Flag from '@components/ui/Flag';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { apiGetCommute, apiGetDashboard } from '@api';
import { modals } from '@components/ui/modals';
import useModals from '@lib/hooks/useModals';
import { MdArrowRightAlt } from 'react-icons/md';
import { useRouter } from 'next/router';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Home = () => {
  const router = useRouter();

  const [dateState, setDateState] = useState(moment(new Date()).format('A hh:mm:ss'));
  const [dashboardData, setDashboardData] = useState({
    newUser: [],
    homeWorkUser: [],
    vacationUser: [],
    approvalInfo: {
      approval: 0,
      complete: 0,
      returned: 0,
      waited: 0,
    },
    notice: [],
  });
  const [commuteTime, setCommuteTime] = useState({
    workOnDatetime: null,
    workOffDatetime: null,
    vacation: null, //all:연차 / am,pm:오전반차,오후반차 / null:출근
  });

  const profile = useSelector(({ profile }) => profile);

  useEffect(() => {
    getCommute();
    getDashboard();
  }, []);

  /*출퇴근 조회 api*/
  const getCommute = () => {
    apiGetCommute()
      .then((res) => {
        setCommuteTime(res);
      })
      .catch((err) => console.error(err));
  };

  /*대시보드 조회 api*/
  const getDashboard = () => {
    apiGetDashboard()
      .then((res) => {
        setDashboardData(res);
      })
      .catch((err) => console.error(err));
  };

  const detailClick = (dashboardApprovalStatus) => {
    router.push(
      {
        pathname: `/approval`,
        query: {
          dashboardApprovalStatus: dashboardApprovalStatus,
        },
      },
      `/approval`
    );
  };

  const noticeSettings = {
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    pauseOnHover: true,
    draggable: true,
    touchMove: true,
  };
  const employeeSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    pauseOnHover: true,
    draggable: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          initialSlide: 0,
        },
      },
    ],
  };
  /*const homeWorkerSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    speed: 1000,
    autoplay: true,
    draggable: true,
    touchMove: true,
  };

  const holidayWorkerSettings = {
    swipe: true,
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    speed: 1000,
    autoplay: true,
    draggable: true,
    touchMove: true,
    swipeToSlide: true,
  };*/

  /*현재시간*/
  let date = new Date();
  let hours = date.getHours();

  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  let today = year + '-' + month + '-' + day;
  let yesterday = year + '-' + month + '-' + (day - 1);
  /*출근시간*/
  let todayCommuteTime =
    (hours < 5 ? yesterday : today) + ' ' + commuteTime.workOnDatetime;

  /*유저가 클릭한 퇴근 시간*/
  let userEndCommuteTime = today + ' ' + commuteTime.workOffDatetime;
  let userEndTime = new Date(userEndCommuteTime);
  let userEndTimeMilli = Number(userEndTime);

  /*정상 출근 시 시간*/
  const startTime = new Date(todayCommuteTime);
  const startTimeMilli = Number(startTime);
  const endTime = startTime.setHours(startTime.getHours() + 9);
  const totalTimeSec = endTime - startTimeMilli;

  /*반차 일 경우 시간 계산*/
  const startHalfTime = new Date(todayCommuteTime);
  const startHalfTimeMilli = Number(startHalfTime);
  const endHalfTime = startHalfTime.setHours(startHalfTime.getHours() + 4);
  const totalHalfTimeSec = endHalfTime - startHalfTimeMilli;
  const currentTimeSec = Number(date) - startHalfTimeMilli;

  const percentNumber =
    commuteTime.vacation !== null
      ? parseInt((currentTimeSec / totalHalfTimeSec) * 100)
      : parseInt((currentTimeSec / totalTimeSec) * 100);

  const chartOption = {
    chart: {
      height: 300,
      type: 'radialBar',
    },
    series: [percentNumber],
    colors: ['#f03e3e'],
    plotOptions: {
      radialBar: {
        startAngle: -110,
        endAngle: 110,
        hollow: {
          margin: 0,
          size: '70%', //bar 굵기
          background: 'transparent',
        },
        track: {
          background: '#e9ecef',
          startAngle: -110,
          endAngle: 110,
        },
        dataLabels: {
          name: {
            offsetY: -20,
            fontSize: '40px',
            show: true,
          },
          value: {
            color: '#868e96',
            fontSize: '40px',
            fontWeight: 'bold',
            show: true,
            fontFamily: 'Noto Sans KR',
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [percentNumber >= 100 ? '😱' : '😍'],
  };

  // 모달 훅
  const { openedModal } = useModals();
  // 출근 모달
  const openWorkOnModal = () => {
    openedModal(modals.WorkOn, {
      closeButton: true,
      size: 'sm',
      text: {},
      onSubmit: () => {
        getCommute();
        getDashboard();
      },
    });
  };

  // 퇴근 모달
  const openWorkOffModal = () => {
    if (chartOption.series[0] < 100) {
      openedModal(modals.Alert, {
        text: { body: '퇴근시간이 아닙니다' },
      });
    } else {
      openedModal(modals.WorkOff, {
        closeButton: true,
        size: 'sm',
        text: {},
        onSubmit: () => {
          getCommute();
          getDashboard();
        },
      });
    }
  };

  /*현재시간 불러오기*/
  useEffect(() => {
    setInterval(() => setDateState(moment(new Date()).format('A hh:mm:ss')), 1000);
  }, []);

  return (
    <>
      <CardLayout>
        <Card col="4" type="clean">
          <Card.Body>
            <SHello>
              <h2>
                {profile.name}님 😃
                <br /> 안녕하세요!
              </h2>
              <SNotice>
                <Slider {...noticeSettings} arrows={false}>
                  {dashboardData.notice &&
                    dashboardData.notice.map((item) => (
                      <div key={item.id}>
                        <div className="item">
                          <Flag.Red>공지</Flag.Red>
                          <Link href={`/board/notice/view?id=${item.id}`}>
                            <a>{item.title}</a>
                          </Link>
                        </div>
                      </div>
                    ))}
                </Slider>
              </SNotice>
              <button
                className={commuteTime.workOnDatetime ? 'work on disabled' : 'work on'}
                onClick={openWorkOnModal}
                disabled={commuteTime.workOnDatetime}
              >
                {commuteTime.workOnDatetime ? '출근 완 👍🏻' : '활기차게 출근하기'}
              </button>
              <button
                className={
                  commuteTime.workOnDatetime === null ? 'work off disabled' : 'work off'
                }
                onClick={openWorkOffModal}
                disabled={commuteTime.workOnDatetime === null}
              >
                {commuteTime.workOffDatetime ? '수고하셨습니다' : '신명나게 퇴근하기'}
              </button>
            </SHello>
          </Card.Body>
        </Card>
        <Card col="8">
          <Card.Head>
            <Card.Title>신규입사자 환영합니다😍</Card.Title>
          </Card.Head>
          <Card.Body>
            <SNewProfileList>
              <Slider {...employeeSettings} arrows={false}>
                {dashboardData.newUser &&
                  dashboardData.newUser.map((item) => (
                    <div className="profile" key={item.id}>
                      <div className="inner">
                        <div className="img">
                          <Image
                            src={item.profile ? item.profile : '/static/img/noImg.svg'}
                            alt="profile-img"
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className="user">
                          <div className="info">
                            <span className="team">{item.organization}</span>
                            <span className="name">{item.name}님</span>
                            <span className="position">{item.grade}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>
            </SNewProfileList>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="4">
          <Card.Head>
            <Card.Title>퇴근시간은??</Card.Title>
          </Card.Head>
          <Card.Body>
            <SChart>
              {commuteTime.workOnDatetime &&
              commuteTime.vacaiton !== null &&
              commuteTime.workOffDatetime === null ? (
                <ApexChart
                  options={chartOption}
                  series={chartOption.series}
                  type={chartOption.chart.type}
                  height={chartOption.chart.height}
                  className={'chart'}
                />
              ) : (
                <SNoData>
                  <Image
                    src={`/static/img/chart-no-data.png`}
                    alt="profile-img"
                    width={424}
                    height={250}
                    className={'img'}
                  />
                </SNoData>
              )}
              <span className={'current-time'}>{dateState}</span>
            </SChart>
          </Card.Body>
        </Card>
        <Card col="8">
          <Card.Head>
            <Card.Title>전자결재 현황</Card.Title>
          </Card.Head>
          <Card.Body>
            <SBtnContents>
              <div className={'con'}>
                <div className={'img'}>
                  <Image
                    src={`/static/img/ic-doc-apply.svg`}
                    alt="icon"
                    width={30}
                    height={30}
                    className={'icon'}
                  />
                </div>
                <div className={'number'} style={{ color: '#1976d2' }}>
                  {dashboardData.approvalInfo.waited}
                </div>
                <h4 className={'title'}>결재 신청</h4>
                <Button color="gray" text onClick={() => detailClick('AP100001')}>
                  자세히 보기 <MdArrowRightAlt />
                </Button>
              </div>
              <div className={'con'}>
                <div className={'img'}>
                  <Image
                    src={'/static/img/ic-doc-com.svg'}
                    alt="icon"
                    width={30}
                    height={30}
                    className={'icon'}
                  />
                </div>
                <div className={'number'} style={{ color: '#1976d2' }}>
                  {dashboardData.approvalInfo.complete}
                </div>
                <h4 className={'title'}>결재 완료</h4>
                <Button color="gray" text onClick={() => detailClick('AP100006')}>
                  자세히 보기 <MdArrowRightAlt />
                </Button>
              </div>
              <div className={'con'}>
                <div className={'img'}>
                  <Image
                    src={'/static/img/ic-doc-return.svg'}
                    alt="icon"
                    width={30}
                    height={30}
                    className={'icon'}
                  />
                </div>
                <div className={'number'} style={{ color: '#f03e3e' }}>
                  {dashboardData.approvalInfo.returned}
                </div>
                <h4 className={'title'}>결재 반송</h4>
                <Button color="gray" text onClick={() => detailClick('AP100004')}>
                  자세히 보기 <MdArrowRightAlt />
                </Button>
              </div>
              <div className={'con'}>
                <div className={'img'}>
                  <Image
                    src={'/static/img/ic-doc-wait.svg'}
                    alt="icon"
                    width={30}
                    height={30}
                    className={'icon'}
                  />
                </div>
                <div className={'number'} style={{ color: '#495057' }}>
                  {dashboardData.approvalInfo.waited}
                </div>
                <h4 className={'title'}>결재 대기</h4>
                <Button color="gray" text onClick={() => detailClick('AP100001')}>
                  자세히 보기 <MdArrowRightAlt />
                </Button>
              </div>
            </SBtnContents>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="6">
          <Card.Head>
            <Card.Title>오늘 재택이신 분은?</Card.Title>
          </Card.Head>
          <Card.Body>
            <SList>
              {dashboardData.homeWorkUser &&
                dashboardData.homeWorkUser.map((item) => (
                  <div key={item.id} className="box">
                    <div className="user">
                      <div className="img">
                        <Image
                          src={
                            item.profile !== null ? item.profile : '/static/img/noImg.svg'
                          }
                          alt="profile-img"
                          width={70}
                          height={70}
                        />
                      </div>
                      <div className="info">
                        <span className="name">
                          {item.name} {item.grade}
                        </span>
                        <span className="position">{item.organization}</span>
                      </div>
                    </div>
                    <div className="project">
                      {item.project !== null ? item.project : '이모션 공통'}
                    </div>
                  </div>
                ))}
            </SList>
          </Card.Body>
        </Card>
        <Card col="6">
          <Card.Head>
            <Card.Title>
              <Link href={'/calendar'}>휴가 / 부재자 현황</Link>
            </Card.Title>
          </Card.Head>
          <Card.Body>
            <SList>
              {dashboardData.vacationUser &&
                dashboardData.vacationUser.map((item) => (
                  <div key={item.id} className="box">
                    <div className="user">
                      <div className="img">
                        <Image
                          src={
                            item.profile !== null ? item.profile : '/static/img/noImg.svg'
                          }
                          alt="profile-img"
                          width={70}
                          height={70}
                        />
                      </div>
                      <div className="info">
                        <span className="name">
                          {item.name} {item.grade}
                        </span>
                        <span className="position">{item.organization}</span>
                      </div>
                    </div>
                    <div className="vacation">
                      <span className="type">휴가</span>
                      <span className="date">{item.vacationDate}</span>
                    </div>
                  </div>
                ))}
            </SList>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

const SNotice = styled.div`
  height: 35px;
`;

const SList = styled.div`
  max-height: 460px;
  overflow-y: auto;
  .box {
    width: 98%;
    padding: 10px 30px 10px 20px;
    box-sizing: border-box;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(80, 143, 244, 0.1);
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    margin: 5px auto 20px;
    .user {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      .img {
        width: 70px;
        height: 70px;
        margin: 0 auto;
        border-radius: 50%;
        border: 5px solid #fff;
        box-shadow: ${(p) => p.theme.boxShadow};
        box-sizing: border-box;
        img {
          border-radius: 100%;
          max-width: 100%;
          object-fit: cover;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .name {
          color: ${(p) => p.theme.gray10};
          font-weight: 700;
        }
        .position {
          font-size: 14px;
          color: ${(p) => p.theme.gray40};
        }
      }
    }
    .project {
      color: ${(p) => p.theme.gray30};
    }
    .vacation {
      color: ${(p) => p.theme.gray30};
      span + span {
        margin-left: 20px;
      }
    }
    @media screen and (max-width: 1500px) {
      display: block !important;
      flex: none;
      .project,
      .vacation {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-top: 15px;
        margin-top: 15px;
        border-top: 1px dashed ${(p) => p.theme.gray70};
      }
    }
    .mobile & {
      display: block !important;
      flex: none;
      .project,
      .vacation {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-top: 15px;
        margin-top: 15px;
        border-top: 1px dashed ${(p) => p.theme.gray70};
      }
    }
  }
`;

const SHello = styled.div`
  .mobile & {
    min-height: 350px;
  }
  h2 {
    font-size: 35px;
  }
  .slick-slider {
    margin-top: 20px;
    .slick-slide {
      height: 35px;
      .item {
        width: 100%;
        display: inline-flex;
        align-items: center;
        span {
          width: 60px;
          margin-right: 10px;
        }
        a {
          width: calc(100% - 60px);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-top: 3px;
        }
      }
    }
  }
  .work {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    width: 100%;
    height: 60px;
    font-size: 18px;
    border-radius: 20px;
    box-shadow: ${(p) => p.theme.boxShadow};
    &.on {
      background: ${(p) => p.theme.blue};
      color: ${(p) => p.theme.white};
    }
    &.off {
      background: ${(p) => p.theme.white};
      color: ${(p) => p.theme.gray10};
      font-weight: bold;
    }
    &.disabled {
      opacity: 0.5;
      cursor: default;
    }
    & + button {
      margin-top: 20px;
    }
  }
`;

const SBtnContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4%;
  box-sizing: border-box;
  .con {
    flex: 0 0 22%;
    width: 22%;
    padding: 30px;
    border-radius: 20px;
    box-shadow: ${(p) => p.theme.boxShadow};
    box-sizing: border-box;
    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border: 1px solid ${(p) => p.theme.gray80};
      background: ${(p) => p.theme.white};
      box-shadow: ${(p) => p.theme.boxShadow};
      border-radius: 100%;
      img {
        object-fit: contain;
      }
    }
    .number {
      margin-top: 25px;
      font-weight: bold;
      font-size: 45px;
      font-family: 'Noto Sans KR', sans-serif !important;
    }
    .title {
      font-size: 18px;
      font-weight: 400;
    }
    button {
      justify-content: flex-start;
      span {
        svg {
          margin-left: 5px;
        }
      }
    }
    @media screen and (max-width: 1500px) {
      flex: 0 0 48%;
      width: 48%;
      margin-top: 4%;

      display: flex;
      align-items: center;
      position: relative;
      .img {
        flex: 0 0 60px;
      }
      .number {
        flex: auto;
        margin: 5px 0 0 15px;
        font-size: 35px;
      }
      .title {
        font-size: 16px;
      }
      button {
        position: absolute;
        bottom: 9px;
        right: 0;
        background: transparent;
        span {
          font-size: 12px;
        }
      }
      &:nth-child(-n + 2) {
        margin-top: 2%;
      }
    }
  }
  @media screen and (max-width: 980px) {
    flex-direction: column;
    .con {
      flex: 0 0 100%;
      width: 100%;
      padding: 20px;
      display: flex;
      align-items: center;
      position: relative;
      .img {
        flex: 0 0 60px;
      }
      .number {
        flex: auto;
        margin: 5px 0 0 15px;
        font-size: 35px;
      }
      .title {
        font-size: 16px;
      }
      button {
        position: absolute;
        bottom: 9px;
        right: 0;
        background: transparent;
        span {
          font-size: 12px;
        }
      }
    }
  }
  .mobile & {
    flex-direction: column;
    .con {
      flex: 0 0 100%;
      padding: 20px;
      display: flex;
      align-items: center;
      position: relative;
      .img {
        flex: 0 0 60px;
      }
      .number {
        flex: auto;
        margin: 5px 0 0 15px;
        font-size: 35px;
      }
      .title {
        font-size: 16px;
      }
      button {
        position: absolute;
        bottom: 9px;
        right: 0;
        background: transparent;
        span {
          font-size: 12px;
        }
      }
    }
  }
`;

const SNewProfileList = styled.div`
  max-height: 295px;
  margin-top: -20px;
  .slick-slider {
    .slick-list {
      .slick-track {
        transition-timing-function: linear;
      }
      .slick-slide {
        &.slick-current {
          .profile {
            .inner {
              border: 2px solid ${(p) => p.theme.blue};
            }
          }
        }
      }
    }
  }
  .profile {
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    .inner {
      background: ${(p) => p.theme.white};
      box-shadow: ${(p) => p.theme.boxShadow};
      border: 1px solid ${(p) => p.theme.gray80};
      border-radius: 15px;
      padding: 20px;
      box-sizing: border-box;
    }
    .img {
      justify-content: center;
      flex: 0 0 80px;
      width: 80px;
      height: 80px;
      margin: 0 auto;
      border-radius: 50%;
      border: 5px solid #fff;
      box-shadow: ${(p) => p.theme.boxShadow};
      overflow: hidden;
      img {
        border-radius: 100%;
        max-width: 100%;
        object-fit: cover;
      }
    }
    .user {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .info {
        text-align: center;
        opacity: 1;
        .name {
          margin-top: 5px;
          display: block;
          color: ${(p) => p.theme.black};
          font-weight: 700;
        }
        .position {
          font-size: 12px;
          font-weight: 400;
          color: ${(p) => p.theme.gray40};
        }
        .team {
          display: block;
          font-size: 12px;
          color: ${(p) => p.theme.gray40};
        }
      }
      & + .group {
        margin-top: 20px;
      }
    }
    .mobile & {
      margin: 0;
    }
  }
`;

const SChart = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .chart {
    height: 250px;
    text {
      font-family: initial !important;
    }
  }
  .current-time {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    font-size: 45px;
    font-weight: 100;
    font-family: 'Noto Sans KR', sans-serif !important;
    margin-top: -40px;
    color: ${(p) => p.theme.gray40};
    z-index: 9;
  }
`;

const SNoData = styled.div`
  height: 250px;
  .img {
  }
`;

export default Home;
