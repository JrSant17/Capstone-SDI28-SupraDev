FROM node:latest
RUN mkdir ui
WORKDIR /ui
COPY package.json . 
RUN npm install
COPY . .
EXPOSE 3000

CMD ["npm", "start"]