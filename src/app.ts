import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import express from 'express';
import { Controller } from './base/Controller';
import { MODULE_NAME } from './constants';
import { Logger } from './util/Logger';
import { OASDoc } from './OASConfig';

const logger = new Logger(__filename, MODULE_NAME);

/**
 * Main Application class that runs express.Application instance.
 * It is responsible for:
 * - Connect to MongoDB
 * - Creating express appliation instance
 * - Initializing express middlewares
 * - Initialize used controllers
 * - Initailize OpenAPI Specification document (OAS)
 */
export class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.mongoDBConnect();
        this.initializeMiddlewares();
        this.initializeRoutes(controllers);
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            logger.info(`App is running here 👉 https://localhost:${process.env.PORT}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    private initializeRoutes(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });

        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(OASDoc));
    }

    /**
     * Connects to MongoDB
     */
    private mongoDBConnect() {
        mongoose
            .connect(`mongodb://${process.env.MONGO_PATH}`, {
                authSource: 'admin',
                user: process.env.MONGO_USER,
                pass: process.env.MONGO_PASSWORD,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                logger.info('Successfully connected to MongoDB');
            })
            .catch((error) => {
                logger.error('Could not establish connection to MongoDB, exiting Application ...', error);
                process.exit(0);
            });
    }
}
