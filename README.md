# Typescript-Mongo
Typescript application for simple Car Managment to mainly illustrate the usage of Moongose and Express server.

Project also illustartes usages of some npm packages
- ajv for validating json schemas 
- swagger-jsdoc to provide OpenAPI 3.0 documentation for application
- swagger-ui-express to build a swagger UI to view/execute diffrent application API(s).
-  eslint and prettier for linting support and auto-fix of linting indentation errors
- winston for creating a custom logger that uses winston logger.

# Build
## Prerequisites
- NodeJS version >=14.16.1 (LTS)
- Docker

## Build

Project comes with a docker-compose.yml file that contains 3 docker images
- car-managment, contains application.
- mongodb, to provide needed mongodb server.
- mongo-express, to provide a UI to view data in mongodb.

To build and start all containers
```bash
docker compose up -d
```

To access swaagger ui
http://localhost:8080/docs/

To stop all containers
```bash
docker compose down
```

### local development

- To set environment variables (i.e connection to MongoDB , port..etc)
adjust local .env file

- To build and start application for local development
```bash
npm install && npm run build && npm run start
```
- To check for linting errors
```bash
npm run lint
```