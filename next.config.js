/** @type {import('next').NextConfig} */

const path = require('path');

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list',
]);

module.exports = withTM({
  reactStrictMode: false,
  images: {
    domains: ['groupware.pencilstudio.co.kr', 'group.emotion.co.kr', 'localhost'],
  },
  swcMinify: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'static')],
  },
  /** open 시점에 주석 해제 예정, 주석 해제 시 로그가 찍히지 않음 */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
});
