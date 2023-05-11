#!/bin/sh

# bash deploy.sh 로 실행

git fetch --all
git reset --hard origin/master
sudo chmod 755 ./*
yarn install

lint=$(npm run lint)

if [[ "$lint" == *"No ESLint warnings or errors"* ]]; then
#        ps -ef | grep groupware-ui | grep -v grep | awk '{print $2}' | xargs kill
        pm2 reload groupware-ui
else
        echo "lint fail"
fi