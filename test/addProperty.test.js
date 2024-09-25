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
        sellerId: '1', // Use sellerId as defined in the function
        name: 'Test Property',
        state: 'Test State',
        city: 'Test City',
        address: '123 Test Address',
        price: 100000,
        squaremeters: 50,
        propertyType: 'House',
        images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'] // Example images
      });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Property added successfully');
    expect(response.body.data).to.have.property('id');
    expect(response.body.data).to.have.property('name', 'Test Property'); // Verify the property name
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/property')
      .send({
        sellerId: '1', // Only providing sellerId, missing other required fields
        name: 'Test Property'
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Missing required fields: sellerId, state, city, address, price, squareMeters, propertyType");
  });
});



