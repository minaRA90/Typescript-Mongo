import * as supertest from 'supertest';
import { Application } from '../../src/Application';
import { CarController } from '../../src/controller/CarController';

describe('controller/CarController.test.ts', () => {

  describe('testing controller exosed endpoints', () => {

    let application: Application;
    let sut: supertest.SuperTest<supertest.Test>;

    beforeAll(() => {

      // Create application instance with CarController
      application = new Application([new CarController()]);

      // Register it with supertest agent
      sut = supertest.agent(application.expressInstance);
    });

    describe('Testing /car/create', () => {

      const car = {
        brand: 'BMW',
        color: 'black',
        carModel: '512ii',
        manufacturer : {
          companyName: 'BMW',
          country: 'Germany',
          factoryLocation: [41.12 , -71.34]
        }
      }

      describe('Successfully creating a car', () => {
       
        sut.post('/car/create').send(car)
        .expect(200)
        .then(response => expect(response.body.carId).toBeDefined());
      });

      describe('Greeting bad request for invalid request body schmea', () => {

      });

    });
  });
});
