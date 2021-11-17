FROM itslooklike/node-chrome:1.0.1

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# ARG REDISTOGO_URL=redis://***REMOVED***@soapfish.redistogo.com:11809/
# ENV REDISTOGO_URL ${REDISTOGO_URL}

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build

RUN  apt-get update \
  && apt-get install -y wget gnupg ca-certificates \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/* \
  && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
  && chmod +x /usr/sbin/wait-for-it.sh


CMD [ "yarn", "start" ]
