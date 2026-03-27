#STAGE 1: dependencies
FROM node:20-alpine AS desp

WORKDIR /app

COPY packcage.json packcage-lock.json ./

RUN npm ci 

#STAGE 2 : test

FROM desp as tester 

COPY . . 

RUN npm test 

# STAGE 3 

FROM node:20-alpine AS production

LABEL maintainer="yoderickmejia@gmail.com" description="PRUEBA APAP"

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN chown node:node /app

USER node 

COPY --chown=node:node packcage.json packcage-lock.json

RUN npm ci --omit=dev

COPY --chown=node:node src/ ./src/

ENV NODE_ENV=production  PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s \
--timeout=10s \
--start-period=15s \
--retries=3 \

CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/index.js"]

