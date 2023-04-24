# Using multi stage build
ARG BASE_IMAGE="node:18.16.0-alpine"

#### Build stage for compiling Typescript files ####
FROM ${BASE_IMAGE} as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

# Install dev and app dependencies
RUN npm install

# Copy all files to current dir
COPY . .

# Run build to compile typescript to javascript in 'dist' folder
RUN npm run build

#### Build stage for running the Javascript in production ####
FROM ${BASE_IMAGE}

ENV NODE_ENV production

# Install timezone database to allow setting timezone through TZ environment variable
RUN apk add --no-cache tzdata

# Don’t run Node.js apps as root
USER node

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

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json .

# Install app dependencies only
RUN CI=true npm install --omit=dev

# Copy compiled files from 'dist' directory to current
COPY --chown=node:node --from=builder /usr/src/app/dist .

EXPOSE 3001

CMD [ "node", "index.js" ]
