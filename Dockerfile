FROM node:14


# Create app directory
WORKDIR /usr/src/app

# Copy all files (except ones listed in .dockerignore)
COPY . .

RUN npm ci

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/src/server.js" ]
