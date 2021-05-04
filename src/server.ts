import dotenv from 'dotenv';
import { Application } from './Application';
import { validateEnv } from './util/validateEnv';
import { CarController } from './controller/CarController';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

/* Validate Environment variables */
validateEnv();

/**
 * Strat application with Car controllers
 */
const app = new Application([new CarController()]);

app.listen();
