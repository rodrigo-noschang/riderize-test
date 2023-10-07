FROM node:20

WORKDIR /usr

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=4000
EXPOSE ${PORT}

RUN docker-compose up -d

RUN npx prisma migrate deploy

CMD ["npm", "run", "dev"]