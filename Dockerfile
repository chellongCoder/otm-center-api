# Build Stage 1
# This build created a staging docker image
#
FROM node:14.19.1-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY ./src ./src
COPY .env .
COPY tsconfig.json .
RUN yarn build

# Build Stage 2
# This build takes the production build from staging build
#
FROM node:14.19.1-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY --from=appbuild /usr/src/app/dist ./dist
EXPOSE 8000
CMD yarn start