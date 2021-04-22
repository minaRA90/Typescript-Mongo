import { JSONSchema6 as JSONSchema } from 'json-schema';

/**
 * Car schema that is used for AJV validation and swagger-jsDocs
 */
export const CarSchema: JSONSchema = {
    $id: '#/components/schemas/Car',
    title: 'Car',
    description: 'Car Schema',
    type: 'object',
    properties: {
        manufacturer: {
            $ref : '#/components/schemas/Manufacturer'
        },
        brand: {
            type: 'string',
            description: 'Car Brand.',
        },
        color: {
            type: 'string',
            description: 'Car Color.',
        },
        carModel: {
            type: 'string',
            description: 'Car Model.',
        },
    },
    required: ['manufacturer', 'brand', 'color'],
    additionalProperties: false
};
