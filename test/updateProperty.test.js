import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { updateProperty } from "../api/v1/controllers/propertyController.js"
import prisma from "../DB/db.config.js"

const app = express();
app.use(express.json());
app.put('/api/property/:id', updateProperty);

describe('PUT /api/property/:id', () => {
  let propertyId;

  before(async () => {
    
    const response = await prisma.property.create({
      data: {
        sellerID: 1,
        location: 'Initial Location',
        price: 50000,
        squareMeters: 40
      }
    });
    propertyId = response.id;
  });

  after(async () => {
    // Clean up the test property
    await prisma.property.deleteMany({ where: {} });
  });

  it('should update an existing property and return success', async () => {
    const response = await request(app)
      .put(`/api/property/${propertyId}`)
      .send({
        location: 'Updated Location',
        price: 60000,
        description: 'Updated Description'
      });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Property updated successfully');
    expect(response.body.data).to.have.property('location', 'Updated Location');
    expect(response.body.data).to.have.property('price', 60000);
    expect(response.body.data).to.have.property('description', 'Updated Description');
  });

  it('should return 404 if property does not exist', async () => {
    const invalidId = 9999;  // Assuming this ID does not exist in the database
    const response = await request(app)
      .put(`/api/property/${invalidId}`)
      .send({
        location: 'Non-existent Location'
      });

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('Property not found');
  });

  it('should handle validation errors gracefully', async () => {
    const response = await request(app)
      .put(`/api/property/${propertyId}`)
      .send({
        price: 'invalid_price'  // Invalid price format
      });

    expect(response.status).to.equal(500);  
    expect(response.body.message).to.equal('Server error');
  });
});
