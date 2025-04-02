import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/game/postNewSecret';

const decodedToken = {
    profile_id: '1',
    email: 'email@email.test',
    username: 'Yuri'
}

describe(`POST ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtVerifyStub: sinon.SinonStub;

    const mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        queryStub.restore();
        jwtVerifyStub.restore();
    });

    context('should not post new secret message', () => {
        it('should not pass missing auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 401,
                message: 'Access denied. No token provided.'
            };

            const resp = await chai.request(app).post(ROUTE).set('Authorization', '').send({
                message: "This is a secret message",
                latitude: 37.7749,
                longitude: -122.4194
            });

            expect(resp.status).to.equal(401);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with non-valid auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Invalid token.'
            };

            jwtVerifyStub.throws(new Error('Invalid token.'));

            const resp = await chai.request(app).post(ROUTE).set('Authorization', 'wrongtokenvalue').send({
                message: "This is a secret message",
                latitude: 37.7749,
                longitude: -122.4194
            });

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with missing message', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Message is required'
            };

            jwtVerifyStub.returns(decodedToken);

            const resp = await chai.request(app).post(ROUTE).set('Authorization', `Bearer ${mockToken}`).send({
                message: "",
                latitude: null,
                longitude: null
            });

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with message too long', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Message is too long. Must be less than 500 characters'
            }

            jwtVerifyStub.returns(decodedToken);

            const resp = await chai.request(app).post(ROUTE).set('Authorization', `Bearer ${mockToken}`).send({
                message: 'a'.repeat(501),
                latitude: 37.7749,
                longitude: -122.4194
            });
            
            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
        
        it('should not pass with missing latitude and longitude', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Latitude and Longitude must be valid numbers'
            };

            jwtVerifyStub.returns(decodedToken);

            const resp = await chai.request(app).post(ROUTE).set('Authorization', `Bearer ${mockToken}`).send({
                message: "This is a secret message",
                latitude: null,
                longitude: null
            });

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('should post new secret message successfully', () => {
        it('should pass', async () => {
            const mockResponse = {
                success: true,
                statusCode: 201,
                message: 'New secret message posted successfully',
            };

            const mockQueryResult = [
                {
                    profile_id: 1,
                    message: 'This is a secret message',
                    latitude: 37.7749,
                    longitude: -122.4194
                }
            ];

            jwtVerifyStub.returns(decodedToken);
            queryStub.resolves(mockQueryResult);

            const resp = await chai.request(app).post(ROUTE).set('Authorization', `Bearer ${mockToken}`).send({
                message: "This is a secret message",
                latitude: 37.7749,
                longitude: -122.4194
            });

            expect(resp.status).to.equal(201);
            expect(resp.body.success).to.be.true;
            expect(resp.body).to.deep.equal(mockResponse);
        });
    });
});