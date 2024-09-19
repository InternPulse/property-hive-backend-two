import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'; 

chai.use(chaiHttp);

describe('DELETE /api/property/:id', () => {
    let propertyId;

    before(async () => {
        // Setup: create a property to delete
        const res = await chai.request(app)
            .post('/api/v1/property')
            .send({
                sellerID: 1,
                location: 'Test Location',
                price: 100000,
                squareMeters: 50
            });
        propertyId = res.body.data.id;
    });

    it('should delete a property and return success', async () => {
        const res = await chai.request(app)
            .delete(`/api/v1/property/${propertyId}`);

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Property deleted successfully');
    });

    after(async () => {
        // Cleanup: ensure the property is deleted
        await chai.request(app)
            .delete(`/api/v1/property/${propertyId}`);
    });
});



