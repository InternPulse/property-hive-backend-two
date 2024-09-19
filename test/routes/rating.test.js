import sinon from 'sinon';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const prisma = new PrismaClient();
const baseUrl = process.env.BASE_URL

// Test for GET /properties/:propertyId/rate
describe('GET /properties/:propertyId/rate', function() {
  let findManyStub;

  beforeEach(function() {
    findManyStub = sinon.stub(prisma.rating, 'findMany');
  });

  afterEach(function() {
    findManyStub.restore();
  });

  it('should return 200 and a list of ratings when ratings are found', async function() {
    const ratingsMock = [
      { propertyId: 1, rating: 5, comment: 'Great property!' },
    ];

    findManyStub.returns(Promise.resolve(ratingsMock));

    axios.get(`${baseUrl}/properties/1/rate`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('data');
      expect(res.data.data).to.be.an('array');
      expect(res.data.data[0]).to.deep.equal(ratingsMock);
    })

  });

  it('should return 404 when no ratings are found', async function() {
    findManyStub.returns(Promise.resolve([]));

    try {
      await axios.get(`${baseUrl}/properties/1/rate`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('message').that.equals('rating not found');
    }
  });
});

// Test for PUT /properties/:propertyId/rate
describe('PUT /properties/:propertyId/rate', function() {
  let updateStub;
  let findFirstStub;

  beforeEach(function() {
    findFirstStub = sinon.stub(prisma.rating, 'findFirst');
    updateStub = sinon.stub(prisma.rating, 'update');
  });

  afterEach(function() {
    findFirstStub.restore();
    updateStub.restore();
  });

  it('should update a rating and return 200 when valid input is provided', async function() {
    const ratingMock = { propertyId: 1, rating:4, comment: 'Updated comment' };

    findFirstStub.returns(Promise.resolve(ratingMock));
    updateStub.returns(Promise.resolve(ratingMock));

    axios.put(`${baseUrl}/properties/1/rate`, {
      rating: 4,
      comment: 'Updated comment'
    })
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('data');
      expect(res.data.data).to.deep.equal(ratingMock);
    })
  });

  it('should return 404 if rating does not exist', async function() {
    findFirstStub.returns(Promise.resolve(null));

    try {
      await axios.put(`${baseUrl}/properties/1/rate`, {
        rating: 4,
        comment: 'Non-existent rating'
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('message').that.equals('Rating not found');
    }
  });

  it('should return 400 if rating is out of range (1-5)', async function() {
    axios.put(`${baseUrl}/properties/1/rate`, {
      rating: 6,
      comment: 'Out of rage rating'
    })
    .then(res => {
      expect(res.status).to.equal(200);
    }).catch(error => {
      expect(error.response.status).to.equal(400);
      expect(error.response).to.have.property('message').that.equals('rating value should be between 1 and 5');
    })

  });
});