FROM node:20

ENV NODE_ENV=production
ENV DB_INSTANCE=fl24-community-of-hope:us-central1:coh-postgres
ENV DB_USER=quickstart-user
ENV DB_NAME=coh-data
ENV DB_HOST=/cloudsql/fl24-community-of-hope:us-central1:coh-postgres
WORKDIR /app

COPY . .

RUN NODE_ENV=development npm install

RUN npm run build

RUN npm prune --production

RUN mkdir -p public/images

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]