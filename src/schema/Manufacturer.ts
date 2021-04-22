import { JSONSchema6 as JSONSchema } from 'json-schema';

/**
 * Manufacturer schema that is used for AJV validation and swagger-jsDocs
 */
export const ManufacturerSchema: JSONSchema = {
    $id: '#/components/schemas/Manufacturer',
    title: 'Manufacturer',
    description: 'Manufacturer Schema',
    type: 'object',
    properties: {
        companyName: {
            type: 'string',
            description: 'Manufacturer Company.',
        },
        country: {
            type: 'string',
            description: 'Country where car was manufacturerd.',
        },
        factoryLocation: {
            type: 'array',
            items: {
                type: 'number',
            },
        },
    },
    required: ['companyName', 'country'],
    additionalProperties: false,
};
