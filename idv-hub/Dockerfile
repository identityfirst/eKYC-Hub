FROM node:lts

WORKDIR /app

COPY . /app/
#COPY package.json /app/package.json
COPY node_modules /app/node_modules
RUN  npm install && npm install typescript ts-node
RUN  npm run compile

ENV APP_ID=idv-hub
ENV PORT=5000
ENV LOG_LEVEL=debug
ENV REQUEST_LIMIT=100kb
ENV SESSION_SECRET=mySecret

ENV OPENAPI_SPEC=/api/v1/spec

ENV PASSBASE_API_KEY=""

ENV SELF_HOST=http://localhost:5000

ENV OIDC_IDP_URL=http://172.17.0.1:8080/auth/realms/demo
ENV OIDC_SCOPES="openid email profile"
ENV OIDC_CLIENT_ID=idv-hub
ENV OIDC_CLIENT_SECRET=secret
ENV OIDC_RESPONSE_TYPE=code

ENV MONGO_URL="mongodb://localhost:27017"
ENV MONGO_DB="ekyc"


CMD ["npm", "run", "start"]
