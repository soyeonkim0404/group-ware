module.exports = {
  apps: [
    {
      name: 'groupware-ui',
      script: 'yarn run start',
      args: '',
      cwd: '/app',
      instances: 1,
      autorestart: true,
      watch: false,
      source_map_support: false,
      log_date_format: 'YYYY-MM-DD',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

/**
 * pm2 기본 명령어
 * 실행: pm2 start {process_name}
 * 확인: pm2 start [{process_name}]
 * 중지: pm2 stop {process_name}
 * 재시작: pm2 restart {process_name}
 * 삭제: pm2 delete {process_name}
 * 로그: pm2 logs
 *
 * @see https://pm2.keymetrics.io/docs/usage/quick-start/
 * */
