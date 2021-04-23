import dotenv from 'dotenv';
import { App } from './app';
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
const app = new App([new CarController()]);

app.listen();
