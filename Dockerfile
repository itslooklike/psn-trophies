FROM itslooklike/node-chrome:1.0.1

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# ARG REDISTOGO_URL=redis://redistogo:***REMOVED***@soapfish.redistogo.com:11809/
# ARG REDISTOGO_URL=redis://***REMOVED***@soapfish.redistogo.com:11809/
# ENV REDISTOGO_URL ${REDISTOGO_URL}

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
