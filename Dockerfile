# Stay Calm.
# This is a multi stage docker build.

# -- BASE --
# The purpose of this first "base" stage is to give all stages a common working directory and runtime.
FROM node:14-alpine as base
RUN apk add bash
WORKDIR /app

# -- NPMBUILDER --
# The purpose of this second "npmbuilder" stage is to run the "npm ci" (aka: `npm i` using "shrinkwrapped" package-lock)
# and store the result in a docker layer. This layer will only be rebuilt when dependancies change in package.json
# In the most common event that you are just developling locally, rebuilding often, the usefulness of this pre-stage
# becomes a real time saver.
FROM base AS npmbuilder
COPY package.json .
COPY package-lock.json .
# Setting this env var to true just downloads newrelic's native-metrics instead of trying to build (impossible on alpine without python).
ENV NR_NATIVE_METRICS_NO_BUILD=true
RUN npm ci

# -- RELEASE --
# This is the realase image, note that this image never runs npm install.
# The purpose of this "release" stage is to be rebuilt quickly and often.
# All code changes will trigger this stage at a minimum.
FROM base AS release
ENV LOG_LEVEL warn
ENV TZ UTC
COPY --from=npmbuilder --chown=1000:1000 /app/node_modules ./node_modules
# Everything below here will need to be re-run with every code change.
COPY . .
RUN npm prune --production

CMD [ "node", "/app/gateway/index.js"]

