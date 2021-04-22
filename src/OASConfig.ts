import swaggerJSDoc, { OAS3Options, Schema } from 'swagger-jsdoc';
import { CarSchema } from './schema/Car';
import { ManufacturerSchema } from './schema/Manufacturer';

const OASSchemas: Schema = {
    'Manufacturer' : ManufacturerSchema,
    'Car': CarSchema,
};

const options: OAS3Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car Managment',
            description: 'A Car Managment sytsem API',
            version: '1.0.0',
        },
        components: {
            schemas: OASSchemas,
        },
    },
    apis: ['./src/controller/*'],
};

export const OASDoc = swaggerJSDoc(options);
