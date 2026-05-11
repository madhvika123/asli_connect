FROM node:18

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 500

CMD ["node", "server.js"]
