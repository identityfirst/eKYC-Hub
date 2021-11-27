FROM node:lts
WORKDIR /app

COPY views ./views
COPY static ./static
COPY *.js ./
COPY package.json ./
RUN cd /app && npm install
CMD ["node", "index.js"]