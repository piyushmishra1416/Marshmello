FROM node:20

WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
EXPOSE 9000
CMD [ "node", "index.js" ]