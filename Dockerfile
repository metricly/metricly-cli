FROM node:latest

RUN mkdir /metricly-cli

COPY . /metricly-cli

WORKDIR /metricly-cli
