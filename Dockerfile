FROM node:latest as base

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    vim-tiny \
    telnet \
    less \
    zip

FROM base as deps
WORKDIR /home/developer

COPY package.json .
RUN npm i --no-optional

FROM deps as build
COPY . .
RUN npm test && npm build
