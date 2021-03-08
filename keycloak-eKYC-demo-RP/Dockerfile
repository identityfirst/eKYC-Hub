FROM node:lts

WORKDIR /app

COPY views ./views
COPY static ./static
COPY *.js ./
COPY package.json ./

RUN cd /app && npm install
EXPOSE 3000
CMD ["node", "index.js"]