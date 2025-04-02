import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/profiles/me'

describe(`GET ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtVerifyStub: sinon.SinonStub;

    const
        profile_id = 1,
        mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        queryStub.restore();
        jwtVerifyStub.restore();
    });

    context('should not get profiles information', () => {
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
    });

    context('should pass with valid auth token', () => {
        it ('should pass', async () => {
            const mockResponse = {
                "success": true,
                "statusCode": 200,
                "message": "Retrieved profile data succesfully",
                "user": {
                  "profile_id": 1,
                  "email": "email@email.test",
                  "username": "amagalla",
                  "google_id": null,
                  "google_email": null,
                  'score': 5
                }
              }
            
            const decodedToken = {
                id: '1',
                email: 'email@email.test',
                username: 'amagalla'
            }

            const mockQueryResult = [
                [
                   {
                        profile_id: 1,
                        email: 'email@email.test',
                        username: 'amagalla',
                        google_id: null,
                        google_email: null,
                        score: 5
                    }
                ],
                []
            ]

            jwtVerifyStub.returns(decodedToken);

            queryStub.resolves(mockQueryResult);

            const resp = await chai.request(app).get(ROUTE).set('Authorization', `${mockToken}`).send();

            expect(resp.status).to.equal(200);
            expect(resp.body.success).to.be.true;
            expect(resp.body).to.deep.equal(mockResponse);

        })
    });
});
