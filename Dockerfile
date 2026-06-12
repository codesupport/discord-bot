FROM node:26
WORKDIR /usr/src/app
COPY package*.json ./
COPY patches ./patches
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]