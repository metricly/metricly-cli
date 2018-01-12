FROM alpine:latest

ADD index.js entrypoint.sh package.json tsconfig.json tslint.json yarn.lock /metricly-cli/
ADD ts/ /metricly-cli/ts/

WORKDIR /metricly-cli/

RUN apk --update --no-cache add nodejs yarn bash \
 && yarn \
 && yarn run compile


ENTRYPOINT ["./entrypoint.sh"]
