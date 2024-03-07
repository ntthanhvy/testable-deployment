FROM node:18-alpine as builder

WORKDIR /app

# copy root package.json and yarn.lock
COPY package.json yarn.lock ./
COPY ./backend/package.json ./backend/yarn.lock ./backend/
COPY ./admin-ui/package.json ./admin-ui/yarn.lock ./admin-ui/
COPY ./admin/package.json ./admin/yarn.lock ./admin/

RUN yarn install --frozen-lockfile

COPY ./backend ./backend
RUN cd backend && yarn build:server


# FROM node:18-alpine as runner

# WORKDIR /app

# COPY package.json yarn.lock ./
# COPY ./backend/package.json ./backend/yarn.lock ./backend/

# RUN yarn install --frozen-lockfile 

# COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend
CMD [ "yarn", "start"]