FROM node:alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]