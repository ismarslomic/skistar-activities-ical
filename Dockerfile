# Using multi stage build
ARG BASE_IMAGE="node:24.11.0-alpine3.22"

#### Build stage for compiling Typescript files ####
FROM ${BASE_IMAGE} AS builder

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

ENV NODE_ENV=production

# Install timezone database to allow setting timezone through TZ environment variable
RUN apk add --no-cache tzdata

# Don’t run Node.js apps as root
USER node

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json .

# Install app dependencies only
RUN CI=true npm install --omit=dev

# Copy compiled files from 'dist' directory to current
COPY --chown=node:node --from=builder /usr/src/app/dist .

CMD [ "node", "index.js" ]
