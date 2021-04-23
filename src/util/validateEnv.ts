import { cleanEnv, str, port } from 'envalid';

/**
 * Validate and log an error message and exit if any required env vars are missing or invalid.
 */
export function validateEnv() {
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
        API_KEYS: str()
    });
}
