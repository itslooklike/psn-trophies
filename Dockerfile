FROM itslooklike/node-chrome:1.0.1

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
