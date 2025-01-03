FROM node:20

ENV NODE_ENV=production
ENV DB_INSTANCE=fl24-community-of-hope:us-central1:coh-postgres
ENV DB_USER=quickstart-user
ENV DB_NAME=coh-data
ENV DB_HOST=/cloudsql/fl24-community-of-hope:us-central1:coh-postgres

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
COPY dist/ ./dist

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]