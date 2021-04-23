import * as express from 'express';
import { Controller } from '../base/Controller';
import { Car, CarModel as CarMongooseModel } from '../model/Car';
import Ajv, { ValidateFunction } from 'ajv';
import { MODULE_NAME } from '../constants';
import { Logger } from '../util/Logger';
import { CarSchema } from '../schema/Car';
import { ManufacturerSchema } from '../schema/Manufacturer';
import { FilterQuery, UpdateQuery } from 'mongoose';

const logger = new Logger(__filename, MODULE_NAME);

const ajv = new Ajv({ allErrors: true });
ajv.addSchema(ManufacturerSchema, '#/components/schemas/Manufacturer');
ajv.addSchema(CarSchema, '#/components/schemas/Car');

/**
 * Car controller that exposes below endpoints:
 * - /car/crear
 * - /car/all
 * - /car/{id}
 * - /car/{id}/delete
 * - /car/update
 */
export class CarController implements Controller {
    public path = '/car';
    public router = express.Router();
    private CarModel = CarMongooseModel;
    private validate: ValidateFunction<unknown>;

    constructor() {
        this.initializeRoutes();
        this.validate = ajv.compile(CarSchema);
    }

    private initializeRoutes() {
        /**
         * @openapi
         * /car/create:
         *   post:
         *    description: Create  new car
         *    parameters:
         *       - in: header
         *         name: x-api-key
         *         schema:
         *            type: string
         *         required: true
         *    requestBody:
         *        required: true
         *        content:
         *           application/json:
         *              schema:
         *                $ref: '#/components/schemas/Car'
         *    responses:
         *      200:
         *        description: Returns created car.
         *      400:
         *        descripttion: Bad Request
         */
        this.router.post(`${this.path}/create`, this.createCar);

        /**
         * @openapi
         * /car/all:
         *   get:
         *     description: get all cars
         *     parameters:
         *        - in: header
         *          name: x-api-key
         *          schema:
         *            type: string
         *          required: true
         *     responses:
         *       200:
         *         description: Returns car list.
         *         content:
         *            application/json:
         *               schema:
         *                   type: array
         *                   items:
         *                      $ref: '#/components/schemas/Car'
         *       500:
         *         descripttion: Internal server error
         */
        this.router.get(`${this.path}/all`, this.getAll);

        /**
         * @openapi
         * /car/{id}:
         *   get:
         *     description: get car via its Id
         *     parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *        - in: header
         *          name: x-api-key
         *          schema:
         *            type: string
         *          required: true
         *     responses:
         *       200:
         *         description: Returns car.
         *         content:
         *           application/json:
         *               schema:
         *                 $ref: '#/components/schemas/Car'
         *       500:
         *         descripttion: Internal server error
         */
        this.router.get(`${this.path}/:id`, this.getOne);

        /**
         * @openapi
         * /car/{id}/delete:
         *   delete:
         *     description: Delete a car.
         *     parameters:
         *        - in: path
         *          name: id
         *          schema:
         *            type: string
         *          required: true
         *        - in: header
         *          name: x-api-key
         *          schema:
         *            type: string
         *          required: true
         *     responses:
         *       200:
         *         description: successfull deletion.
         *       500:
         *         descripttion: Internal server error
         */
        this.router.delete(`${this.path}/:id/delete`, this.deleteOne);

        /**
         * @openapi
         * /car/{id}/update:
         *   post:
         *    description: Create new car
         *    parameters:
         *       - in: path
         *         name: id
         *         schema:
         *            type: string
         *         required: true
         *       - in: header
         *         name: x-api-key
         *         schema:
         *            type: string
         *         required: true
         *    requestBody:
         *        required: true
         *        content:
         *           application/json:
         *              schema:
         *                 type: 'object'
         *                 properties:
         *                    propertyName:
         *                      type: string
         *                    propertyValue:
         *                      type: string
         *    responses:
         *      200:
         *        description: Returns created car.
         *      400:
         *        descripttion: Bad Request
         */
        this.router.post(`${this.path}/:id/update`, this.updateCar);
    }

    private createCar = (request: express.Request, response: express.Response) => {
        const carData = request.body;

        const valid = this.validate(carData);
        if (!valid) {
            logger.error(this.validate.errors);
            response.status(400).send(this.validate.errors);
        } else {
            const createdCar = new this.CarModel(carData);
            createdCar.save().then((savedCar) => {
                response.status(200).send({ carId: savedCar.id });
            });
        }
    };

    private getAll = (request: express.Request, response: express.Response) => {
        this.CarModel.find({}, function (err, cars) {
            if (!err) {
                response.status(200).send({ cars: cars });
            } else {
                response.status(500).send(err);
            }
        });
    };

    private getOne = (request: express.Request, response: express.Response) => {
        if (!request.params['id']) {
            response.status(400).send({ message: 'Missing mandatory path parameter "id".' });
        }

        this.CarModel.find({ _id: request.params['id'] }, function (err, cars) {
            if (!err) {
                response.status(200).send({ cars: cars });
            } else {
                response.status(500).send(err);
            }
        });
    };

    private deleteOne = (request: express.Request, response: express.Response) => {
        if (!request.params['id']) {
            response.status(400).send({ message: 'Missing mandatory path parameter "id".' });
        }

        this.CarModel.deleteOne({ _id: request.params['id'] })
            .then((ok) => {
                response.status(200).send();
            })
            .catch((error) => {
                response.status(500).send(error);
            });
    };

    private updateCar = (request: express.Request, response: express.Response) => {
        const { valid, message } = this.validateUpdateOneRequest(request);

        if (!valid) {
            response.status(400).send(message);
        } else {
            logger.info('prepare update');
            const propName = request.body['propertyName'];
            const propValue = request.body['propertyValue'];

            // prepare filter query
            const filter: FilterQuery<Car> = {
                _id: request.params['id'],
            };

            //Prepare $set
            const setQuery: { [key: string]: any } = {};
            setQuery[propName] = propValue;

            // Prepare update query
            const update: UpdateQuery<Car> = {
                $set: setQuery,
            };

            this.CarModel.updateOne(filter, update)
                .then((result) => {
                    response.status(200).send(result);
                })
                .catch((error) => {
                    response.status(500).send(error);
                });
        }
    };

    private validateUpdateOneRequest(request: express.Request): { valid: boolean; message?: string } {
        if (!request.params['id']) {
            return { valid: false, message: 'Missing mandatory path parameter "id".' };
        }

        if (!request.body) {
            return { valid: false, message: 'Missing mandatory request body.' };
        }

        const propName = request.body['propertyName'];
        const propValue = request.body['propertyValue'];
        logger.info(JSON.stringify(request.body));

        if (!propName || !propValue) {
            return {
                valid: false,
                message: `Invalid request Body, Missing mandatory properties [propertyName or propertyValue].`,
            };
        }

        return { valid: true };
    }
}
