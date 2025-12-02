FROM node:lts-alpine3.20
EXPOSE 4000
WORKDIR /usr/app
COPY package*.json ./
RUN npm install \
    && npm cache clean --force \
    && rm -rf /tmp/* /var/cache/apk/*
COPY . .
CMD ["npm", "start"]