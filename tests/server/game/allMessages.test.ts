import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/game/getAllMessages';

describe(`GET ${ROUTE}`, () => {
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

    context('should not get all secret messages', () => {
        it('shoud not pass missing auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 401,
                message: 'Access denied. No token provided.'
            };

            const resp = await chai.request(app).get(ROUTE).set('Authorization', '').send();

            expect(resp.status).to.equal(401);
            expect(resp.body).to.include(mockResponse);

        });
        
        it('shoud not pass with non-valid auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Invalid token.'
            };

            jwtVerifyStub.throws(new Error('Invalid token.'))
            
            const resp = await chai.request(app).get(ROUTE).set('Authorization', 'wrongtokenvalue').send();

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);

        });

        it('should not pass with unexpected error', async () => {
            const mockResponse = {
                success: false,
                statusCode: 500,
                message: 'Unexpected error occurred when retrieving all secret messages'
            };

            queryStub.throws(new Error('Unexpected error occurred when retrieving all secret messages'));

            const decodedToken = {
                profile_id: '1',
                email: 'email@email.test',
                username: 'Yuri'
            }

            jwtVerifyStub.returns(decodedToken);
            
            const resp = await chai.request(app).get(ROUTE).set('Authorization', mockToken).send();

            expect(resp.status).to.equal(500);
            expect(resp.body).to.include(mockResponse);

        });
    });
    
    context('should pass with valid auth token', () => {
        it ('should pass', async () => {
            const mockResponse = {
                success: true,
                statusCode: 200,
                message: 'Retrieved all secret messages successfully',
                secretMessages: [
                    {
                        secret_id: 1,
                        message: 'Secret message from Yuri!',
                        profile_id: '1',
                        latitude: 1.0,
                        longitude: -1.0
                    }
                ]
            };

            const decodedToken = {
                profile_id: '1',
                email: 'email@email.test',
                username: 'Yuri'
            }

            const mockQueryResult = [
                [
                    {
                        secret_id: 1,
                        message: 'Secret message from Yuri!',
                        profile_id: '1',
                        latitude: 1.0,
                        longitude: -1.0
                    }
                ]
            ];

            jwtVerifyStub.returns(decodedToken);

            queryStub.resolves(mockQueryResult);

            const resp = await chai.request(app).get(ROUTE).set('Authorization', mockToken).send();

            expect(resp.status).to.equal(200);
            expect(resp.body).to.deep.equal(mockResponse);
            expect(resp.body.secretMessages).to.be.an('array').to.have.lengthOf(1);
        });
    });
});