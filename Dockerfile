FROM node:10 as builder

ENV NODE_ENV development
ENV APP_ROOT /home/node/app

RUN mkdir -p ${APP_ROOT}
WORKDIR ${APP_ROOT}

COPY package.json ${APP_ROOT}
RUN npm install

COPY . ${APP_ROOT}

ENV NODE_ENV production

RUN npm config set package-lock false

RUN npm run build && \
  npm prune --production

#######################################################
FROM node:10-alpine

RUN npm install pm2 -g

ENV NODE_ENV production
ENV APP_ROOT /home/node/app
ENV HOST 0.0.0.0

COPY --from=builder ${APP_ROOT} ${APP_ROOT}

RUN chown -R node:node ${APP_ROOT}

USER node
WORKDIR ${APP_ROOT}

CMD ["pm2-runtime", "dist/server"]

# docker build --rm -t express-nuxt-realworld-example:latest .
# docker run --name realworld -p 3000:3000 -d express-nuxt-realworld-example
