FROM mhart/alpine-node:12
RUN adduser -D HeartBeat
USER HeartBeat
COPY . /app

WORKDIR /app

RUN yarn install
