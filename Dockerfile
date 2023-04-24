FROM node:18.16.0-alpine

LABEL org.opencontainers.image.created=$BUILD_DATE \
  org.opencontainers.image.authors="Ismar Slomic" \
  org.opencontainers.image.url="https://github.com/ismarslomic/skistar-activities-ical" \
  org.opencontainers.image.documentation="https://github.com/ismarslomic/skistar-activities-ical" \
  org.opencontainers.image.source="https://github.com/ismarslomic/skistar-activities-ical" \
  org.opencontainers.image.version=$DOCKER_TAG \
  org.opencontainers.image.revision=$GIT_SHA \
  org.opencontainers.image.vendor="ismarslomic" \
  org.opencontainers.image.licenses="MIT" \
  org.opencontainers.image.ref.name="" \
  org.opencontainers.image.title="skistar-activities-ical" \
  org.opencontainers.image.description="NodeJS app exposing the upcoming activities at an specific Skistar destinations as valid iCalendar from an HTTP endpoint."

ENV NODE_ENV production

# Install timezone database to allow setting timezone through TZ environment variable
RUN apk add --no-cache tzdata

# Don’t run Node.js apps as root
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json .

RUN CI=true npm install --omit=dev

# Bundle app source
COPY --chown=node:node dist .

EXPOSE 3001

CMD [ "node", "index.js" ]
