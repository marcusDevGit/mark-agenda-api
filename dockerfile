FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --only=production

COPY . .

#Executar migraçoes do Prisma
RUN npx prisma generate

EXPOSE 7000

CMD [ "npm", "run", "deploy" ]
