import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { addProperty } from '../api/v1/controllers/propertyController.js'; // Correct the path

const app = express();
app.use(express.json());
app.post('/api/property', addProperty);

describe('POST /api/property', () => {
  it('should create a new property and return success', async () => {
    const response = await request(app)
      .post('/api/property')
      .send({
        sellerID: 1,
        location: 'Test Location',
        price: 100000,
        squareMeters: 50
      }); 

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Property added successfully');
    expect(response.body.data).to.have.property('id');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/property')
      .send({
        sellerID: 1,
        location: 'Test Location'
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Missing required fields: sellerID, location, price, squareMeters');
  });
});


