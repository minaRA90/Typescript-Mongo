import { Router } from 'express';

/**
 * Base interface for all applications controller(s).
 */
export interface Controller {
    path: string;
    router: Router;
}
