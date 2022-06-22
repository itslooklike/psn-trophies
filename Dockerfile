FROM itslooklike/node-chrome:1.2.0

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npx next telemetry disable
RUN yarn build

CMD [ "yarn", "start" ]
