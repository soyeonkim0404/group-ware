FROM node:16.16.0

WORKDIR /app

COPY . .
RUN yarn install
RUN npm install -g pm2

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
EXPOSE 3001