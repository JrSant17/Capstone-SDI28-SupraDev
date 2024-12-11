FROM node:latest
RUN mkdir api
WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080

CMD ["npm", "start"]