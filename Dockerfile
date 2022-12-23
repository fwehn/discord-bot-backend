FROM node:lts-alpine

WORKDIR /usr/src/app
COPY ["./package.json", "./package-lock.json*", "./"]
RUN npm install

COPY . .
VOLUME ["/usr/src/app/configs"]

ENV PORT=3000 \
    CLIENTID=1234567890 \
    TOKEN=abc123 \
    MYSQLHOST=database \
    MYSQLUSERNAME=discordBot \
    MYSQLPASSWORD=discordBot \
    MYSQLDATABASE=discordBot

EXPOSE $PORT
CMD ["node", "app.js"]