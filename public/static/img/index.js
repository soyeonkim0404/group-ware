import Image from 'next/image';

import icEmployee from './ic-employee.svg';
import icTeam from './ic-team.svg';
import icProject from './ic-project.svg';
import icCommute from './ic-commute.svg';
import icDoc from './ic-doc.svg';
import icDocList from './ic-docList.svg';
import icNotice from './ic-notice.svg';
import icEmotion from './ic-emotion.svg';
import icClient from './ic-client.svg';
import icCalendar from './ic-calendar.svg';
import icOffTheRecord from './ic-offtherecord.svg';
import icReservation from './ic-reservation.svg';

const iconImage = (src) => {
  if (!src) return null;
  return <Image src={src} alt="icon" width={20} height={20} className={'icon'} />;
};

module.exports.Icons = {
  icEmployee: () => iconImage(icEmployee.src),
  icTeam: () => iconImage(icTeam.src),
  icProject: () => iconImage(icProject.src),
  icCommute: () => iconImage(icCommute.src),
  icDoc: () => iconImage(icDoc.src),
  icDocList: () => iconImage(icDocList.src),
  icNotice: () => iconImage(icNotice.src),
  icEmotion: () => iconImage(icEmotion.src),
  icClient: () => iconImage(icClient.src),
  icCalendar: () => iconImage(icCalendar.src),
  icOffTheRecord: () => iconImage(icOffTheRecord.src),
  icReservation: () => iconImage(icReservation.src),
};
