
# STAGE 1: dependencies

FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# STAGE 2: test

FROM deps AS tester

COPY . .
RUN npm test --if-present


# STAGE 3: production

FROM node:20-alpine AS production

LABEL maintainer="yoderickmejia@gmail.com" \
      description="PRUEBA APAP"

RUN apk add --no-cache dumb-init wget

RUN mkdir -p /app && chown node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node src/ ./src/

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s \
  --timeout=10s \
  --start-period=15s \
  --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]