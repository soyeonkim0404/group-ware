import { useState } from 'react';
/*
- new Date("December 17, 1995 03:24:00"); // DISCOURAGED: may not work in all runtimes
- new Date("1995-12-17T03:24:00"); // This is ISO8601-compliant and will work reliably
- new Date(1995, 11, 17); // the month is 0-indexed
- new Date(1995, 11, 17, 3, 24, 0);
- new Date(628021800000); // passing epoch timestamp
*/
const gf_date = (format) => {
  const date = new Date(format);
  const offset = date.getTimezoneOffset();
  const koDate = new Date(date.getTime() - offset * 60 * 1000);
  const strDatetime = koDate.toISOString();

  return {
    getDateString: () => strDatetime.substring(0, 10),
    getTimeString: () => strDatetime.substring(11, 19),
    toString: () => strDatetime,
  };
};

export default gf_date;
