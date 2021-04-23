import * as express from 'express';
import { MODULE_NAME } from '../constants';
import { Logger } from '../util/Logger';

const logger = new Logger(__filename, MODULE_NAME);

export const validateKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.url.includes('/docs/')) {
        next();
    } else {
        const apiKeys = process.env.API_KEYS?.split(',');
        let api_key = req.header('x-api-key');

        if (!api_key) {
            res.status(403).send({ error: { code: 403, message: 'Missing header x-api-key.' } });
        } else if (api_key && apiKeys && !apiKeys.includes(api_key)) {
            res.status(403).send({ error: { code: 403, message: 'Invalid API key.' } });
        } else {
            next();
        }
    }
};
